"""Convert the supplied OBJ to a material-grouped, indexed GLB (no source textures supplied)."""
import json,struct,sys
from pathlib import Path
import numpy as np
source=Path(sys.argv[1]);destination=Path(sys.argv[2])
vertices=[];normals=[];groups={};material='_auto_1'
for line in source.open(errors='replace'):
 p=line.split()
 if not p:continue
 if p[0]=='v':vertices.append([float(x) for x in p[1:4]])
 elif p[0]=='vn':normals.append([float(x) for x in p[1:4]])
 elif p[0]=='usemtl':material=p[1]
 elif p[0]=='f':
  points=[]
  for part in p[1:]:
   fields=part.split('/');points.append((int(fields[0])-1,int(fields[2])-1 if len(fields)>2 and fields[2] else -1))
  for i in range(1,len(points)-1):groups.setdefault(material,[]).extend([points[0],points[i],points[i+1]])
v=np.array(vertices,dtype=np.float32);n=np.array(normals,dtype=np.float32)
# The model is Y-up. Keep the original house proportions, centered on the lot.
center=(v.min(axis=0)+v.max(axis=0))/2;center[1]=0
v=(v-center)/3
colors={'_auto_1':'f1eee6','_auto_2':'beb8a5','_auto_3':'748381','_auto_4':'887c62','_auto_5':'363a3d','_auto_6':'c6c3b8','_auto_7':'aa9471','_auto_9':'6f5538','_auto_10':'b39669','_auto_13':'536748','_auto_16':'726652','_auto_18':'665844','_auto_19':'d9d3c2','_auto_20':'e7e0d2','_auto_22':'b6b5a3','_auto_23':'63714a','_auto_24':'536345','_auto_25':'3f5935','_auto_26':'495a35','_auto_27':'587047','_auto_28':'4a653e','_auto_29':'6a7a4c','_auto_30':'3c583b','_auto_33':'694c34','_auto_34':'b2afa3','_auto_35':'d5d0b8','_auto_37':'484746','_auto_39':'4a4f40','_auto_8':'545457'}
plant=['_auto_13','_auto_24','_auto_25','_auto_26','_auto_27','_auto_28','_auto_29','_auto_30','_auto_39']
blob=bytearray();views=[];accessors=[];meshes=[];materials=[];nodes=[]
def add(array,ctype,kind,target=None,bounds=False):
 while len(blob)%4:blob.append(0)
 start=len(blob);data=array.tobytes();blob.extend(data)
 view={'buffer':0,'byteOffset':start,'byteLength':len(data)}
 if target:view['target']=target
 views.append(view);accessor={'bufferView':len(views)-1,'componentType':ctype,'count':len(array),'type':kind}
 if bounds:accessor.update({'min':array.min(axis=0).tolist(),'max':array.max(axis=0).tolist()})
 accessors.append(accessor);return len(accessors)-1
for idx,(name,values) in enumerate(groups.items()):
 pairs=np.array(values,dtype=np.int32);unique,inverse=np.unique(pairs,axis=0,return_inverse=True)
 pos=v[unique[:,0]].astype('<f4');norm=n[np.maximum(0,unique[:,1])].astype('<f4');norm/=np.maximum(np.linalg.norm(norm,axis=1)[:,None],1e-8)
 indices=inverse.astype(np.int32)
 if name in plant:
  _,cluster=np.unique(np.round(pos/.008).astype(np.int32),axis=0,return_inverse=True)
  count=np.bincount(cluster);size=len(count)
  pos=np.stack([np.bincount(cluster,weights=pos[:,axis],minlength=size)/count for axis in range(3)],axis=1).astype('<f4')
  norm=np.stack([np.bincount(cluster,weights=norm[:,axis],minlength=size)/count for axis in range(3)],axis=1).astype('<f4')
  norm/=np.maximum(np.linalg.norm(norm,axis=1)[:,None],1e-8)
  triangles=cluster[indices].reshape(-1,3)
  triangles=triangles[(triangles[:,0]!=triangles[:,1])&(triangles[:,1]!=triangles[:,2])&(triangles[:,0]!=triangles[:,2])]
  indices=triangles.reshape(-1)
 indices=indices.astype('<u2' if len(pos)<65536 else '<u4')
 pa=add(pos,5126,'VEC3',34962,True)
 quantized=np.zeros((len(norm),4),dtype=np.int8);quantized[:,:3]=np.clip(np.round(norm*127),-127,127).astype(np.int8)
 na=add(quantized,5120,'VEC3',34962);views[-1]['byteStride']=4;accessors[-1]['normalized']=True
 ia=add(indices,5123 if len(pos)<65536 else 5125,'SCALAR',34963)
 color=colors.get(name,'a8a394');rgb=[int(color[i:i+2],16)/255 for i in (0,2,4)]
 materials.append({'name':name,'pbrMetallicRoughness':{'baseColorFactor':[*rgb,1],'roughnessFactor':.83 if name in plant else .64,'metallicFactor':.3 if name in ['_auto_9','_auto_10'] else 0},'doubleSided':name in plant,'extras':{'sourceMaterial':name,'foliage':name in plant}})
 meshes.append({'name':name,'primitives':[{'attributes':{'POSITION':pa,'NORMAL':na},'indices':ia,'material':idx}]})
 nodes.append({'name':name,'mesh':idx})
while len(blob)%4:blob.append(0)
model={'asset':{'version':'2.0','generator':'Sunter villa preparation'},'extensionsUsed':['KHR_mesh_quantization'],'extensionsRequired':['KHR_mesh_quantization'],'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'materials':materials,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accessors}
j=json.dumps(model,separators=(',',':')).encode();j+=b' '*((-len(j))%4)
out=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob
destination.parent.mkdir(parents=True,exist_ok=True);destination.write_bytes(out)
print(json.dumps({'source_bytes':source.stat().st_size,'glb_bytes':len(out),'draw_groups':len(meshes),'source_triangles':sum(len(x)//3 for x in groups.values()),'web_triangles':sum(accessors[x['primitives'][0]['indices']]['count']//3 for x in meshes),'bounds':[[float(x) for x in v.min(axis=0)],[float(x) for x in v.max(axis=0)]]}))
