import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';

test('purpose-drawn Beginner plates are closed, large and label-friendly',()=>{
 for(const id of ['david','ark','storm']){
  const raw=readFileSync(`art/${id}-beginner.json`),art=JSON.parse(raw);
  assert.deepEqual(gunzipSync(readFileSync(`art/${id}-beginner.json.gz`)),raw);
  assert.equal(art.regions.length,id==='storm'?80:28);
  assert.equal(new Set(art.regions.map(r=>r.id)).size,art.regions.length);
  assert.ok(art.inkPath.length>10000);
  assert.ok(art.regions.every(r=>r.radius>=(id==='storm'?5:10)));
  const height=art.height||1200;
  assert.ok(art.regions.every(r=>r.box[0]>0&&r.box[1]>0&&r.box[0]+r.box[2]<1200&&r.box[1]+r.box[3]<height));
  assert.ok(art.regions.every(r=>r.area<1200*height*.28));
  assert.equal(new Set(art.regions.map(r=>r.sourceComponent)).size,art.regions.length,`${id}: a tap bundles separate source components`);
  assert.ok(art.regions.every(r=>Number.isInteger(r.colorOverride??r.color)&&(r.colorOverride??r.color)>=0&&(r.colorOverride??r.color)<12));
  const counts=new Map();
  for(const r of art.regions){const color=r.colorOverride??r.color;counts.set(color,(counts.get(color)||0)+1);}
  assert.ok(Math.max(...counts.values())<=(id==='storm'?20:8),`${id}: one color dominates the plate`);
  assert.ok(counts.size>=7,`${id}: palette lacks intentional variety`);
 }
});

test('release references the new artwork and save namespace',()=>{
 assert.match(readFileSync('index.html','utf8'),/app\.js\?v=3\.24/);
 assert.match(readFileSync('app.js','utf8'),/purpose-drawn-cbn3/);
 assert.match(readFileSync('scenes.js','utf8'),/json\?v=3\.24/);
 assert.match(readFileSync('scenes.js','utf8'),/data\.version>=3\?r\.color/);
 assert.match(readFileSync('sw.js','utf8'),/bible-colors-v3\.24/);
});
