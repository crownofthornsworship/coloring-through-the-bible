// Original SVG illustrations created for Light & Life Games. No external assets.
export const palette=['#87b9cf','#f2c66d','#7d9f76','#385f56','#c58064','#b69dc8','#e6aa9b','#7890b7','#c9b79c','#a67850','#f7e9c9','#dfbd78'];
export const colorNames=['Sky','Sunshine','Sage','Forest','Terracotta','Lavender','Rose','Ocean','Sand','Cedar','Cream','Honey'];
export const scenes=[
 {id:'creation',title:'Let there be light',book:'Genesis 1',group:'Old Testament',kind:'creation',story:'God made a good world, filled with light, water, plants, and living creatures. Take a moment to notice the beauty around you.'},
 {id:'garden',title:'A garden of goodness',book:'Genesis 2',group:'Old Testament',kind:'garden',story:'God planted a garden and gave people the work of caring for it. We can care for His creation with grateful hearts.'},
 {id:'ark',title:'A rainbow promise',book:'Genesis 9',group:'Old Testament',kind:'ark',story:'After the flood, God gave a rainbow as a sign of His promise. His faithfulness brings hope.'},
 {id:'sea',title:'A path through the sea',book:'Exodus 14',group:'Old Testament',kind:'sea',story:'God made a way through the sea for His people. They learned to trust Him even when the way ahead seemed impossible.'},
 {id:'david',title:'The faithful shepherd',book:'1 Samuel 17',group:'Old Testament',kind:'david',story:'Before David faced Goliath, he cared for his sheep. Small acts of faithfulness matter to God.'},
 {id:'daniel',title:'Peace in the lions’ den',book:'Daniel 6',group:'Old Testament',kind:'daniel',story:'Daniel kept praying to God. God protected him in the lions’ den. These lions are resting peacefully.'},
 {id:'nativity',title:'Good news in Bethlehem',book:'Luke 2',group:'Life of Jesus',kind:'nativity',story:'Jesus was born in Bethlehem. The good news of His birth brought joy to shepherds and to the world.'},
 {id:'baptism',title:'Beside the Jordan',book:'Matthew 3',group:'Life of Jesus',kind:'baptism',story:'Jesus was baptized in the Jordan River. This scene remembers the river and the dove described in the story.'},
 {id:'storm',title:'Peace, be still',book:'Mark 4:35–41',group:'Life of Jesus',kind:'storm',story:'Jesus calmed the wind and the waves. The disciples discovered His power in the middle of a storm.'},
 {id:'bread',title:'More than enough',book:'John 6:1–14',group:'Life of Jesus',kind:'bread',story:'Jesus fed a great crowd with five loaves and two fish. A small gift in His hands became more than enough.'},
 {id:'church',title:'Together in faith',book:'Acts 2:42–47',group:'Early Church',kind:'church',story:'The early believers learned, prayed, shared meals, and cared for one another. Faith grows in a loving community.'},
 {id:'city',title:'All things made new',book:'Revelation 21–22',group:'Early Church',kind:'city',story:'Revelation describes God’s renewed creation, a river of life, and a tree of life. This symbolic scene celebrates that hope.'}
];
export function illustration(scene,difficulty='easy',fills={},preview=false,numbers=true){
 let body='',labels='',regions=[],id=0;
 const detail=difficulty==='expert'?2:difficulty==='detailed'?1:0;
 function shape(tag,attrs,c,x,y,name){const n=id++;regions.push({id:n,color:c,name:name||'Area '+(n+1)});const fill=preview?palette[c]:(fills[n]||'#fffdf6');body+=`<${tag} ${attrs} data-region="${n}" data-color="${c}" fill="${fill}" stroke="#36483e" stroke-width="${detail?1.5:2.3}" stroke-linejoin="round" role="button" tabindex="0" aria-label="${name||'Area '+(n+1)}, color ${c+1}"/>`;if(x!==undefined)labels+=`<text x="${x}" y="${y}" data-label="${n}" text-anchor="middle" dominant-baseline="middle" font-size="${detail?9:12}" font-family="system-ui" fill="#596459" pointer-events="none" ${preview||fills[n]||!numbers?'display="none"':''}>${c+1}</text>`;}
 const path=(d,c,x,y,n)=>shape('path',`d="${d}"`,c,x,y,n),rect=(x,y,w,h,c,n)=>shape('rect',`x="${x}" y="${y}" width="${w}" height="${h}" rx="3"`,c,x+w/2,y+h/2,n),circle=(x,y,r,c,n)=>shape('circle',`cx="${x}" cy="${y}" r="${r}"`,c,x,y,n),ellipse=(x,y,rx,ry,c,n)=>shape('ellipse',`cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"`,c,x,y,n);
 const line=d=>body+=`<path d="${d}" fill="none" stroke="#36483e" stroke-width="2" stroke-linecap="round" pointer-events="none"/>`;
 const leaf=(x,y,s,c=2)=>path(`M${x} ${y}q${-s} ${-s*1.2} 0 ${-s*2}q${s} ${s*1.2} 0 ${s*2}Z`,c,x,y-s,'Leaf');
 const flower=(x,y,r=9)=>{for(let a=0;a<6;a++){const q=a*Math.PI/3;ellipse(x+Math.cos(q)*r,y+Math.sin(q)*r,6,6,(a%2?6:5),'Flower petal');}circle(x,y,5,1,'Flower center');};
 const cloud=(x,y)=>path(`M${x-36} ${y+12}q-10-25 12-28q12-30 34-8q29-12 35 15q15 20-9 21Z`,10,x,y,'Cloud');
 const tree=(x,y,s=1)=>{path(`M${x-8*s} ${y}l4 ${-92*s}h10l5 ${92*s}Z`,9,x,y-40*s,'Tree trunk');ellipse(x,y-108*s,36*s,47*s,2,'Tree crown');if(detail)for(let i=0;i<(detail===2?15:7);i++)leaf(x+Math.sin(i*2.4)*24*s,y-76*s-(i%4)*16*s,9*s,i%2?3:2);};
 const sheep=(x,y,s=1)=>{ellipse(x,y,25*s,17*s,10,'Sheep fleece');circle(x+26*s,y-4*s,11*s,8,'Sheep face');line(`M${x-14*s} ${y+15*s}v${12*s}M${x+10*s} ${y+16*s}v${11*s}`);circle(x+29*s,y-7*s,1.4*s,3,'Eye');};
 const bird=(x,y)=>path(`M${x} ${y}q-22-35-46-14q22 5 25 23q-17 0-22 13q23 3 44-9q21 12 31-4q-14 2-18-8q20-8 18-21q-17 1-32 20Z`,10,x,y,'Dove');
 const boat=(x,y)=>{path(`M${x-100} ${y}h200q-18 58-66 68h-72q-44-14-62-68Z`,9,x,y+30,'Boat hull');rect(x-5,y-110,10,110,4,'Mast');path(`M${x+8} ${y-104}q60 36 74 89h-74Z`,10,x+37,y-43,'Sail');if(detail)for(let i=0;i<5+detail*3;i++)rect(x-64+i*16,y+32,13,14,i%2?4:9,'Hull plank');};
 const sky=()=>{rect(0,0,600,600,0,'Sky');circle(465,84,38,1,'Sun');cloud(123,81);cloud(323,127);};
 const hills=()=>{path('M0 340Q130 210 290 325Q460 225 600 315V600H0Z',2,110,355,'Distant hillside');path('M0 425Q120 360 250 440Q410 338 600 411V600H0Z',3,450,455,'Near hillside');};
 const river=()=>path('M282 327Q220 382 332 422Q408 470 291 600H460Q526 469 396 403Q309 363 353 327Z',7,385,517,'River');
 const person=(x,y,c=4)=>{path(`M${x-22} ${y+25}q-8 25-15 65h74q-7-40-15-65Z`,c,x,y+59,'Robe');circle(x,y+4,18,8,'Face');path(`M${x-20} ${y+3}q-5-39 20-31q27-6 21 33q-12-16-24-20q-13 2-17 18Z`,9,x,y-16,'Hair');line(`M${x-5} ${y+7}q5 7 10 0`);};
 sky();
 switch(scene.kind){
 case 'creation': hills();river();tree(120,470,1.5);tree(513,483,.8);bird(310,231);sheep(235,507);flower(78,544);flower(506,559);break;
 case 'garden': hills();river();tree(139,464,1.65);tree(492,428,1.15);for(let i=0;i<5;i++)circle(107+(i%3)*25,270+Math.floor(i/3)*38,10,4,'Garden fruit');flower(102,526);flower(515,513);sheep(229,522);break;
 case 'ark': path('M0 385Q170 351 600 380V600H0Z',7,98,481,'Water');for(let i=0;i<5;i++){const r=195-i*17;path(`M${300-r} 306A${r} ${r} 0 0 1 ${300+r} 306H${300+r-15}A${r-15} ${r-15} 0 0 0 ${300-r+15} 306Z`,[4,1,2,0,5][i],300,306-r+8,'Rainbow band');}path('M111 378H489L455 457H151Z',9,300,420,'Ark hull');rect(168,278,264,100,4,'Ark house');path('M146 278L300 212L454 278Z',9,300,255,'Ark roof');for(let i=0;i<4;i++)rect(187+i*60,301,35,42,1,'Ark window');bird(505,220);break;
 case 'sea': path('M0 299Q75 220 169 292Q137 438 103 600H0Z',7,68,437,'Left sea');path('M600 299Q522 220 431 292Q468 438 496 600H600Z',7,533,437,'Right sea');path('M169 292H431L496 600H103Z',8,301,551,'Dry path');person(301,336);person(252,439,5);person(347,439,3);line('M328 358L359 296');break;
 case 'david': hills();tree(490,468,1.4);person(213,385,7);line('M176 474V359Q176 338 193 351');sheep(319,488,1.2);sheep(106,520,1.2);sheep(414,535,1.2);flower(248,552);break;
 case 'daniel': path('M0 210Q80 125 139 208Q288 151 444 209Q536 168 600 218V600H0Z',8,91,302,'Rocky den');path('M133 600V362Q146 182 300 175Q454 182 468 362V600Z',5,300,278,'Den entrance');person(300,361,10);for(const x of [146,449]){ellipse(x,480,62,34,1,'Resting lion');circle(x+31,443,33,9,'Lion mane');circle(x+31,447,22,1,'Lion face');line(`M${x+23} 445h7M${x+34} 445h7M${x+29} 455q4 5 8 0`);}break;
 case 'nativity': hills();path('M111 474V305L300 202L489 305V474Z',9,154,370,'Stable');path('M84 312L300 181L516 312L494 327L300 217L106 327Z',4,300,211,'Stable roof');rect(169,293,262,181,8,'Stable interior');person(212,355,7);person(389,350,3);path('M242 434H359L341 480H260Z',9,300,467,'Manger');ellipse(300,437,46,20,10,'Swaddling cloth');circle(301,432,10,8,'Baby’s face');path('M300 63L308 89L335 89L313 105L321 130L300 114L279 130L287 105L265 89H292Z',1,300,98,'Bethlehem star');sheep(113,536);sheep(487,537);break;
 case 'baptism': hills();path('M0 427Q140 374 299 427Q461 382 600 433V600H0Z',7,300,540,'Jordan River');tree(108,443,1.1);tree(526,472,1.4);bird(306,258);for(let i=0;i<3;i++)ellipse(259+i*42,453,18,9,8,'River stone');break;
 case 'storm': path('M0 343Q76 292 150 343T300 343T450 343T600 343V600H0Z',7,90,415,'Sea of Galilee');boat(301,371);bird(470,207);for(let i=0;i<3;i++)path(`M${61+i*165} 523q40-38 80 0q-40 28-80 0Z`,0,101+i*165,520,'Gentle wave');break;
 case 'bread': hills();path('M109 543L137 380H467L494 543Z',9,300,521,'Basket');path('M163 388Q160 233 301 235Q444 233 441 388H414Q412 263 301 263Q189 263 190 388Z',4,301,250,'Basket handle');for(let i=0;i<5;i++)ellipse(185+i*58,377+(i%2)*19,25,44,i%2?11:1,'Loaf of bread');for(const x of [243,359]){path(`M${x-42} 458q35-40 73 0l23-20v40l-23-20q-38 40-73 0Z`,7,x,458,'Fish');circle(x-18,453,3,3,'Fish eye');}break;
 case 'church': hills();path('M100 526V260L300 167L500 260V526Z',8,133,362,'Meeting home');path('M80 267L300 146L520 267L502 287L300 184L98 287Z',4,300,173,'Roof');rect(257,321,86,205,9,'Open doorway');rect(149,295,62,78,1,'Left window');rect(389,295,62,78,1,'Right window');person(191,436,5);person(399,436,3);path('M256 528H345L328 560H273Z',4,300,542,'Shared bread basket');ellipse(300,527,28,12,1,'Shared bread');break;
 case 'city': hills();path('M0 490Q200 422 600 484V600H0Z',0,75,552,'River of life');for(let i=0;i<5;i++){rect(111+i*77,281-(i%2)*70,69,209+(i%2)*70,11,'City tower');path(`M${111+i*77} ${281-(i%2)*70}l34-40 35 40Z`,1,145+i*77,264-(i%2)*70,'Tower roof');for(let j=0;j<2+detail;j++)rect(135+i*77,303+j*36-(i%2)*70,20,25,5,'City window');}tree(527,480,1.5);break;
 }
 if(detail){
  // Additional independently colorable foliage, water, stones and a botanical border.
  const water=['creation','garden','ark','sea','baptism','storm','city'].includes(scene.kind);
  for(let i=0;i<(detail===2?24:10);i++){const x=36+(i*83)%527,y=556+(i%3)*12; if(water)path(`M${x} ${y}q12-9 24 0q-12 10-24 0Z`,i%2?0:7,x+12,y,'Water ripple');else ellipse(x,y,8+(i%3)*2,5,i%3?8:4,'Ground stone');}
  for(let i=0;i<(detail===2?24:10);i++){const x=21+(i%2)*558,y=170+Math.floor(i/2)*30;leaf(x,y,9,i%3?2:3);}
  for(let i=0;i<(detail===2?7:3);i++)flower(65+i*76,590,5);
  if(detail===2){for(let i=0;i<16;i++)path(`M${42+i*33} 26l9-12 9 12-9 12Z`,i%4,51+i*33,26,'Border jewel');}
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" class="color-art" aria-label="${scene.title} coloring illustration"><rect width="600" height="600" fill="#fffdf6"/>${body}<g class="numbers">${labels}</g></svg>`;
 return {svg,regions};
}
