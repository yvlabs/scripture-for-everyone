import {client,repository,pages} from './github.mjs';
const api=client(process.env.GITHUB_TOKEN),repo=repository(process.env.GITHUB_REPOSITORY);
const title='Central intake needs attention';
const drill=process.env.DRILL==='true';
const failed=process.env.REVIEW_RESULT!=='success';
const issues=await pages(api,`/repos/${repo}/issues?state=open&labels=operations`,100);
const existing=issues.find(i=>!i.pull_request&&i.title===title&&i.user?.login==='github-actions[bot]');
const run=process.env.GITHUB_RUN_ID;
if(!/^\d+$/.test(run||''))throw Error('invalid run ID');
const link=`https://github.com/${repo}/actions/runs/${run}`;
if(failed&&!existing)await api(`/repos/${repo}/issues`,'POST',{title,labels:['operations'],body:`${drill?'Planned failure drill.':'The scheduled or manual intake failed.'} Inspect [the run](${link}). The next successful intake will close this issue. This is same-platform failure reporting, not an independent missed-run alert.`});
else if(!failed&&existing){await api(`/repos/${repo}/issues/${existing.number}/comments`,'POST',{body:`Recovery verified by [this successful intake](${link}).`});await api(`/repos/${repo}/issues/${existing.number}`,'PATCH',{state:'closed'});}
