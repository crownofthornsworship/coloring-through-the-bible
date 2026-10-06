import * as classic from './legacy-art.js?v=2.2';
export const palette=classic.palette,colorNames=classic.colorNames;
export const showcase=['david','ark','storm'];
export const levels=['beginner','easy','medium','hard','expert'];
export const scenes=classic.scenes.map(s=>({...s,showcase:showcase.includes(s.id),...(s.id==='david'?{title:'David and Goliath',story:'David trusted the Lord when he faced Goliath. He chose five smooth stones and went forward with his sling. The victory belonged to God.',think:'What helps you trust God when a challenge feels bigger than you?'}:{}),...(s.id==='ark'?{think:'How can remembering God’s faithfulness help you today?'}:{}),...(s.id==='storm'?{think:'When you feel afraid, how can you turn to Jesus?'}:{})}));
const cache=new Map();
function simplifyInkPath(d,tolerance=1.45){
 const sq=tolerance*tolerance;
 const dist2=(p,a,b)=>{let x=a[0],y=a[1],dx=b[0]-x,dy=b[1]-y;if(dx||dy){const t=Math.max(0,Math.min(1,((p[0]-x)*dx+(p[1]-y)*dy)/(dx*dx+dy*dy)));x+=dx*t;y+=dy*t}dx=p[0]-x;dy=p[1]-y;return dx*dx+dy*dy};
 const rdp=pts=>{if(pts.length<3)return pts;let best=0,idx=0;for(let i=1;i<pts.length-1;i++){const q=dist2(pts[i],pts[0],pts[pts.length-1]);if(q>best){best=q;idx=i}}if(best>sq){const a=rdp(pts.slice(0,idx+1)),b=rdp(pts.slice(idx));return a.slice(0,-1).concat(b)}return [pts[0],pts[pts.length-1]]};
 return d.replace(/M([^Z]+)Z/g,(_,body)=>{const pts=[...body.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m=>[+m[1],+m[2]]);if(pts.length<4)return 'M'+body+'Z';const closed=pts.concat([pts[0]]),clean=rdp(closed);return 'M'+clean.map(p=>p[0]+','+p[1]).join('L')+'Z'});
}
export async function ensureArt(scene,difficulty){if(!difficulty.startsWith('v2-'))return;const level=difficulty.slice(3),key=scene.id+':'+level;if(cache.has(key))return;let data;if(false&&'DecompressionStream' in globalThis){const response=await fetch(`./art/${scene.id}-${level}.json.gz?v=3.11`);if(!response.ok)throw Error('Artwork unavailable');data=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json();}else{const response=await fetch(`./art/${scene.id}-${level}.json?v=3.11`);if(!response.ok)throw Error('Artwork unavailable');data=await response.json();}cache.set(key,data);if(cache.size>3)cache.delete(cache.keys().next().value);}
function displayColor(scene,level,r){
 // The new full-coverage David Beginner production asset already contains
 // intentional palette assignments. Do not run the legacy positional recolor
 // heuristic over it.
 if(scene.id==='david'&&level==='beginner')return Number(r.color);
 if(r.colorOverride!=null)return r.colorOverride;
 const x=r.x,y=r.y,area=r.area||0,[bx,by,bw,bh]=r.box||[x,y,0,0],cx=bx+bw/2,cy=by+bh/2;
 // Scene-aware compatibility map for already-generated V2 assets.
 // Narrow upper enclosed bands are clouds/light; broad upper enclosed fields are sky.
 if(scene.id==='david'){
   if(cy<410){
     // David plate: the giant broad field is the open sky. The long enclosed
     // scalloped bands beneath it are clouds and must remain cream/light.
     if(area>90000||bw>850)return 0;
     if(bw>55&&area<60000)return 10;
     if(cx<380)return 3;
   }
   if(cy>880&&area>5000)return 8;
   if(cy>650&&cx<650)return area>3500?2:8;
   if(cx>690&&cy>390)return [4,8,9,11,10][(Math.floor(cx/120)+Math.floor(cy/140))%5];
 }
 if(scene.id==='ark'){
   if(cy<430){if(area>24000||bw>420)return 0;if(bw>65&&area<16000)return 10;}
   if(cy>760)return area>5000?2:8;
   if(cx>250&&cx<950&&cy>350)return [9,11,8,4][(Math.floor(cx/130)+Math.floor(cy/150))%4];
 }
 if(scene.id==='storm'){
   if(cy<430){if(area>22000||bw>400)return 7;if(bw>65&&area<16000)return 10;}
   if(cy>690)return 7;
   if(cy>450&&area>5000)return 7;
 }
 if(cy<430&&area>18000)return 0;
 if(cy<560&&area<18000)return 10;
 if(cy>880&&area>6500)return 8;
 if(cy>690&&area>3500)return 2;
 if(cx<330&&cy<760)return 3;
 const natural=[10,8,2,9,11,4,3,6,7];
 return natural[(Math.floor(cx/105)+Math.floor(cy/125)+Math.floor(area/2200))%natural.length];
}
function normalizedRegions(scene,level,data){
 const key=scene.id+':'+level;
 if(data._normalizedKey===key&&data._normalizedRegions)return data._normalizedRegions;
 data._normalizedKey=key;
 return data._normalizedRegions=data.regions.map((r,i)=>({...r,id:i,color:displayColor(scene,level,r)}));
}
export function illustration(scene,difficulty='easy',fills={},preview=false,numbers=true){
 if(!difficulty.startsWith('v2-'))return classic.illustration(scene,difficulty,fills,preview,numbers);
 const level=difficulty.slice(3),data=cache.get(scene.id+':'+level);
 if(!data)return {regions:[],svg:`<svg xmlns="http://www.w3.org/2000/svg" class="color-art" viewBox="0 0 1200 1200"><image href="art/${scene.id}-thumb.jpg" width="1200" height="1200"/></svg>`};
 const regions=normalizedRegions(scene,level,data);
 const paths=regions.map(r=>`<path d="${r.d}" fill="${fills[r.id]|| (preview?palette[r.color]:'#fffdf6')}" fill-rule="evenodd" data-region="${r.id}" data-color="${r.color}" role="button" tabindex="0" aria-label="${r.name}, color ${r.color+1}"/>`).join('');
 const inkOpacity=1;
 const labels=numbers?regions.map(r=>`<text x="${r.x}" y="${r.y}" data-label="${r.id}" data-radius="${r.radius}" text-anchor="middle" dominant-baseline="central" font-family="system-ui" font-size="16" fill="#303c35" pointer-events="none">${r.color+1}</text>`).join(''):'';
 return {regions,svg:`<svg xmlns="http://www.w3.org/2000/svg" class="color-art" viewBox="0 0 1200 1200" role="img" aria-label="${scene.title} coloring illustration"><rect width="1200" height="1200" fill="#fffdf6"/>${paths}<path d="${data.inkPath}" fill="#20251f" fill-opacity="${inkOpacity}" fill-rule="evenodd" pointer-events="none"/>${labels}</svg>`};
}
