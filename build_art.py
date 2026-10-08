"""Convert approved original closed-line illustrations to deterministic SVG fill paths.
No synthetic subdivisions. Reject tiny islands; put labels at maximum interior clearance.
Trace one compound vector ink path for crisp deep zoom.
"""
import cv2,json,numpy as np,base64,gzip
from pathlib import Path
from PIL import Image
import argparse
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('scene');p.add_argument('level');p.add_argument('--guide',help='Approved flat-color version of this exact line plate');a=p.parse_args()
out=Path(__file__).parent/'art';out.mkdir(exist_ok=True)
BEGINNER_COLOR_MAPS={
 'david':[0,10,4,8,9,11,4,5,2,6,11,7,10,4,9,5,3,2,11,4,8,2,9,3,10,8,8,8],
 'ark':[0,1,6,11,2,7,4,10,5,3,10,9,11,3,10,2,9,4,5,9,6,7,11,8,9,7,7,7],
 'storm':[0,10,10,10,0,10,8,4,10,9,6,2,6,7,5,3,10,4,11,9,4,10,7,7,7,0,7,7],
}
im=cv2.imread(a.source); gray=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
# Normalize all illustrations to the same stable coordinate system.
gray=cv2.resize(gray,(1200,1200),interpolation=cv2.INTER_AREA)
ink=(gray<170).astype('uint8')
ink=cv2.morphologyEx(ink,cv2.MORPH_CLOSE,np.ones((2,2),np.uint8))
# Seal tiny antialiasing gaps in otherwise closed coloring-book outlines.
# This prevents enclosed objects (clouds, clothing panels, shield details, etc.)
# from leaking into a large background region during flood-fill extraction.
ink=cv2.dilate(ink,np.ones((3,3),np.uint8),iterations=1)
white=1-ink;n,labels,stats,centers=cv2.connectedComponentsWithStats(white,4)
regions=[];minimum={'beginner':1100,'easy':650,'medium':260,'hard':150,'expert':90}[a.level]
for j in range(1,n):
 x,y,w,h,area=stats[j]
 if area<minimum or w<6 or h<6:continue
 # Border-touching white is the unbounded page/background and is not a safe
 # paint bucket. Every playable region must be enclosed by ink.
 if x==0 or y==0 or x+w==1200 or y+h==1200:continue
 mask=(labels[y:y+h,x:x+w]==j).astype('uint8')
 contours,hier=cv2.findContours(mask,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
 paths=[]
 for cnt in contours:
  cnt=cv2.approxPolyDP(cnt,.48,True).reshape(-1,2)
  if len(cnt)<3:continue
  pts=[[int(q[0]+x),int(q[1]+y)] for q in cnt]
  paths.append('M'+'L'.join(f'{q[0]},{q[1]}' for q in pts)+'Z')
 if not paths:continue
 dist=cv2.distanceTransform(mask,cv2.DIST_L2,5);_,radius,_,point=cv2.minMaxLoc(dist)
 label_x=max(24,min(1176,x+point[0]));label_y=max(24,min(1176,y+point[1]))
 regions.append({'id':len(regions),'sourceComponent':int(j),'d':''.join(paths),'x':label_x,'y':label_y,'radius':round(radius,1),'box':[int(x),int(y),int(w),int(h)],'area':int(area),'color':0,'name':f'Illustration area {len(regions)+1}'})
# Assign a restrained, adult-coloring-book palette when no approved color guide exists.
# This is geometry-aware rather than the old arbitrary x/y modulo coloring.
# Large upper regions read as sky; enclosed upper-middle soft regions become cream/clouds;
# ground/rock/architecture/foliage receive coordinated natural tones.
if not a.guide:
 for r in regions:
  x,y,w,h=r['box']; cx=x+w/2; cy=y+h/2; area=r['area']
  if cy < 430 and area > 18000: color=0          # open sky
  elif cy < 560 and area < 18000: color=10       # clouds / light details
  elif cy > 880 and area > 6500: color=8         # stone / foreground earth
  elif cy > 690 and area > 3500: color=2         # grasses / hills
  elif cx < 330 and cy < 760: color=3             # tree / foliage zone
  elif cx > 700 and 430 < cy < 980: color=4       # warm figure / armor accents
  else:
   # Stable natural variation for garments, architecture and small details.
   natural=[10,8,2,9,11,4,3]
   color=natural[(int(cx//95)+int(cy//110)+int(area//1800))%len(natural)]
  r['color']=color
 # A purpose-drawn Beginner plate can enclose the entire backdrop inside its
 # page frame. Classify that large top-touching interior as sky even when its
 # centroid falls below the horizon.
 if a.level=='beginner':
  for r in regions:
   x,y,w,h=r['box']
   if y<30 and r['area']>120000:r['color']=0

# Keep only the largest label-friendly components. Small facial details and
# decorative gaps remain white line art instead of being bundled into an
# unrelated playable region. One tap must always control one contiguous area.
target={'beginner':28,'easy':60,'medium':120,'hard':220,'expert':360}[a.level]
if len(regions)>target:
 regions=sorted(sorted(regions,key=lambda r:r['area'],reverse=True)[:target],key=lambda r:(r['y'],r['x']))
for j,r in enumerate(regions):r['id']=j;r['name']=f'Coloring area {j+1}'
if a.level=='beginner' and a.scene in BEGINNER_COLOR_MAPS:
 authored=BEGINNER_COLOR_MAPS[a.scene]
 if len(authored)!=len(regions):raise SystemExit(f'Beginner color map mismatch for {a.scene}: {len(authored)} colors for {len(regions)} regions')
 for r,color in zip(regions,authored):r['colorOverride']=color
# Structural QA: no playable region may touch the page edge. Extremely large
# regions are flagged because they usually indicate an open outline/leak.
bad=[r for r in regions if r['box'][0]<=0 or r['box'][1]<=0 or r['box'][0]+r['box'][2]>=1200 or r['box'][1]+r['box'][3]>=1200]
if bad:raise SystemExit(f'Unsafe open coloring regions: {len(bad)}')
huge=[r for r in regions if r['area']>1200*1200*.28]
if huge:raise SystemExit(f'Likely segmentation leak: {len(huge)} region(s) exceed 28% of page')
# Production rule: if a region cannot ever carry a legible zoomed label, it is
# decorative ink, not a playable mystery tap. This prevents facial features and
# distant soldiers from degenerating into unnumbered micro-regions.
too_tiny=[r for r in regions if r['radius']<2.2 or min(r['box'][2],r['box'][3])<6]
if too_tiny: raise SystemExit(f'Unplayable micro-regions survived cleanup: {len(too_tiny)}')
# Transparent black ink plate, no white pixels to obscure fills.
alpha=np.clip((255-gray)*1.5,0,255).astype('uint8');alpha[gray>235]=0
rgba=np.zeros((1200,1200,4),np.uint8);rgba[:,:,3]=alpha
Image.fromarray(rgba).save(out/f'{a.scene}-{a.level}-ink.png',optimize=True)
# A single compound SVG ink path preserves deep-zoom line quality without
# adding thousands of line nodes or relying on a raster overlay.
ink_contours,_=cv2.findContours(ink,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
ink_paths=[]
for cnt in ink_contours:
 pts=cv2.approxPolyDP(cnt,.4,True).reshape(-1,2)
 if len(pts)>2:ink_paths.append('M'+'L'.join(f'{int(x)},{int(y)}' for x,y in pts)+'Z')
if a.guide:
 guide=cv2.resize(cv2.imread(a.guide),(1200,1200),interpolation=cv2.INTER_AREA)
 palette=['#87b9cf','#f2c66d','#7d9f76','#385f56','#c58064','#b69dc8','#e6aa9b','#7890b7','#c9b79c','#a67850','#f7e9c9','#dfbd78']
 swatches=np.array([[[int(c[i:i+2],16) for i in (5,3,1)] for c in palette]],dtype=np.uint8)
 lab=cv2.cvtColor(swatches,cv2.COLOR_BGR2LAB).astype(float)[0]
 for r in regions:
  x,y=r['x'],r['y'];pixel=np.median(guide[max(0,y-1):y+2,max(0,x-1):x+2].reshape(-1,3),axis=0).astype(np.uint8)
  color=cv2.cvtColor(pixel.reshape(1,1,3),cv2.COLOR_BGR2LAB).astype(float)[0,0]
  r['color']=int(np.argmin(((lab-color)**2).sum(axis=1)))
raw={'inkPath':''.join(ink_paths),'version':2,'scene':a.scene,'level':a.level,'size':1200,'regions':regions}
encoded=json.dumps(raw,separators=(',',':'),default=int).encode()
(out/f'{a.scene}-{a.level}.json').write_bytes(encoded)
(out/f'{a.scene}-{a.level}.json.gz').write_bytes(gzip.compress(encoded,compresslevel=9,mtime=0))
print(a.scene,a.level,len(regions))
