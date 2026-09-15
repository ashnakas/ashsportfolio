import * as THREE from 'three';

const cobalt=0x1d49ed,ink=0x03050c,white=0xf5f7ff,soft=0xcbd6ff;
const clamp=THREE.MathUtils.clamp;
const ease=(value,start,end)=>THREE.MathUtils.smoothstep(value,start,end);

function labelTexture(lines,{dark=true,small=false}={}){
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
  const ctx=canvas.getContext('2d');ctx.fillStyle=dark?'#03050c':'#f5f7ff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=dark?'#f5f7ff':'#03050c';ctx.font=`${small?'500 84px':'700 236px'} Arial`;ctx.letterSpacing=small?'8px':'-12px';ctx.textBaseline='middle';
  const leading=small?112:218,total=(lines.length-1)*leading;
  lines.forEach((line,index)=>ctx.fillText(line,130,512-total/2+index*leading));
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=16;return texture;
}

function box(parent,w,h,d,x,y,z,material,bevel=.02){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,bevel?2:1,bevel?2:1,bevel?2:1),material);
  mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}

function screen(parent,w,h,x,y,z,lines,options={}){
  const texture=labelTexture(lines,options);
  const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);plane.position.set(x,y,z);parent.add(plane);return plane;
}

function makePhone(materials){
  const group=new THREE.Group();
  box(group,2.45,5.05,.42,0,0,0,materials.chrome);
  box(group,2.18,4.75,.47,0,0,.06,materials.black);
  const glow=new THREE.Mesh(new THREE.CircleGeometry(.62,64),materials.blue);glow.position.set(0,.55,.31);group.add(glow);
  const dot=new THREE.Mesh(new THREE.CircleGeometry(.22,48),materials.white);dot.position.set(0,.55,.33);group.add(dot);
  box(group,1.55,.48,.08,0,-1.45,.32,materials.blue,.04);
  screen(group,1.34,.24,0,-1.45,.37,['TAP'],{dark:true,small:true});
  box(group,.7,.055,.08,0,2.0,.32,materials.white,.02);
  return group;
}

function makeFocusToken(materials){
  const group=new THREE.Group();
  const plate=new THREE.Mesh(new THREE.CapsuleGeometry(.95,2.55,10,32),materials.white);plate.rotation.z=Math.PI/2;group.add(plate);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.72,.08,16,64),materials.blue);ring.position.z=.23;group.add(ring);
  screen(group,1.12,.78,0,.12,.24,['Aa'],{dark:false,small:false});
  const rule=box(group,1.32,.06,.05,0,-.58,.25,materials.ink,.01);
  const knob=new THREE.Mesh(new THREE.CircleGeometry(.13,32),materials.blue);knob.position.set(-.25,-.58,.29);group.add(knob);
  return group;
}

function makeWaveform(materials){
  const group=new THREE.Group();
  const back=new THREE.Mesh(new THREE.CylinderGeometry(1.58,1.58,.24,64),materials.black);back.rotation.x=Math.PI/2;group.add(back);
  const outer=new THREE.Mesh(new THREE.TorusGeometry(1.68,.065,12,96),materials.white);group.add(outer);
  const bars=[];
  for(let i=0;i<31;i++){
    const bar=box(group,.085,.34,.07,-1.22+i*.081,0,.18,materials.blue,.01);bars.push(bar);
  }
  const mic=new THREE.Mesh(new THREE.TorusGeometry(.29,.045,10,48),materials.white);mic.position.set(1.06,0,.23);group.add(mic);
  box(group,.095,.28,.07,1.06,.0,.25,materials.white,.01);box(group,.42,.05,.07,1.06,-.25,.25,materials.white,.01);
  return {group,bars};
}

export function sculptureCamera(camera,p,mobile){
  const travel=ease(p,0,.72),arrival=ease(p,.72,1);
  const position=new THREE.Vector3(0,2.25,22).lerp(new THREE.Vector3(0,5.1,10.2),travel);
  position.lerp(new THREE.Vector3(0,5.3,7.3),arrival);
  if(mobile)position.set(0,2.45,25-travel*10-arrival*2);
  camera.position.copy(position);
  const target=new THREE.Vector3(0,5.25,-3.55);target.y+=arrival*.2;
  camera.fov=(mobile?62:46)-arrival*3;camera.lookAt(target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
}

export function createSculptureWorld(scene,renderer){
  scene.background=new THREE.Color(ink);scene.fog=new THREE.FogExp2(0x03050c,.035);
  const world=new THREE.Group();scene.add(world);
  const chrome=new THREE.MeshStandardMaterial({color:0xeaf0ff,metalness:.9,roughness:.16});
  const black=new THREE.MeshPhysicalMaterial({color:0x02030a,metalness:.8,roughness:.12,clearcoat:1,clearcoatRoughness:.04});
  const porcelain=new THREE.MeshPhysicalMaterial({color:white,metalness:.08,roughness:.25,clearcoat:.5,clearcoatRoughness:.13});
  const blue=new THREE.MeshStandardMaterial({color:cobalt,metalness:.35,roughness:.16,emissive:0x102eb8,emissiveIntensity:.68});
  const blueLight=new THREE.MeshBasicMaterial({color:0x4770ff,toneMapped:false});
  const whiteMat=new THREE.MeshBasicMaterial({color:white,toneMapped:false});
  const materials={chrome,black,porcelain,blue,white:whiteMat,ink:new THREE.MeshBasicMaterial({color:ink}),blue:blueLight};

  scene.add(new THREE.HemisphereLight(0x5375ff,0x010109,.78));
  const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(-7,14,10);scene.add(key);
  const edge=new THREE.DirectionalLight(0x4468ff,4);edge.position.set(9,7,1);scene.add(edge);
  const point=new THREE.PointLight(0x2449f2,24,22,2);point.position.set(0,6,1);scene.add(point);

  const sky=new THREE.Mesh(new THREE.SphereGeometry(120,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;void main(){float h=normalize(p).y;vec3 a=vec3(.005,.008,.025);vec3 b=vec3(.03,.09,.48);gl_FragColor=vec4(mix(a,b,smoothstep(.05,1.,h)),1.);}'}));scene.add(sky);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshPhysicalMaterial({color:0x02030a,metalness:.95,roughness:.13,clearcoat:1,clearcoatRoughness:.05}));floor.rotation.x=-Math.PI/2;floor.position.y=-.06;scene.add(floor);

  const stage=new THREE.Group();stage.position.set(0,0,-3.8);world.add(stage);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(6.9,7.45,.32,96),black);base.position.y=.12;stage.add(base);
  for(const [radius,thickness,material] of [[6.25,.025,whiteMat],[5.72,.042,blueLight],[4.45,.018,whiteMat]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,thickness,8,128),material);ring.rotation.x=Math.PI/2;ring.position.y=.31;stage.add(ring);}
  for(let i=0;i<20;i++){const tick=new THREE.Mesh(new THREE.BoxGeometry(.025,.025,.42),i%5===0?whiteMat:blueLight);const a=i/20*Math.PI*2;tick.position.set(Math.cos(a)*5.1,.32,Math.sin(a)*5.1);tick.rotation.y=-a;stage.add(tick);}

  const tower=new THREE.Group();tower.position.set(0,.32,0);stage.add(tower);
  box(tower,5.35,9.7,1.34,0,5.05,0,black);
  box(tower,5.64,.18,1.55,0,.38,0,chrome);box(tower,5.62,.18,1.55,0,9.72,0,chrome);
  for(const side of [-1,1]){box(tower,.17,9.5,1.55,side*2.72,5.02,0,porcelain);box(tower,.055,9.25,1.59,side*2.86,5.05,0,blueLight);}
  box(tower,.16,8.65,.08,0,5.2,.74,blueLight);
  const namePlate=screen(tower,3.1,2.2,0,6.15,.72,['ASHNA','KASIREDDY'],{dark:true});
  const quietRule=box(tower,2.9,.035,.05,0,4.75,.77,porcelain,.01);

  const core=new THREE.Group();core.position.set(0,8.3,.05);tower.add(core);
  const globe=new THREE.Mesh(new THREE.SphereGeometry(1.04,64,40),new THREE.MeshPhysicalMaterial({color:0xdde5ff,metalness:.72,roughness:.12,clearcoat:1}));core.add(globe);
  for(const turn of [0,Math.PI/3,Math.PI*2/3]){const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.15,.024,8,96),blueLight);orbit.rotation.y=turn;core.add(orbit);}
  const halo=new THREE.Mesh(new THREE.TorusGeometry(1.48,.055,12,96),whiteMat);halo.rotation.x=1.07;core.add(halo);

  const phone=makePhone(materials);phone.position.set(-6.2,-2.5,.76);phone.rotation.y=.13;stage.add(phone);
  const focus=makeFocusToken(materials);focus.position.set(5.9,-1.5,.72);focus.rotation.y=-.14;stage.add(focus);
  const wave=makeWaveform(materials);wave.group.position.set(0,1.8,.79);stage.add(wave.group);

  const portal=new THREE.Group();portal.position.set(0,5.15,.78);tower.add(portal);
  const portalFace=screen(portal,4.6,5.4,0,0,.04,['SELECTED','WORK'],{dark:true});portalFace.visible=false;
  const leftDoor=box(portal,2.26,5.42,.16,-1.16,0,.11,porcelain);const rightDoor=box(portal,2.26,5.42,.16,1.16,0,.11,porcelain);
  for(const door of [leftDoor,rightDoor]){door.visible=false;}
  const projectLine=screen(portal,3.75,.36,0,-2.08,.08,['RE-CART  /  PINWHEELS  /  SHOWABILITY'],{dark:true,small:true});projectLine.visible=false;

  const thinLeft=new THREE.Group();thinLeft.position.set(-4.25,5.35,-.24);stage.add(thinLeft);box(thinLeft,.11,6.8,.12,0,0,0,chrome);box(thinLeft,.55,.08,.14,0,2.7,0,blueLight);
  const thinRight=new THREE.Group();thinRight.position.set(4.25,5.35,-.24);stage.add(thinRight);box(thinRight,.11,6.8,.12,0,0,0,chrome);box(thinRight,.55,.08,.14,0,-2.7,0,whiteMat);

  const assetsReady=Promise.resolve();
  return {assetsReady,update(p,time,mobile){
    const rise=ease(p,0,.18);tower.position.y=-(1-rise)*8.2;tower.scale.setScalar(.82+.18*rise);
    const phoneIn=ease(p,.16,.38);phone.position.set(-6.3+3.2*phoneIn,-2.7+6.55*phoneIn,.76);phone.rotation.z=-.12*(1-phoneIn);phone.visible=phoneIn>.002;
    const focusIn=ease(p,.38,.58);focus.position.set(5.9-2.75*focusIn,-1.6+6.25*focusIn,.72);focus.rotation.z=.12*(1-focusIn);focus.visible=focusIn>.002;
    const waveIn=ease(p,.35,.57);wave.group.position.y=1.5+3.2*waveIn;wave.group.scale.setScalar(.35+.65*waveIn);wave.group.visible=waveIn>.002;
    const final=ease(p,.72,.94);portalFace.visible=final>.002;projectLine.visible=final>.45;leftDoor.visible=final>.002;rightDoor.visible=final>.002;
    leftDoor.position.x=-1.16-final*1.45;rightDoor.position.x=1.16+final*1.45;leftDoor.rotation.y=-final*.18;rightDoor.rotation.y=final*.18;
    core.rotation.y=time?time*.00019:0;core.rotation.z=.08*Math.sin(time*.00031);
    wave.bars.forEach((bar,index)=>{bar.scale.y=.3+Math.abs(Math.sin(time*.0034+index*.57))*1.85;});
    focus.rotation.y=-.14+Math.sin(time*.0005)*.05;phone.position.y+=Math.sin(time*.0007)*.035;
    thinLeft.position.y=5.35+Math.sin(time*.0004)*.05;thinRight.position.y=5.35+Math.sin(time*.0004+1)*.05;
    stage.scale.x=mobile?.74:1;
  }};
}
