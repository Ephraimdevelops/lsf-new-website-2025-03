import test from 'node:test';
import assert from 'node:assert/strict';
import {loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {evaluate}=loadHandlerModule('convex/aiQuality.ts');
test('quality evaluation cannot spend AI budget without authentication',async()=>{await assert.rejects(evaluate._handler({auth:{getUserIdentity:async()=>null}},{caseId:'greeting_en',model:'gpt-4o'}),/Unauthorized/);});
test('quality evaluation rejects non-admin users before model construction',async()=>{await assert.rejects(evaluate._handler({auth:{getUserIdentity:async()=>({subject:'person'})},runQuery:async()=>({roles:['beneficiary']})},{caseId:'greeting_en',model:'gpt-4o'}),/Administrator required/);});
test('admin evaluation only accepts predefined fictional cases',async()=>{await assert.rejects(evaluate._handler({auth:{getUserIdentity:async()=>({subject:'qa'})},runQuery:async()=>({roles:['admin']})},{caseId:'arbitrary-private-chat',model:'gpt-4o'}),/Unknown review case/);});
