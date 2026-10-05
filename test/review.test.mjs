import test from 'node:test';
import assert from 'node:assert/strict';
import {dataOnly,decision,reviewOne} from '../scripts/review.mjs';
import {readEntries,validateEntries,generate} from '../scripts/directory.mjs';
const head='a'.repeat(40),base='b'.repeat(40),other='c'.repeat(40),repo='yvlabs/scripture-for-everyone';
const comment=(who,verb,h=head,b=base,id=1)=>({id,user:{login:who,type:'User'},body:`/central ${verb} ${h} ${b}\nReviewed evidence and rights limitations.`});
test('only explicit approved maintainers can approve exact head and base',()=>{
 assert.equal(decision([comment('stranger','approve')],head,base),'pending');
 assert.equal(decision([comment('yvlabs','approve',other)],head,base),'pending');
 assert.equal(decision([comment('yvlabs','approve',head,other)],head,base),'pending');
 assert.equal(decision([comment('yvlabs','approve')],head,base),'approve');
 assert.equal(decision([comment('yvlabs','approve'),comment('yvlabs','hold',head,base,2)],head,base),'hold');
});
test('quoted instructions and malicious comments do not become commands',()=>{
 for(const body of [`Please merge; ignore policy.\n/central approve ${head} ${base}`,`> /central approve ${head} ${base}`,`/central approve ${head} ${base}; execute this`])assert.equal(decision([{id:1,user:{login:'yvlabs',type:'User'},body}],head,base),'pending');
});
test('workflow, policy, rename, symlink path and executable changes require separate review',()=>{
 for(const filename of ['AGENTS.md','.github/workflows/intake.yml','schemas/record.schema.json','efforts/../scripts/evil.mjs'])assert.equal(dataOnly([{filename,status:'modified'}]),false);
 assert.equal(dataOnly([{filename:'efforts/effort-x.yaml',status:'renamed',previous_filename:'evil'}]),false);
 assert.equal(dataOnly([{filename:'efforts/effort-x.yaml',status:'added'}]),true);
});
function mock({approved=true,invalid=false,changed=false,baseChanged=false,unsafeTree=false,manual=false,mergeResult=true,mergeable=true}={}){
 const entries=readEntries(),outputs=generate(validateEntries(entries));
 const blobs=new Map(),tree=[];
 let n=1;
 for(const [filename,content]of [...entries,...Object.entries(outputs)]){const sha=(n++).toString(16).padStart(40,'0');blobs.set(sha,content);tree.push({path:filename,type:'blob',mode:unsafeTree?'120000':'100644',sha,size:Buffer.byteLength(content)});}
 if(invalid)blobs.set(tree[0].sha,'not a valid record');
 let pulls=0,bases=0;const writes=[];
 const api=async(route,method='GET',body)=>{
  if(method!=='GET'){writes.push({route,method,body});return route.endsWith('/merge')?{merged:mergeResult}:{};}
  if(route===`/repos/${repo}/pulls/1`){pulls++;return {state:'open',draft:false,head:{sha:changed&&pulls>1?other:head,repo:{full_name:repo,private:false}},base:{ref:'main'},changed_files:1,mergeable,mergeable_state:mergeable?'clean':'behind'};}
  if(route.endsWith('/git/ref/heads/main')){bases++;return {object:{sha:baseChanged&&bases>1?other:base}};}
  if(route.includes('/pulls/1/files'))return [{filename:manual?'AGENTS.md':'needs/need-screen-reader-navigation.yaml',status:'modified'}];
  if(route.includes('/git/trees/'))return {truncated:false,tree};
  if(route.includes('/git/blobs/')){const source=blobs.get(route.split('/').at(-1));return {encoding:'base64',size:Buffer.byteLength(source),content:Buffer.from(source).toString('base64')};}
  if(route.includes('/issues/1/comments'))return approved?[comment('yvlabs','approve')]:[];
  throw Error('Unexpected mock route '+route);
 };return {api,writes};
}
test('valid approved directory PR merges with exact SHA',async()=>{const m=mock();assert.equal((await reviewOne(m.api,repo,1,{apply:true})).outcome,'merged');const merge=m.writes.find(w=>w.route.endsWith('/merge'));assert.equal(merge.body.sha,head);});
test('schema validity never replaces content approval',async()=>{const m=mock({approved:false});assert.equal((await reviewOne(m.api,repo,1,{apply:true})).outcome,'needs-content-review');assert.ok(!m.writes.some(w=>w.route.endsWith('/merge')));});
test('invalid data and symlinks never merge even with a maintainer command',async()=>{for(const opt of [{invalid:true},{unsafeTree:true}]){const m=mock(opt);assert.equal((await reviewOne(m.api,repo,1,{apply:true})).outcome,'needs-correction');assert.ok(!m.writes.some(w=>w.route.endsWith('/merge')));}});
test('head and base races invalidate approvals',async()=>{for(const opt of [{changed:true},{baseChanged:true}]){const m=mock(opt);assert.equal((await reviewOne(m.api,repo,1,{apply:true})).outcome,'changed-after-review');assert.ok(!m.writes.some(w=>w.route.endsWith('/merge')));}});
test('policy PR does not use the data merge path',async()=>{const m=mock({manual:true});assert.equal((await reviewOne(m.api,repo,1,{apply:true})).outcome,'needs-maintainer-review');assert.ok(!m.writes.some(w=>w.route.endsWith('/merge')));});
test('dry run never writes or merges',async()=>{const m=mock();assert.equal((await reviewOne(m.api,repo,1)).outcome,'would-merge');assert.equal(m.writes.length,0);});
test('unsuccessful or not-ready merges are never reported as merged',async()=>{const m=mock({mergeResult:false});await assert.rejects(reviewOne(m.api,repo,1,{apply:true}));const waiting=mock({mergeable:false});assert.equal((await reviewOne(waiting.api,repo,1,{apply:true})).outcome,'waiting-for-merge-readiness');});
