export function repository(value) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value || '')) throw Error('invalid repository');
  return value;
}
export function client(token, fetcher = fetch) {
  if(!token)throw Error('GitHub token required');
  return async (route, method='GET', body) => {
    if(!route.startsWith('/repos/') || /[\r\n\\]/.test(route))throw Error('invalid GitHub API route');
    const r=await fetcher(`https://api.github.com${route}`,{method,redirect:'error',signal:AbortSignal.timeout(20000),headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
    if(!r.ok)throw Error(`GitHub ${method} failed (${r.status})`);
    const source=await r.text();
    if(source.length>8_000_000)throw Error('GitHub response exceeds limit');
    return source?JSON.parse(source):{};
  };
}
export async function pages(api,route,limit=300) {
  const all=[];
  for(let page=1;page<=Math.ceil(limit/100)+1;page++) {
    const items=await api(`${route}${route.includes('?')?'&':'?'}per_page=100&page=${page}`);
    if(!Array.isArray(items))throw Error('expected GitHub list');
    all.push(...items);
    if(all.length>limit)throw Error('GitHub list exceeds review limit');
    if(items.length<100)return all;
  }
  throw Error('incomplete GitHub list');
}
