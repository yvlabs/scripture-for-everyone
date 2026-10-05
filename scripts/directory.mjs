import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Ajv from 'ajv';
export const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const GROUPS = ['needs', 'efforts', 'tasks'];
export const MAX_BYTES = 32768;
export const MAX_RECORDS = 1000;
export function publicURL(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') &&
      !net.isIP(u.hostname.replace(/^\[|\]$/g, '')) && /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/i.test(u.hostname) &&
      !/(^|\.)(localhost|local|internal|test|invalid|example|onion)$/i.test(u.hostname) &&
      !/[\x00-\x20\\<>]/.test(value) && !/[?&](?:token|key|app_key|access_token|signature)=/i.test(value);
  } catch { return false; }
}
export function validDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
}
const ajv = new Ajv({ allErrors: true, strict: true });
ajv.addFormat('public-url', publicURL);
ajv.addFormat('date', validDate);
const validateSchema = ajv.compile(JSON.parse(fs.readFileSync(path.join(ROOT, 'schemas/record.schema.json'))));
export function parseRecord(source) {
  if (Buffer.byteLength(source) > MAX_BYTES) throw Error('record exceeds 32 KiB');
  const doc = YAML.parseDocument(source, { uniqueKeys: true, strict: true, schema: 'core' });
  if (doc.errors.length || doc.warnings.length) throw Error('invalid YAML or unsupported tags');
  const value = doc.toJS({ maxAliasCount: 0 });
  if (!value || Array.isArray(value) || typeof value !== 'object') throw Error('expected a record object');
  return value;
}
export function checkText(source) {
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(source)) throw Error('control characters are not allowed');
  if (/(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[A-Z0-9]{16})/.test(source)) throw Error('possible credential; remove it and follow SECURITY.md');
}
export function validateEntries(entries, now = new Date().toISOString().slice(0,10)) {
  if (!validDate(now)) throw Error('invalid validation date');
  if (entries.length > MAX_RECORDS) throw Error('directory exceeds current review limit');
  const records = [], ids = new Set(), names = new Set(), urls = new Set();
  for (const [filename, source] of entries) {
    if (!/^(needs|efforts|tasks)\/(need|effort|task)-[a-z0-9]+(?:-[a-z0-9]+)*\.yaml$/.test(filename)) throw Error('invalid record path');
    checkText(source);
    const r = parseRecord(source);
    const scan = value => {
      if (typeof value === 'string') checkText(value);
      else if (Array.isArray(value)) value.forEach(scan);
      else if (value && typeof value === 'object') Object.values(value).forEach(scan);
    };
    scan(r);
    if (!validateSchema(r)) throw Error(`${filename}: record does not match schema (${validateSchema.errors.slice(0,3).map(e=>e.keyword).join(', ')})`);
    if (filename !== `${r.kind}s/${r.id}.yaml` || !r.id.startsWith(`${r.kind}-`)) throw Error('record path and ID do not agree');
    if (ids.has(r.id)) throw Error('duplicate ID');
    const nameKey = `${r.kind}:${r.name.normalize('NFKC').trim().toLowerCase()}`;
    if (names.has(nameKey)) throw Error('duplicate name');
    ids.add(r.id); names.add(nameKey);
    if (r.last_reviewed > now || r.evidence.some(e => e.observed > now || e.observed > r.last_reviewed)) throw Error('future or inconsistent observation date');
    if (r.kind === 'effort') {
      const u = new URL(r.url); const key = u.origin + u.pathname.replace(/\/$/, '');
      if (urls.has(key)) throw Error('duplicate effort URL'); urls.add(key);
      if (r.relationship === 'participating' && (!r.contact || /^(unknown|unassigned)$/i.test(r.operator))) throw Error('participating efforts need an accountable operator and contact');
    }
    records.push(r);
  }
  for (const r of records) {
    const refs = r.efforts || r.needs || r.related || [];
    if (refs.some(id => !ids.has(id))) throw Error(`${r.id}: unresolved record reference`);
    if (r.kind === 'need' && refs.some(id=>!id.startsWith('effort-'))) throw Error('need references must identify efforts');
    if (r.kind === 'effort' && refs.some(id=>!id.startsWith('need-'))) throw Error('effort references must identify needs');
  }
  return records.sort((a,b)=>a.id.localeCompare(b.id,'en'));
}
export function readEntries(root = ROOT) {
  const entries=[];
  for(const group of GROUPS) {
    const dir=path.join(root,group);
    if(fs.lstatSync(dir).isSymbolicLink()) throw Error('record directory cannot be a symlink');
    for(const name of fs.readdirSync(dir).sort()) {
      if(!name.endsWith('.yaml')) throw Error('only flat YAML records belong in record directories');
      const file=path.join(dir,name), stat=fs.lstatSync(file);
      if(!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_BYTES) throw Error('unsafe record file');
      entries.push([`${group}/${name}`,fs.readFileSync(file,'utf8')]);
    }
  }
  return entries;
}
export const escapeMD = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/[\\`*_{}\[\]()#+.!|~-]/g,'\\$&').replace(/[\r\n]+/g,' ');
export function generate(records) {
  let md='# Directory\n\nGenerated from the YAML records. Change the records, then run `npm run generate`.\n\nA listing is not proof that an audience is fully served. Evidence levels describe the checked scope; read each record’s limitations. Task progress and seven-day claims live in GitHub Issues.\n';
  for(const [kind,heading] of [['need','Needs to investigate'],['effort','Existing and participating efforts'],['task','Ways to help']]) {
    md+=`\n## ${heading}\n`;
    for(const r of records.filter(r=>r.kind===kind)) {
      md+=`\n### ${escapeMD(r.name)}\n\n${escapeMD(r.summary)}\n\n`;
      if(kind==='effort') md+=`Status: **${r.status}** · ${r.relationship} · ${r.evidence_level} · last reviewed ${r.last_reviewed}.\n\n`;
      if(kind==='need') md+=`Status: **${r.status}** · last reviewed ${r.last_reviewed}.\n\n${escapeMD(r.research_question)}\n\n`;
      md+=`[Record](${kind}s/${r.id}.yaml)`;
      if(kind==='effort')md+=` · [Project](<${r.url}>)`;
      if(kind==='task' && r.issue)md+=` · [Work on this task](${r.issue})`;
      md+='\n';
    }
  }
  return {'DIRECTORY.md':md,'directory.json':JSON.stringify({schema_version:1,records},null,2)+'\n'};
}
export function verifyGenerated(outputs, read) {
  for(const [filename,value]of Object.entries(outputs))if(read(filename)!==value)throw Error(`${filename}: regenerate directory outputs`);
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const records=validateEntries(readEntries()); const outputs=generate(records);
    if(process.argv[2]==='generate')for(const [name,value]of Object.entries(outputs))fs.writeFileSync(path.join(ROOT,name),value);
    else verifyGenerated(outputs,name=>fs.readFileSync(path.join(ROOT,name),'utf8'));
    console.log(`Validated ${records.length} records; generated directory is consistent.`);
  }catch(e){console.error(e.message);process.exitCode=1;}
}
