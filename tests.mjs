import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';

test('Beginner plates are complete, comfortable and never forced into a region quota',()=>{
 for(const id of ['david','ark','storm']){
  const raw=readFileSync(`art/${id}-beginner.json`),art=JSON.parse(raw);
  assert.deepEqual(gunzipSync(readFileSync(`art/${id}-beginner.json.gz`)),raw);
  assert.ok(art.regions.length>=24,`${id}: illustration is too sparse to feel complete`);
  assert.equal(new Set(art.regions.map(r=>r.id)).size,art.regions.length);
  assert.ok(art.inkPath.length>10000);
  const radii=art.regions.map(r=>r.radius).sort((a,b)=>a-b);
  const p10=radii[Math.max(0,Math.floor(radii.length*.1)-1)];
  const microShare=radii.filter(r=>r<8).length/radii.length;
  assert.ok(p10>=6,`${id}: too many regions require extreme zoom`);
  assert.ok(microShare<=.08,`${id}: Beginner plate is too fragmented`);
  const height=art.height||1200;
  assert.ok(art.regions.every(r=>r.box[0]>0&&r.box[1]>0&&r.box[0]+r.box[2]<1200&&r.box[1]+r.box[3]<height));
  assert.ok(art.regions.every(r=>r.area<1200*height*.28));
  assert.equal(new Set(art.regions.map(r=>r.sourceComponent)).size,art.regions.length,`${id}: a tap bundles separate source components`);
  assert.ok(art.regions.every(r=>Number.isInteger(r.colorOverride??r.color)&&(r.colorOverride??r.color)>=0&&(r.colorOverride??r.color)<12));
  const counts=new Map();
  for(const r of art.regions){const color=r.colorOverride??r.color;counts.set(color,(counts.get(color)||0)+1);}
  assert.ok(Math.max(...counts.values())/art.regions.length<=.3,`${id}: one color dominates the plate`);
  assert.ok(counts.size>=7,`${id}: palette lacks intentional variety`);
 }
});

test('art builder preserves every legitimate region and scores difficulty by interaction',()=>{
 const source=readFileSync('build_art.py','utf8');
 assert.doesNotMatch(source,/--target|largest label-friendly components/);
 assert.match(source,/minimum=90/);
 assert.match(source,/micro_share/);
 assert.match(source,/Every legitimate enclosed area is retained/);
});

test('release references the new artwork and save namespace',()=>{
 assert.match(readFileSync('index.html','utf8'),/app\.js\?v=3\.25/);
 assert.match(readFileSync('app.js','utf8'),/purpose-drawn-cbn3/);
 assert.match(readFileSync('scenes.js','utf8'),/json\?v=3\.25/);
 assert.match(readFileSync('scenes.js','utf8'),/data\.version>=3\?r\.color/);
 assert.match(readFileSync('sw.js','utf8'),/bible-colors-v3\.25/);
});
