import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {resolveConfig,transformWithEsbuild} from 'vite';

test('the web build can transpile shared mobile helpers without Expo installed',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'haki-web-transpile-'));
  try{
    const mobile=path.join(root,'mobile');
    await fs.mkdir(path.join(mobile,'src'),{recursive:true});
    await fs.writeFile(path.join(mobile,'tsconfig.json'),JSON.stringify({extends:'expo/tsconfig.base'}));
    const filename=path.join(mobile,'src','shared-fixture.ts');
    const source='export const fixture: number = 7;';
    await fs.writeFile(filename,source);
    const config=await resolveConfig({configFile:path.resolve('vite.config.ts'),mode:'production'},'build');
    const result=await transformWithEsbuild(source,filename,config.esbuild);
    assert.match(result.code,/fixture = 7/);
    assert.doesNotMatch(result.code,/: number/);
  }finally{
    await fs.rm(root,{recursive:true,force:true});
  }
});
