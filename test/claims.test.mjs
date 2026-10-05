import test from 'node:test';import assert from 'node:assert/strict';import {activeClaim} from '../scripts/claims.mjs';
const day=86400000,start=Date.parse('2026-10-01T00:00:00Z');
const c=(id,login,body,offset=0)=>({id,user:{login,type:'User'},body,created_at:new Date(start+offset*day).toISOString(),updated_at:new Date(start+offset*day).toISOString()});
test('first active claim wins; a second operator cannot steal it',()=>assert.equal(activeClaim([c(1,'one','/claim'),c(2,'two','/claim',1)],start+2*day).login,'one'));
test('expired claim reopens work and may be replaced',()=>{assert.equal(activeClaim([c(1,'one','/claim')],start+7*day),null);assert.equal(activeClaim([c(1,'one','/claim'),c(2,'two','/claim',8)],start+9*day).login,'two');});
test('only holder renews or releases an active claim',()=>{assert.equal(activeClaim([c(1,'one','/claim'),c(2,'two','/release',1)],start+2*day).login,'one');assert.equal(activeClaim([c(1,'one','/claim'),c(2,'one','/release',1)],start+2*day),null);assert.equal(activeClaim([c(1,'one','/claim'),c(2,'one','/claim\nProgress recorded.',6)],start+8*day).login,'one');});
test('edited, future and quoted claim commands have no lease effect',()=>{const edit=c(1,'one','/claim');edit.updated_at=new Date(start+day).toISOString();assert.equal(activeClaim([edit,c(2,'two','quoted /claim'),c(3,'three','/claim',3)],start+2*day),null);});
