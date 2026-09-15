import * as THREE from 'three';

export const billboardCopy=[
  {name:'Ashna Kasireddy',lines:['ASHNA','KASIREDDY'],sub:['PRODUCT DESIGNER'],fg:'#ffffff',width:5.0,height:3.4,pos:[0,10.8,-8.98],turn:0},
  {name:'One clear action',lines:[],sub:[],fg:'#ffffff',width:5.8,height:6.8,pos:[-6,6.4,-2.77],turn:0},
  {name:'Accessible by design',lines:[],sub:[],fg:'#ffffff',width:6.4,height:6.8,pos:[6.5,7,-4.77],turn:0},
  {name:'Systems that respond',lines:[],sub:[],fg:'#ffffff',width:8.8,height:3.2,pos:[0,3,-6.97],turn:0}
];

export function cityCamera(camera,p,mobile){
  const travel=THREE.MathUtils.smoothstep(p,0,.88);
  camera.position.set(.22*Math.sin(travel*Math.PI),1.72,25-travel*18);
  // Eye height remains on the pavement. Only the gaze lifts toward the signs.
  camera.lookAt(0,5.8+travel*3.6,-10);
  camera.fov=mobile?76:66;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
}

export function createScrollCity(scene,renderer){
  const world=new THREE.Group();scene.add(world);scene.background=new THREE.Color('#102fbe');scene.fog=new THREE.FogExp2('#183aa9',.008);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(140,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:'varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vPosition; void main(){float h=normalize(vPosition).y;gl_FragColor=vec4(mix(vec3(.02,.06,.28),vec3(.12,.27,.92),smoothstep(-.25,1.0,h)),1.0);}'}));scene.add(sky);
  const chrome=new THREE.MeshStandardMaterial({color:0xe8efff,metalness:.9,roughness:.17});
  const building=new THREE.MeshStandardMaterial({color:0xf7f9ff,metalness:.08,roughness:.42});
  const secondary=new THREE.MeshStandardMaterial({color:0xcdd9ff,metalness:.18,roughness:.32});
  const dark=new THREE.MeshStandardMaterial({color:0x080d18,metalness:.35,roughness:.28});
  const blue=new THREE.MeshBasicMaterial({color:0x3158ff,toneMapped:false});
  const white=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const glass=new THREE.MeshPhysicalMaterial({color:0xe9f0ff,metalness:.08,roughness:.035,transmission:.88,thickness:.25,ior:1.42,clearcoat:1,clearcoatRoughness:.02,attenuationColor:0x3d62ff,attenuationDistance:5});
  // Very shallow flowing normals bend reflections without distorting the typography.
  const normals=new Uint8Array(96*96*4);
  for(let y=0;y<96;y++)for(let x=0;x<96;x++){
    const u=x/96*Math.PI*2,v=y/96*Math.PI*2,n=(y*96+x)*4;
    normals[n]=128+Math.round(44*Math.cos(u+v)+20*Math.sin(u*2-v));
    normals[n+1]=128+Math.round(40*Math.sin(v)+18*Math.cos(u-v*2));normals[n+2]=245;normals[n+3]=255;
  }
  const liquidNormal=new THREE.DataTexture(normals,96,96,THREE.RGBAFormat);liquidNormal.wrapS=liquidNormal.wrapT=THREE.RepeatWrapping;liquidNormal.magFilter=liquidNormal.minFilter=THREE.LinearFilter;liquidNormal.needsUpdate=true;
  glass.normalMap=liquidNormal;glass.normalScale.set(.07,.07);
  const asphalt=new THREE.MeshPhysicalMaterial({color:0x080f28,metalness:.72,roughness:.17,clearcoat:1,clearcoatRoughness:.08});
  scene.add(new THREE.HemisphereLight(0xb9ccff,0x02030a,1.9));
  const sun=new THREE.DirectionalLight(0xffffff,2.8);sun.position.set(-8,22,15);scene.add(sun);
  const rim=new THREE.DirectionalLight(0x6b8cff,3.2);rim.position.set(15,7,-10);scene.add(rim);
  for(const [x,z,color] of [[-4,12,0xffffff],[5,4,0x3158ff],[-3,-3,0xdde6ff]]){const glow=new THREE.PointLight(color,30,22,2);glow.position.set(x,2,z);scene.add(glow);}
  const env=new THREE.Scene();env.background=new THREE.Color('#1235b8');
  for(const [x,y,z,color] of [[0,12,5,0xffffff],[-10,3,0,0x3158ff],[10,5,-6,0xffffff]]){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(15,20),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);env.add(m);
  }
  const pmrem=new THREE.PMREMGenerator(renderer),reflection=pmrem.fromScene(env,.04);scene.environment=reflection.texture;pmrem.dispose();env.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  function box(parent,w,h,d,x,y,z,material=building){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m;}
  function line(parent,a,b,r=.018,material=white){const delta=new THREE.Vector3().subVectors(b,a),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),6),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());parent.add(m);return m;}
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);

  // The whole set is one intersection. Four façades frame the signs.
  const blocks=[[-6.0,4.7,-4.8,6.0,9.4,4.0],[6.5,5.2,-7.0,6.8,10.4,4.4],[0,6.4,-11.2,5.2,12.8,4.4],[-10,7.8,-12,3.8,15.6,5],[9.5,8.6,-15,3.4,17.2,5],[-5,9.7,-19,3.6,19.4,4],[3,10.2,-22,4,20.4,4],[-10,8,19,5,16,7],[12,9,19,5,18,7],[-10,6,7,5,12,6],[12,7.5,7,5,15,6]];
  const windows=[],buildings=[];
  blocks.forEach(([x,y,z,w,h,d],i)=>{
    const firstChild=world.children.length,firstWindow=windows.length;
    box(world,w,h,d,x,y,z,i%3===0?secondary:building);
    box(world,w+.25,.16,d+.25,x,h,z,chrome);
    box(world,w+.4,.22,d+.4,x,.35,z,chrome);
    for(let column=0;column<Math.floor(w/.52);column++)for(let row=0;row<Math.floor(h/.64);row++){
      if(column%2!==0||row%2!==0)continue;
      windows.push([x-w/2+.32+column*.52,.9+row*.64,z+d/2+.012,.20,.34]);
    }
    for(const side of [-1,1])box(world,.035,h,.04,x+side*(w/2-.10),y,z+d/2+.025,chrome);
    if(i<3){box(world,w-.5,1.45,.10,x,1.15,z+d/2+.02,dark);for(let j=0;j<4;j++)box(world,.035,1.45,.12,x-w/2+.6+j*(w-1.2)/3,1.15,z+d/2+.08,chrome);}
    if(i>=7){
      const side=x<0?1:-1,inner=x+side*w/2;
      for(let row=0;row<Math.floor(h/.7);row++)for(let col=0;col<Math.floor(d/.6);col++)if((row+col)%4!==0)windows.push([inner+side*.02,.8+row*.7,z-d/2+.35+col*.6,.25,.35,side*Math.PI/2]);
      for(const edgeZ of [z-d/2+.1,z+d/2-.1])box(world,.045,h,.045,inner+side*.04,y,edgeZ,side>0?blue:white);
      for(const floorY of [2.5])box(world,.12,.035,d,inner+side*.08,floorY,z,side>0?blue:white);
      box(world,.06,1.8,d-.6,inner+side*.06,1.2,z,asphalt);
      // Street-facing shop windows, a projecting canopy and a recessed doorway.
      for(let bay=0;bay<3;bay++){
        const bz=z-d/2+.65+bay*(d-1.3)/3;
        box(world,.10,2.1,1.45,inner+side*.1,1.45,bz,dark);
        box(world,.12,.035,1.45,inner+side*.17,2.32,bz,white);
        box(world,.13,2.1,.035,inner+side*.18,1.45,bz,chrome);
      }
      box(world,1.15,.14,d+.15,inner+side*.5,2.9,z,dark);
      box(world,.035,.10,d+.15,inner+side*1.08,2.87,z,white);
    }
    box(world,.10,1.2,.10,x+.6,h+.6,z,chrome);box(world,1.3,.035,.04,x+.6,h+1,z,white);
    const group=new THREE.Group();group.name='rising-building-'+i;
    for(const child of world.children.slice(firstChild))group.add(child);
    const panes=windows.slice(firstWindow),wm=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0x2347e5,transparent:true,opacity:.32}),panes.length),matrix=new THREE.Matrix4();
    panes.forEach(([px,py,pz,pw,ph,turn=0],j)=>{matrix.compose(V(px,py,pz),new THREE.Quaternion().setFromAxisAngle(V(0,1,0),turn),V(pw,ph,1));wm.setMatrixAt(j,matrix);});group.add(wm);world.add(group);buildings.push(group);

  });
  // A shallow reflective street, curb edges and crossing anchor the low camera.
  box(world,50,.15,85,0,-.15,3,asphalt);
  box(world,7,.13,60,-6.5,.04,7,secondary);box(world,7,.13,60,6.5,.04,7,secondary);
  for(let i=0;i<9;i++)box(world,.46,.012,3.0,-3.0+i*.75,.008,5.5,i%2?chrome:white);
  for(let i=0;i<9;i++)box(world,.46,.012,2.4,-3.0+i*.75,.008,21,i%2?chrome:white);
  for(let i=0;i<0;i++)box(world,.04,.012,1.4,0,.009,27-i*2.5,white);
  for(const side of [-1,1]){
    box(world,.045,.02,48,side*3,.12,7,side<0?blue:white);
    for(const z of [24,19,2,-5]){line(world,V(side*4.5,.1,z),V(side*4.5,3.4,z),.035,chrome);line(world,V(side*4.5,3.4,z),V(side*3.9,3.4,z),.03,chrome);box(world,.65,.055,.16,side*4.15,3.36,z,white);}
  }
  for(const z of []){line(world,V(-7.5,13,z),V(9.5,13,z),.028,chrome);line(world,V(-7.5,12.85,z),V(9.5,12.85,z),.012,blue);}
  // Repeated pavement details establish human scale as the camera passes them.
  const treeMaterial=new THREE.MeshStandardMaterial({color:0x1d3b91,roughness:.9});
  for(const side of [-1,1])for(const z of [17,9,0]){
    const x=side*5.15;
    box(world,1.45,.42,1.45,x,.28,z,dark);
    line(world,V(x,.45,z),V(x,3.4,z),.09,chrome);
    for(const [dx,dy,dz,s] of [[0,3.5,0,.85],[-.55,3.0,.12,.67],[.5,3.15,-.12,.72],[0,4.1,0,.57]]){
      const canopy=new THREE.Mesh(new THREE.IcosahedronGeometry(s,2),treeMaterial);canopy.position.set(x+dx,dy,z+dz);world.add(canopy);
    }
    const bx=side*6.5;
    box(world,.7,.12,2.0,bx,.66,z+2,chrome);
    box(world,.12,.65,2.0,bx+side*.3,.98,z+2,dark);
    for(const offset of [-.65,.65])box(world,.55,.55,.08,bx,.34,z+2+offset,dark);
  }
  for(let z=-8;z<28;z+=2){
    box(world,.045,.02,1.05,0,.012,z,white);
    for(const side of [-1,1])box(world,6,.012,.018,side*6,.12,z,chrome);
  }
  // One restrained ticker gives the architecture a Times Square silhouette.
  const tickerCanvas=document.createElement('canvas');tickerCanvas.width=2048;tickerCanvas.height=128;
  const tc=tickerCanvas.getContext('2d');tc.fillStyle='#030712';tc.fillRect(0,0,2048,128);tc.fillStyle='#ffffff';tc.font='500 55px monospace';tc.fillText('SELECTED WORK                         ASHNA KASIREDDY',32,83);
  const tickerTexture=new THREE.CanvasTexture(tickerCanvas);tickerTexture.colorSpace=THREE.SRGBColorSpace;
  const ticker=new THREE.Mesh(new THREE.PlaneGeometry(11.8,.62),new THREE.MeshBasicMaterial({map:tickerTexture,toneMapped:false}));ticker.position.set(.2,2.0,-2.5);ticker.rotation.y=.20;ticker.geometry.dispose();ticker.material.dispose();tickerTexture.dispose();

  const podium=new THREE.Group();podium.name='waveform-podium';world.add(podium);buildings.splice(7,0,podium);
  box(podium,6.4,4.8,2,0,2.4,-8,building);
  box(podium,6.6,.15,2.2,0,4.8,-8,chrome);
  buildings.forEach(group=>group.traverse(object=>{if(object.material)object.material.clippingPlanes=[new THREE.Plane(V(0,1,0),0)];}));
  function texture(copy,index,mobile){
    const c=document.createElement('canvas');c.width=2048;c.height=mobile&&index>0&&index<3?1672:1296;
    const ctx=c.getContext('2d'),h=c.height;
    ctx.scale(c.width/1200,c.height/760);
    if(index===0){ctx.fillStyle='#02040d';ctx.fillRect(0,0,1200,760);}
    ctx.shadowColor='rgba(0,5,22,.6)';ctx.shadowBlur=8;
    ctx.fillStyle=copy.fg;ctx.font='30px monospace';ctx.fillText('',55,75);

    let lines=copy.lines,font=index===0?190:100;
    if(mobile&&index===1){lines=['MAKE THE','COMPLEX','FEEL','CLEAR.'];font=150;}
    if(mobile&&index===2){lines=['HUMAN','NEEDS.','AI','POSSIBILITIES.'];font=128;}
    ctx.fillStyle=copy.fg;ctx.font=`700 ${font}px Arial`;ctx.textBaseline='alphabetic';
    const top=mobile&&index>0&&index<3?300:290;
    lines.forEach((line,i)=>ctx.fillText(line,50,top+i*font*1.03));
    if(!mobile||index===0||index===3){ctx.font='48px Arial';copy.sub.forEach(()=>{});}

    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());return t;
  }
  const assetsReady=Promise.resolve();
  const visualRevision=0;
  function visualBillboard(canvas,index){
    const ctx=canvas.getContext('2d'),h=canvas.height;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);


    ctx.fillStyle='#f6f4f1';ctx.font='500 54px Arial';ctx.fillText('',55,90);
    ctx.fillStyle='#d3dce5';ctx.font='26px monospace';ctx.fillText('',55,h-32);
  }
  function phoneTexture(mode){
    const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=3072;
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());return{canvas,texture:t,mode};
  }
  function paintInterface(canvas,kind,phase){
    const c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/600,canvas.height/900);
    const motion=(Math.sin(phase)+1)/2,active=motion>.5;
    const rect=(x,y,w,h,color,r=24)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
    const text=(t,x,y,size,color='#ffffff')=>{c.fillStyle=color;c.font=`700 ${size}px Arial`;c.fillText(t,x,y);};
    if(kind===0){
      // One action, one outcome: a phone that reads immediately from a distance.
      rect(0,0,600,900,'#02040d');
      c.strokeStyle='#ffffff';c.lineWidth=5;c.strokeRect(34,70,532,570);
      c.fillStyle='#1e46e8';c.beginPath();c.arc(300,340,128,0,Math.PI*2);c.fill();
      c.fillStyle='#ffffff';c.beginPath();c.arc(300,340,51,0,Math.PI*2);c.fill();
      rect(52,710,496,112,active?'#ffffff':'#1e46e8',56);text(active?'DONE':'TAP',active?207:239,786,58,active?'#06104a':'#ffffff');
    }else if(kind===1){
      // An agent conversation reduced to two very clear shapes.
      rect(10,170,455,250,'#ffffff',65);c.fillStyle='#ffffff';c.beginPath();c.moveTo(90,400);c.lineTo(70,468);c.lineTo(180,400);c.fill();
      for(let i=0;i<3;i++)rect(65,235+i*53,310-i*58,21,'#0a1f98',10);
      rect(140,475,450,230,active?'#1e46e8':'#0a133b',65);c.fillStyle=active?'#1e46e8':'#0a133b';c.beginPath();c.moveTo(490,690);c.lineTo(545,756);c.lineTo(540,680);c.fill();
      text(active?'READY':'ASK',active?214:263,615,56);
    }else if(kind===2){
      // A focus ring and type scale convey accessibility without a wordy explanation.
      rect(8,170,584,550,'#ffffff',150);text('Aa',75,405,110+motion*65,'#06104a');rect(75,535,450,26,'#0a1f98',13);
      c.fillStyle='#1e46e8';c.beginPath();c.arc(110+motion*360,548,48,0,Math.PI*2);c.fill();
    }else{
      // A simple adaptive layout: elements reflow, then settle.
      const width=330+motion*255,x=(600-width)/2;
      rect(x,110,width,680,'#ffffff',40);rect(x+25,145,width-50,60,'#06104a',18);
      const gap=18,col=(width-68)/2;
      for(let i=0;i<4;i++){const stacked=width<430;const cw=stacked?width-50:col;rect(x+25+(stacked?0:i%2*(col+gap)),240+(stacked?i*125:Math.floor(i/2)*240),cw,stacked?105:215,i%2?'#1e46e8':'#dfe7ff',20);}
    }
    c.restore();
  }
  function paintPhone(phone,phase){paintInterface(phone.canvas,0,phase);phone.texture.needsUpdate=true;}
  function drawSearch(canvas,amount){
    const c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/1200,canvas.height/760);
    const cx=600,cy=345,r=270;
    c.fillStyle='#1e46e8';c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fill();
    c.save();c.beginPath();c.arc(cx,cy,r-30,0,Math.PI*2);c.clip();
    for(let i=0;i<4;i++){
      const x=cx+(i%2?100:-100)*(1-amount),y=cy+(i<2?-95:95)*(1-amount);
      c.globalAlpha=i===0?1:1-amount;c.fillStyle=i===0?'#030712':'#ffffff';c.beginPath();c.roundRect(x-65,y-65,130,130,25);c.fill();
    }
    c.restore();c.strokeStyle='#f3f5ff';c.lineWidth=30;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();c.lineCap='round';c.beginPath();c.moveTo(795,535);c.lineTo(925,665);c.stroke();c.restore();
  }
  const billboards=billboardCopy.map((copy,index)=>{
    const mount=new THREE.Group(),panel=new THREE.Group();mount.name='billboard-'+index;mount.add(panel);buildings[[2,0,1,7][index]].add(mount);
    const shape=new THREE.Shape(),r=.045,s=.515;
    shape.moveTo(-s+r,-s);shape.lineTo(s-r,-s);shape.quadraticCurveTo(s,-s,s,-s+r);shape.lineTo(s,s-r);shape.quadraticCurveTo(s,s,s-r,s);shape.lineTo(-s+r,s);shape.quadraticCurveTo(-s,s,-s,s-r);shape.lineTo(-s,-s+r);shape.quadraticCurveTo(-s,-s,-s+r,-s);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:texture(copy,index,false),transparent:true,depthWrite:false,fog:false,toneMapped:false}));face.position.z=.015;face.renderOrder=12+index;panel.add(face);
    const phones=[];
    if(index===1){
      const modes=index===1?[0]:[1];
      modes.forEach((mode,i)=>{
        const device=new THREE.Group();panel.add(device);
        const body=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelSegments:5,bevelSize:.025,bevelThickness:.018,curveSegments:12}),chrome);
        device.add(body);
        const screenData=phoneTexture(mode);
        const screen=new THREE.Mesh(new THREE.PlaneGeometry(.95,.95),new THREE.MeshBasicMaterial({map:screenData.texture,toneMapped:false}));screen.position.z=.079;screen.renderOrder=20;device.add(screen);
        box(device,.32,.024,.016,0,.457,.09,dark);
        device.position.set(0,-.035,.08);
        device.scale.set(.65,.86,1);
        phones.push({...screenData,device,baseX:device.position.x,baseY:device.position.y,side:i===0?-1:1});
      });
    }
    panel.traverse(object=>{if(object.material){object.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,1,0),0)];}});
    return{mount,panel,face,copy,index,phones,textures:[face.material.map,null]};
  });
  const satelliteDisplays=[3,4].map((buildingIndex,j)=>{
    const [x,y,z,w,h,d]=blocks[buildingIndex],canvas=document.createElement('canvas');canvas.width=2048;canvas.height=3072;
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
    const display=new THREE.Mesh(new THREE.PlaneGeometry(j===0?7:5.8,j===0?3.8:6.8),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:true,toneMapped:false,clippingPlanes:[new THREE.Plane(V(0,1,0),0)]}));
    display.renderOrder=30;display.position.set(x,h-4.2,z+d/2+.15);display.visible=false;buildings[buildingIndex].add(display);
    return{canvas,texture,kind:j+2};
  });
  // Background towers stay subordinate to the two principal displays.
  const waveform=new THREE.Group();waveform.position.set(0,3,-6.7);buildings[7].add(waveform);
  const waveShape=new THREE.Shape();waveShape.moveTo(-2.6,-.8);waveShape.lineTo(2.6,-.8);waveShape.absarc(2.6,0,.8,-Math.PI/2,Math.PI/2,false);waveShape.lineTo(-2.6,.8);waveShape.absarc(-2.6,0,.8,Math.PI/2,Math.PI*1.5,false);
  const waveBody=new THREE.Mesh(new THREE.ExtrudeGeometry(waveShape,{depth:.18,bevelEnabled:true,bevelSize:.06,bevelThickness:.04,bevelSegments:4,curveSegments:32}),new THREE.MeshPhysicalMaterial({color:0xf4f7ff,metalness:.32,roughness:.17,clearcoat:1}));waveform.add(waveBody);
  const waveBars=[];for(let i=0;i<27;i++){const bar=box(waveform,.065,.5,.06,-2.65+i*.155,0,.27,new THREE.MeshBasicMaterial({color:0x1334c9}));waveBars.push(bar);}
  const micRing=new THREE.Mesh(new THREE.TorusGeometry(.38,.035,12,48),white);micRing.position.set(2.35,0,.29);waveform.add(micRing);
  box(waveform,.12,.36,.07,2.35,.04,.3,white);box(waveform,.035,.17,.07,2.35,-.24,.3,white);box(waveform,.23,.035,.07,2.35,-.32,.3,white);
  billboards[3].face.visible=false;
  // A rotating three-dimensional globe crowns the name tower.
  const spinner=new THREE.Group();spinner.position.set(0,15.0,-9);buildings[2].add(spinner);
  const globe=new THREE.Mesh(new THREE.SphereGeometry(1.35,48,32),new THREE.MeshPhysicalMaterial({color:0xbfcfff,metalness:.8,roughness:.2,clearcoat:1}));spinner.add(globe);
  const orbitMaterial=new THREE.MeshBasicMaterial({color:0x263edf});
  for(const rotation of [0,Math.PI/3,Math.PI*2/3]){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.37,.023,8,96),orbitMaterial);ring.rotation.y=rotation;spinner.add(ring);}
  for(const y of [-.65,0,.65]){const ring=new THREE.Mesh(new THREE.TorusGeometry(Math.sqrt(1.37*1.37-y*y),.023,8,96),orbitMaterial);ring.rotation.x=Math.PI/2;ring.position.y=y;spinner.add(ring);}
  const halo=new THREE.Mesh(new THREE.TorusGeometry(1.8,.07,12,96),new THREE.MeshStandardMaterial({color:0xffffff,metalness:.5,roughness:.14}));halo.rotation.x=1.1;spinner.add(halo);
  let previousMobile,searchFrame=-1,visualFrame=-1;

  function layout(mobile){
    if(mobile===previousMobile)return;previousMobile=mobile;searchFrame=-1;visualFrame=-1;
    const positions=[[-.1,12.4,-3],[-2.25,7.8,-1.5],[2.25,7.8,-1.5],[0,3.8,-1.2]];
    billboards.forEach(({mount,panel,face,copy,index,textures})=>{
      mount.position.fromArray(copy.pos);mount.rotation.y=copy.turn;
      const w=copy.width,h=copy.height;
      panel.scale.set(w,h,1);if(mobile&&!textures[1])textures[1]=texture(copy,index,true);face.material.map=textures[mobile?1:0];
    });
  }
  return{billboards,buildings,assetsReady,update(p,time,mobile){
    layout(mobile);world.scale.x=mobile?.62:1;
    liquidNormal.offset.set(time*.000009,time*.000006);
    spinner.scale.x=mobile?1/.62:1;spinner.rotation.y=time===0?0:time*.00035;
    waveBars.forEach((bar,i)=>{bar.scale.y=time===0?1:.25+Math.abs(Math.sin(time*.003+i*.64))*1.85;});
    const phase=time===0?0:time*.00065, nextVisualFrame=(time===0?0:Math.floor(time/80))+visualRevision*10000000;
    if(nextVisualFrame!==visualFrame){
      visualFrame=nextVisualFrame;
      satelliteDisplays.forEach(display=>{paintInterface(display.canvas,display.kind,phase);display.texture.needsUpdate=true;});
      for(const index of [1,2]){
        for(const t of billboards[index].textures)if(t){if(index===2)paintInterface(t.image,1,phase);else visualBillboard(t.image,index);t.needsUpdate=true;}
        for(const phone of billboards[index].phones)paintPhone(phone,phase);
      }
    }

    const searchProgress=time===0?1:THREE.MathUtils.clamp((p-.20)/.38,0,1),frame=Math.round(searchProgress*45);
    if(frame!==searchFrame){searchFrame=frame;const sign=billboards[3];for(const t of sign.textures)if(t){drawSearch(t.image,searchProgress);t.needsUpdate=true;}}

    buildings.forEach((group,i)=>{
      const start=i===2?-.2:i>=8?-.12:i===0||i===7?.10:i===1?.34:.16+(i%3)*.07;
      const reveal=i===2||i>=8?1:THREE.MathUtils.smoothstep(p,start,start+.20);
      group.position.y=-(1-reveal)*25;group.visible=reveal>.001;
    });
    billboards.forEach(({mount,panel,index,copy})=>{
      const start=index===0?-.12:index===2?.34:.035;
      const reveal=index===0?1:THREE.MathUtils.smoothstep(p,start,start+.16);
      panel.position.y=0;panel.rotation.x=0;panel.visible=reveal>.001;
      for(const phone of billboards[index].phones){
        phone.device.rotation.y=0;
        phone.device.rotation.z=0;
        phone.device.position.y=phone.baseY+(time===0?0:Math.sin(phase+phone.side)*.012);
      }
      // The ground clips every rising object until it crosses the horizon.
      // Reveals are cumulative: no exit transform and no replacement of earlier signs.
    });
  }};
}
