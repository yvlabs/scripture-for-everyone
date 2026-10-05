import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {client,repository,pages} from './github.mjs';
import {readEntries,validateEntries} from './directory.mjs';
const LEASE_MS=7*86400000;
export function activeClaim(comments, now=Date.now()) {
  let current=null;
  for(const c of [...comments].sort((a,b)=>a.id-b.id)) {
    const at=Date.parse(c.created_at);
    if(!Number.isFinite(at)||at>now||c.updated_at!==c.created_at||c.user?.type!=='User')continue;
    if(current&&current.expires_at<=at)current=null;
    const command=(c.body||'').split('\n')[0].trim();
    if(command==='/release'&&current?.login===c.user.login)current=null;
    if(command==='/claim'&&(!current||current.login===c.user.login))current={login:c.user.login,expires_at:at+LEASE_MS,comment_id:c.id};
  }
  return current&&current.expires_at>now?{...current,expires_at:new Date(current.expires_at).toISOString()}:null;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const repo=repository(process.env.GITHUB_REPOSITORY||'yvlabs/scripture-for-everyone');
  const api=client(process.env.GITHUB_TOKEN);
  const tasks=validateEntries(readEntries()).filter(r=>r.kind==='task'&&r.issue).slice(0,100);
  const result=[];
  for(const t of tasks){const number=t.issue.split('/').at(-1);const issue=await api(`/repos/${repo}/issues/${number}`);const comments=await pages(api,`/repos/${repo}/issues/${number}/comments`,1000);result.push({task:t.id,issue:t.issue,state:issue.state,claim:issue.state==='open'?activeClaim(comments):null});}
  console.log(JSON.stringify(result,null,2));
}
