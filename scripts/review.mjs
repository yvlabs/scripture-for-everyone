import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEntries, generate, verifyGenerated, MAX_BYTES, MAX_RECORDS } from './directory.mjs';
import { client, repository, pages } from './github.mjs';
const TRUSTED_REVIEWERS = ['yvlabs'];
const SHA=/^[a-f0-9]{40}$/;
const RECORD=/^(needs|efforts|tasks)\/(need|effort|task)-[a-z0-9]+(?:-[a-z0-9]+)*\.yaml$/;
export function dataOnly(files) {
  return files.length>0 && files.length<=50 && files.every(f => ['added','modified','removed'].includes(f.status) && !f.previous_filename && (RECORD.test(f.filename) || ['DIRECTORY.md','directory.json'].includes(f.filename)));
}
export function decision(comments,head,base) {
  if(!SHA.test(head)||!SHA.test(base))throw Error('invalid revision');
  let result='pending';
  for(const c of [...comments].sort((a,b)=>a.id-b.id)) {
    if(!TRUSTED_REVIEWERS.includes(c.user?.login) || c.user?.type!=='User')continue;
    const first=(c.body||'').split('\n')[0].trim();
    const m=/^\/central (approve|hold|reject) ([a-f0-9]{40}) ([a-f0-9]{40})$/.exec(first);
    if(m && m[2]===head && m[3]===base)result=m[1];
  }
  return result;
}
async function snapshot(api,repo,sha) {
  if(!SHA.test(sha))throw Error('invalid commit');
  const tree=await api(`/repos/${repository(repo)}/git/trees/${sha}?recursive=1`);
  if(tree.truncated || !Array.isArray(tree.tree) || tree.tree.length>10000)throw Error('tree exceeds review limit');
  const entries=[], generated={};
  const targets=tree.tree.filter(e=>/^(needs|efforts|tasks)(\/|$)/.test(e.path)||['DIRECTORY.md','directory.json'].includes(e.path));
  if(targets.length>MAX_RECORDS+5)throw Error('too many directory entries');
  for(const e of targets) {
    if(['needs','efforts','tasks'].includes(e.path) && e.type==='tree' && e.mode==='040000')continue;
    const record=RECORD.test(e.path), output=['DIRECTORY.md','directory.json'].includes(e.path);
    if((!record&&!output)||e.type!=='blob'||e.mode!=='100644'||!SHA.test(e.sha))throw Error('unsafe directory tree entry');
    const limit=record?MAX_BYTES:2_000_000;
    if(e.size>limit)throw Error('directory blob too large');
    const blob=await api(`/repos/${repository(repo)}/git/blobs/${e.sha}`);
    if(blob.encoding!=='base64'||blob.size>limit)throw Error('unsupported directory blob');
    const source=Buffer.from(blob.content,'base64').toString('utf8');
    if(Buffer.byteLength(source)>limit)throw Error('directory blob too large');
    if(record)entries.push([e.path,source]);else generated[e.path]=source;
  }
  if(!entries.length)throw Error('empty directory');
  const records=validateEntries(entries);
  verifyGenerated(generate(records),name=>generated[name]);
  return records.length;
}
export async function reviewOne(api,repo,number,{apply=false}={}) {
  repository(repo);
  if(!Number.isInteger(number)||number<1)throw Error('invalid PR number');
  const prefix=`/repos/${repo}`;
  const pr=await api(`${prefix}/pulls/${number}`);
  if(pr.state!=='open'||pr.draft)return {number,outcome:'skipped'};
  const head=pr.head.sha;
  if(!SHA.test(head)||pr.base.ref!=='main')return {number,outcome:'manual-scope'};
  const base=(await api(`${prefix}/git/ref/heads/main`)).object.sha;
  if(!SHA.test(base))throw Error('invalid base');
  const files=await pages(api,`${prefix}/pulls/${number}/files`,100);
  if(files.length!==pr.changed_files)throw Error('incomplete changed file list');
  const safe=dataOnly(files);
  let outcome='needs-maintainer-review', valid=false;
  if(safe) {
    try {
      if(!pr.head.repo || pr.head.repo.private)throw Error('candidate must be public');
      await snapshot(api,pr.head.repo.full_name,head);
      valid=true;outcome='needs-content-review';
    } catch {outcome='needs-correction';}
  }
  if(apply)await api(`${prefix}/statuses/${head}`,'POST',{state:valid?'success':safe?'failure':'pending',context:'directory/validate',description:valid?'Data valid; content review is still required.':safe?'Records invalid. Run npm run validate locally.':'Code or policy change: separate maintainer review.'});
  const comments=await pages(api,`${prefix}/issues/${number}/comments`,1000);
  const verdict=decision(comments,head,base);
  if(verdict==='reject') {
    outcome='rejected';
    if(apply)await api(`${prefix}/pulls/${number}`,'PATCH',{state:'closed'});
  } else if(verdict==='hold')outcome='held';
  else if(valid && verdict==='approve') {
    const current=await api(`${prefix}/pulls/${number}`);
    const currentBase=(await api(`${prefix}/git/ref/heads/main`)).object.sha;
    if(current.head.sha!==head||currentBase!==base||current.state!=='open'||current.draft)outcome='changed-after-review';
    else if(current.mergeable!==true || current.mergeable_state!=='clean')outcome='waiting-for-merge-readiness';
    else {
      outcome=apply?'merged':'would-merge';
      if(apply) {
        const merged=await api(`${prefix}/pulls/${number}/merge`,'PUT',{sha:head,merge_method:'squash'});
        if(!merged.merged)throw Error('merge was not confirmed');
      }
    }
  }
  const marker=`<!-- central-review:${head}:${base}:${outcome} -->`;
  if(apply && !comments.some(c=>c.user?.login==='github-actions[bot]' && (c.body||'').includes(marker))) {
    // Only fixed text, numbers and validated SHAs enter the public comment.
    const body=`${marker}\nCentral intake: **${outcome}**.\n\nHead: \`${head}\`\nBase: \`${base}\`\n\nSchema checks do not establish good intent, licensing or audience fit. A central maintainer reviews evidence and conduct before approving. See [the review guide](https://github.com/${repo}/blob/main/guides/central-review.md).`;
    await api(`${prefix}/issues/${number}/comments`,'POST',{body});
  }
  return {number,head,base,outcome};
}
export async function run(api,repo,{apply=false,number=null}={}) {
  const prs=number?[{number}]:await api(`/repos/${repository(repo)}/pulls?state=open&sort=created&direction=asc&per_page=20`);
  const results=[];
  for(const pr of prs.slice(0,20))results.push(await reviewOne(api,repo,pr.number,{apply}));
  return results;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const repo=repository(process.env.GITHUB_REPOSITORY||'yvlabs/scripture-for-everyone');
    const num=process.env.PR_NUMBER?Number(process.env.PR_NUMBER):null;
    const results=await run(client(process.env.GITHUB_TOKEN),repo,{apply:process.argv.includes('--apply'),number:num});
    const report={checked_at:new Date().toISOString(),mode:process.argv.includes('--apply')?'apply':'read-only',results};
    console.log(JSON.stringify(report,null,2));
    if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`## Central intake\n\nChecked ${results.length} pull requests. ${results.filter(r=>r.outcome==='merged').length} merged after commit-specific central approval.\n\nSemantic agent review is supervised; this job does not run a language model.\n`);
  }catch{console.error('Central intake failed. Inspect the run and retry; no credential or untrusted payload is logged.');process.exitCode=1;}
}
