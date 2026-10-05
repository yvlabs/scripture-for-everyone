import {readEntries,validateEntries} from './directory.mjs';
const records=validateEntries(readEntries());
const now=Date.now();
const stale=records.filter(r=>now-Date.parse(r.last_reviewed)>90*86400000).map(r=>r.id);
console.log(JSON.stringify({checked_at:new Date().toISOString(),stale_after_days:90,stale_records:stale},null,2));
