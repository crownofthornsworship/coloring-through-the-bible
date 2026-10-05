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
im=cv2.imread(a.source); gray=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
# Normalize all illustrations to the same stable coordinate system.
gray=cv2.resize(gray,(1200,1200),interpolation=cv2.INTER_AREA)
ink=(gray<170).astype('uint8')
ink=cv2.morphologyEx(ink,cv2.MORPH_CLOSE,np.ones((2,2),np.uint8))
white=1-ink;n,labels,stats,centers=cv2.connectedComponentsWithStats(white,4)
regions=[];minimum={'beginner':850,'easy':400,'medium':100,'hard':55,'expert':35}[a.level]
for j in range(1,n):
 x,y,w,h,area=stats[j]
 if area<minimum or w<4 or h<4:continue
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
 regions.append({'id':len(regions),'d':''.join(paths),'x':x+point[0],'y':y+point[1],'radius':round(radius,1),'box':[int(x),int(y),int(w),int(h)],'area':int(area),'color':int((centers[j][0]//180+centers[j][1]//210)%12),'name':f'Illustration area {len(regions)+1}'})
# Group tiny neighboring details with a larger nearby area instead of demanding
# hundreds of inaccessible taps on garment seams, eyes and foliage fragments.
# The underlying five drawings remain different; no geometry is subdivided.
target={'beginner':30,'easy':65,'medium':140,'hard':280,'expert':500}[a.level]
if len(regions)>target:
 retained=sorted(regions,key=lambda r:r['area'],reverse=True)[:target]
 seed=np.ones((1200,1200),np.uint8)
 for r in retained:seed[labels==int(labels[r['y'],r['x']])]=0
 _,near=cv2.distanceTransformWithLabels(seed,cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_CCOMP)
 lookup={int(near[r['y'],r['x']]):r for r in retained}
 retained_ids={r['id'] for r in retained}
 for r in regions:
  if r['id'] not in retained_ids:
   owner=lookup.get(int(near[r['y'],r['x']]))
   if owner:owner['d']+=r['d'];owner['area']+=r['area']
 regions=sorted(retained,key=lambda r:(r['y'],r['x']))
for j,r in enumerate(regions):r['id']=j;r['name']=f'Coloring area {j+1}'
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
