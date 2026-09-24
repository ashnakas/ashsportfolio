import * as THREE from 'three';

export const billboardCopy=[
  {name:'Ashna Kasireddy',lines:['ASHNA','KASIREDDY'],sub:['FULL STACK · PRODUCT · AI'],fg:'#ffffff',width:5.8,height:3.6,pos:[0,8.8,-8.98],turn:0},
  {name:'One clear action',lines:[],sub:[],fg:'#ffffff',width:4.3,height:5.3,pos:[-4.64,5.5,18],turn:Math.PI/2},
  {name:'Human and AI',lines:[],sub:[],fg:'#ffffff',width:4.5,height:4.8,pos:[4.84,5.8,6],turn:-Math.PI/2},
  {name:'Systems that respond',lines:[],sub:[],fg:'#ffffff',width:8.8,height:3.2,pos:[0,3,-6.97],turn:0}
];

export function cityCamera(camera,p,mobile){
  const travel=THREE.MathUtils.smoothstep(p,0,.62);
  camera.position.set(0,1.72,34-travel*(mobile?24:27));
  camera.lookAt(0,4.4+travel*2.1,-10);
  camera.fov=mobile?76:58;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
}

export function createScrollCity(scene,renderer){
  const world=new THREE.Group();scene.add(world);scene.background=new THREE.Color('#183fe5');
  // Matte throughout: no metalness, no clearcoat, no reflection environment. Flat, graphic, edged
  // surfaces instead of the glossy PBR look — closer to a printed poster than a rendered material.
  const chrome=new THREE.MeshStandardMaterial({color:0xe8efff,metalness:0,roughness:.85});
  const building=new THREE.MeshStandardMaterial({color:0xf7f9ff,metalness:0,roughness:.85});
  const secondary=new THREE.MeshStandardMaterial({color:0xcdd9ff,metalness:0,roughness:.85});
  const dark=new THREE.MeshStandardMaterial({color:0x080d18,metalness:0,roughness:.9});
  const blue=new THREE.MeshBasicMaterial({color:0x3158ff,toneMapped:false});
  const white=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
  const asphalt=new THREE.MeshStandardMaterial({color:0x080f28,metalness:0,roughness:.95});
  scene.add(new THREE.AmbientLight(0xffffff,1.5));
  const sun=new THREE.DirectionalLight(0xffffff,1.7);sun.position.set(-8,22,15);scene.add(sun);
  // No reflection environment: with everything matte (metalness 0), nothing needs one to read
  // correctly, and skipping it removes a render-to-texture pass the old chrome/glass relied on.
  function box(parent,w,h,d,x,y,z,material=building){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m;}
  function line(parent,a,b,r=.018,material=white){const delta=new THREE.Vector3().subVectors(b,a),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),6),material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());parent.add(m);return m;}
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);

  // The whole set is one intersection. Four façades frame the signs.
  const blocks=[[-6.0,4.7,-4.8,6.0,9.4,4.0],[6.5,5.2,-7.0,6.8,10.4,4.4],[0,6.4,-11.2,5.2,12.8,4.4],[-7.5,7.8,-12,4.8,15.6,5],[7.5,8.6,-15,4.8,17.2,5],[-5,9.7,-19,3.6,19.4,4],[3,10.2,-22,4,20.4,4],[-7.2,7,19,5,14,7],[7.4,8,19,5,16,7],[-7.2,6,7,5,12,6],[7.4,7.5,7,5,15,6]];
  const windows=[],buildings=[];
  blocks.forEach(([x,y,z,w,h,d],i)=>{
    const firstChild=world.children.length,firstWindow=windows.length;
    box(world,w,h,d,x,y,z,i%3===0?secondary:building);
    box(world,w+.25,.16,d+.25,x,h,z,chrome);
    box(world,w+.4,.22,d+.4,x,.35,z,chrome);
    for(let column=0;column<Math.floor(w/.52);column++)for(let row=0;row<Math.floor(h/.64);row++){
      if(column%4!==0||row%4!==0)continue;
      windows.push([x-w/2+.32+column*.52,.9+row*.64,z+d/2+.012,.20,.34]);
    }
    for(const side of [-1,1])box(world,.035,h,.04,x+side*(w/2-.10),y,z+d/2+.025,chrome);
    if(i<3){box(world,w-.5,1.45,.10,x,1.15,z+d/2+.02,dark);for(let j=0;j<4;j++)box(world,.035,1.45,.12,x-w/2+.6+j*(w-1.2)/3,1.15,z+d/2+.08,chrome);}
    if(i>=7){
      const side=x<0?1:-1,inner=x+side*w/2;
      for(let row=0;row<Math.floor(h/.7);row++)for(let col=0;col<Math.floor(d/.6);col++)if(row%4===0&&col%3===0)windows.push([inner+side*.02,.8+row*.7,z-d/2+.35+col*.6,.22,.45,side*Math.PI/2]);
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
    const group=new THREE.Group();group.name='rising-building-'+i;
    for(const child of world.children.slice(firstChild))group.add(child);
    const panes=windows.slice(firstWindow),wm=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0x2347e5,transparent:true,opacity:.32}),panes.length),matrix=new THREE.Matrix4();
    panes.forEach(([px,py,pz,pw,ph,turn=0],j)=>{matrix.compose(V(px,py,pz),new THREE.Quaternion().setFromAxisAngle(V(0,1,0),turn),V(pw,ph,1));wm.setMatrixAt(j,matrix);});group.add(wm);world.add(group);buildings.push(group);

  });
  // Matte street, curb edges and crossing anchor the low camera.
  box(world,50,.15,85,0,-.15,3,asphalt);
  box(world,7,.13,60,-6.5,.04,7,secondary);box(world,7,.13,60,6.5,.04,7,secondary);
  for(let i=0;i<9;i++)box(world,.46,.012,3.0,-3.0+i*.75,.008,5.5,i%2?chrome:white);
  for(let i=0;i<9;i++)box(world,.46,.012,2.4,-3.0+i*.75,.008,21,i%2?chrome:white);
  for(const side of [-1,1]){
    box(world,.045,.02,48,side*3,.12,7,side<0?blue:white);
    for(const z of [25]){line(world,V(side*5.9,.1,z),V(side*5.9,3.4,z),.035,chrome);line(world,V(side*5.9,3.4,z),V(side*5.3,3.4,z),.03,chrome);box(world,.65,.055,.16,side*5.55,3.36,z,white);}
  }
  // Short, readable messages turn the street into a concise design narrative.
  function messageTexture(label,detail,invert=false){
    const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=448;const c=canvas.getContext('2d');
    c.fillStyle=invert?'#ffffff':'#02040d';c.fillRect(0,0,canvas.width,canvas.height);
    c.fillStyle=invert?'#07145b':'#ffffff';c.font='700 112px Arial';c.fillText(label,58,185);
    c.font='500 38px Arial';c.fillText(detail,62,290);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());return texture;
  }
  [
    [0,-6,7.1,-2.76,4.7,1.38,'DESIGN','FOR PEOPLE.',false],
    [1,6.5,7.8,-4.76,5.1,1.48,'BUILD','WITH INTENTION.',true]
  ].forEach(([buildingIndex,x,y,z,w,h,label,detail,invert])=>{
    // A crisp white edge (flat, unlit — always pure white regardless of light) gives every plaque
    // a hard graphic border instead of a shaded chrome bevel.
    box(buildings[buildingIndex],w+.16,h+.16,.09,x,y,z-.07,dark);
    box(buildings[buildingIndex],w+.28,h+.28,.03,x,y,z-.12,white);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:messageTexture(label,detail,invert),toneMapped:false}));
    mesh.position.set(x,y,z);mesh.renderOrder=24;buildings[buildingIndex].add(mesh);

  });
  // Street-level signage — small, factual, human-scale — sits opposite the big process words above.
  // Same street, two registers: the skyline speaks in ideas, the storefronts speak in specifics.
  function plateTexture(label,detail){
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=280;const c=canvas.getContext('2d');
    c.fillStyle='#f4f6ff';c.fillRect(0,0,canvas.width,canvas.height);
    c.fillStyle='#050912';c.font='700 60px Arial';c.fillText(label,42,112);
    c.fillStyle='#34383f';c.font='500 38px Arial';c.fillText(detail,46,192,930);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());return texture;
  }
  [
    [7,-7.2,19,1,'RECART','ONE SEARCH. MORE POSSIBILITIES.'],
    [8,7.4,19,-1,'RESEARCH','LISTEN. FIND THE PATTERN.'],
    [9,-7.2,7,1,'SHOWABILITY','ACCESS STARTS HERE.'],
    [10,7.4,7,-1,'SEATSCORE','HELP PEOPLE DECIDE.']
  ].forEach(([buildingIndex,x,z,side,label,detail])=>{
    const inner=x+side*2.5,px=inner+side*.16;
    box(buildings[buildingIndex],.07,.62,2.5,px,2.62,z,dark);
    box(buildings[buildingIndex],.02,.72,2.68,px-side*.02,2.62,z,white);
    const plate=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.5),new THREE.MeshBasicMaterial({map:plateTexture(label,detail),toneMapped:false}));
    plate.position.set(px+side*.045,2.62,z);plate.rotation.y=side*Math.PI/2;plate.renderOrder=24;
    buildings[buildingIndex].add(plate);
  });
  for(let z=-8;z<28;z+=2){
    box(world,.045,.02,1.05,0,.012,z,white);
    for(const side of [-1,1])box(world,6,.012,.018,side*6,.12,z,chrome);
  }
  const podium=new THREE.Group();podium.name='waveform-podium';world.add(podium);buildings.splice(7,0,podium);
  box(podium,6.4,4.8,2,0,2.4,-8,building);
  box(podium,6.6,.15,2.2,0,4.8,-8,chrome);
  // A running news ticker under the podium screen gives the architecture a Times Square silhouette.
  // RepeatWrapping already tiles a single copy edge-to-edge with no seam — baking extra copies
  // onto the canvas was pure waste and, at this string length, blew past the GPU's max texture
  // size (WebGLRenderer silently downscaled it, corrupting the frame). One copy, width-clamped.
  function tickerTexture(text){
    const probe=document.createElement('canvas').getContext('2d');probe.font='700 52px monospace';
    const unit=text+'     ·     ',unitWidth=Math.min(8192,Math.ceil(probe.measureText(unit).width));
    const canvas=document.createElement('canvas');canvas.width=unitWidth;canvas.height=110;
    const c=canvas.getContext('2d');c.fillStyle='#02040d';c.fillRect(0,0,canvas.width,canvas.height);
    c.fillStyle='#ffffff';c.font='700 52px monospace';c.textBaseline='middle';
    c.fillText(unit,0,58);
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
    t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;
    return t;
  }
  const tickerMap=tickerTexture('RESEARCH   /   DESIGN   /   BUILD');
  const ticker=new THREE.Mesh(new THREE.PlaneGeometry(6.0,.42),new THREE.MeshBasicMaterial({map:tickerMap,toneMapped:false}));
  ticker.position.set(0,3.7,-6.97);ticker.renderOrder=24;podium.add(ticker);
  buildings.forEach(group=>group.traverse(object=>{if(object.material)object.material.clippingPlanes=[new THREE.Plane(V(0,1,0),0)];}));
  function texture(copy,index,mobile){
    const c=document.createElement('canvas');c.width=2048;c.height=mobile&&index>0&&index<3?1672:1296;
    const ctx=c.getContext('2d'),h=c.height;
    ctx.scale(c.width/1200,c.height/760);
    if(index===0){ctx.fillStyle='#02040d';ctx.fillRect(0,0,1200,760);}
    ctx.shadowBlur=0;
    ctx.fillStyle=copy.fg;ctx.font='30px monospace';ctx.fillText('',55,75);

    let lines=copy.lines,font=index===0?190:100;
    if(mobile&&index===1){lines=['MAKE THE','COMPLEX','FEEL','CLEAR.'];font=150;}
    if(mobile&&index===2){lines=['HUMAN','NEEDS.','AI','POSSIBILITIES.'];font=128;}
    ctx.fillStyle=copy.fg;ctx.font=`700 ${font}px Arial`;ctx.textBaseline='alphabetic';
    const top=mobile&&index>0&&index<3?300:290;
    lines.forEach((line,i)=>ctx.fillText(line,50,top+i*font*1.03,1100));
    if(index===0){ctx.font='500 38px Arial';ctx.fillText(copy.sub[0],55,690);}

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
    // Quarter the pixel count of a full-res canvas: these panels are small on screen and this
    // texture gets re-rasterized and re-uploaded to the GPU repeatedly, so resolution costs compound.
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());return{canvas,texture:t,mode};
  }
  function paintInterface(canvas,kind,phase){
    const c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/600,canvas.height/900);
    const motion=(Math.sin(phase)+1)/2,active=motion>.5;
    const rect=(x,y,w,h,color,r=24)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
    const text=(t,x,y,size,color='#ffffff')=>{c.fillStyle=color;c.font=`700 ${size}px Arial`;c.fillText(t,x,y);};
    if(kind===0){
      rect(0,0,600,900,'#ffffff',0);
      text('ReCart',42,118,64,'#080b12');
      rect(36,165,528,105,'#f0f1f3',12);text('One search',65,232,43,'#080b12');
      c.strokeStyle='#183fe5';c.lineWidth=6;c.beginPath();c.arc(495,212,19,0,Math.PI*2);c.moveTo(510,226);c.lineTo(527,244);c.stroke();
      // One search resolves into a simple, shared result set across marketplaces.
      for(let i=0;i<3;i++){
        const y=320+i*112;
        rect(40,y,76,76,i===0?'#183fe5':'#10131a',8);
        text(['Depop','eBay','Poshmark'][i],142,y+48,36,'#080b12');
        if(active){text('✓',492,y+49,40,'#183fe5');}
      }
      rect(36,720,528,116,active?'#10131a':'#183fe5',12);text(active?'Saved ✓':'Save find',active?179:152,797,54);
    }else if(kind===1){
      rect(0,0,600,900,'#080b12',16);text('SeatScore',40,105,58);
      c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.moveTo(65,180);c.lineTo(535,180);c.stroke();
      for(let row=0;row<4;row++)for(let col=0;col<6;col++){
        const selected=row===2&&col===3;
        rect(65+col*80,240+row*85,52,52,selected?'#ffffff':'#183fe5',12);
        if(selected&&active){c.strokeStyle='#ffffff';c.lineWidth=3;c.strokeRect(58+col*80,233+row*85,66,66);}
      }
      text('Your best view.',40,685,54);text('C12',40,795,90);
      text('✓',475,791,85);
    }else if(kind===2){
      rect(0,0,600,900,'#ffffff',24);text('For everyone.',40,115,57,'#080b12');
      text('Aa',60,445,150+motion*40,'#080b12');
      rect(65,570,470,8,'#080b12',0);
      c.fillStyle='#183fe5';c.beginPath();c.arc(95+motion*400,574,30,0,Math.PI*2);c.fill();
      text('SHOWAbility',40,807,49,'#080b12');
    }else{
      rect(0,0,600,900,'#080b12',12);text('Find the pattern.',35,116,53);
      const settle=(1-Math.cos(phase))*.5;
      for(let i=0;i<6;i++){
        const col=i%2,row=Math.floor(i/2),dx=Math.sin(i*4)*45*(1-settle),dy=Math.cos(i*3)*30*(1-settle);
        rect(45+col*265+dx,235+row*160+dy,235,130,col?'#ffffff':'#183fe5',6);
        rect(68+col*265+dx,268+row*160+dy,130,8,col?'#080b12':'#ffffff',0);
        rect(68+col*265+dx,291+row*160+dy,88,8,col?'#080b12':'#ffffff',0);
      }
      text('Listen → Learn',40,817,47);
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
    const mount=new THREE.Group(),panel=new THREE.Group();mount.name='billboard-'+index;mount.add(panel);buildings[[2,8,11,7][index]].add(mount);
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
  const satelliteDisplays=[1,9].map((buildingIndex,j)=>{
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
    const display=new THREE.Mesh(new THREE.PlaneGeometry(3.4,5.1),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:true,toneMapped:false,clippingPlanes:[new THREE.Plane(V(0,1,0),0)]}));
    display.renderOrder=30;
    if(j===0){display.position.set(6.5,4.2,-4.7);}
    else{display.position.set(4.82,6,19);display.rotation.y=-Math.PI/2;}
    buildings[buildingIndex].add(display);
    return{canvas,texture,kind:j+2};
  });
  // Background towers stay subordinate to the two principal displays.
  const waveform=new THREE.Group();waveform.position.set(-4.64,4.6,6.4);waveform.rotation.y=Math.PI/2;buildings[10].add(waveform);
  const waveShape=new THREE.Shape();waveShape.moveTo(-2.6,-.8);waveShape.lineTo(2.6,-.8);waveShape.absarc(2.6,0,.8,-Math.PI/2,Math.PI/2,false);waveShape.lineTo(-2.6,.8);waveShape.absarc(-2.6,0,.8,Math.PI/2,Math.PI*1.5,false);
  const waveBody=new THREE.Mesh(new THREE.ExtrudeGeometry(waveShape,{depth:.18,bevelEnabled:true,bevelSize:.06,bevelThickness:.04,bevelSegments:4,curveSegments:32}),new THREE.MeshStandardMaterial({color:0xf4f7ff,metalness:0,roughness:.85}));waveform.add(waveBody);
  const waveBars=[];for(let i=0;i<27;i++){const bar=box(waveform,.065,.5,.06,-2.65+i*.155,0,.27,new THREE.MeshBasicMaterial({color:0x1334c9}));waveBars.push(bar);}
  const micRing=new THREE.Mesh(new THREE.TorusGeometry(.38,.035,12,48),white);micRing.position.set(2.35,0,.29);waveform.add(micRing);
  box(waveform,.12,.36,.07,2.35,.04,.3,white);box(waveform,.035,.17,.07,2.35,-.24,.3,white);box(waveform,.23,.035,.07,2.35,-.32,.3,white);
  // Three frames resolve into one square: research, design and build as one practice.
  const spinner=new THREE.Group();spinner.position.set(0,14.6,-10.1);buildings[2].add(spinner);
  const frames=[white,dark,white].map((material,i)=>{
    const frame=new THREE.Group(),size=2.6-i*.52;
    for(const side of [-1,1]){box(frame,.09,size,.09,side*size/2,0,0,material);box(frame,size,.09,.09,0,side*size/2,0,material);}
    spinner.add(frame);return frame;
  });
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
    layout(mobile);world.scale.x=mobile?.78:1;
    tickerMap.offset.x=0;
    spinner.scale.x=mobile?1/.78:1;
    frames.forEach((frame,i)=>{frame.rotation.y=time===0?0:Math.sin(time*.0004)*(.35+i*.35);frame.rotation.z=time===0?0:Math.sin(time*.0002)*i*.12;});
    waveBars.forEach((bar,i)=>{bar.scale.y=time===0?1:.25+Math.abs(Math.sin(time*.003+i*.64))*1.85;});
    const phase=time===0?0:time*.00065;
    const interval=mobile?150:80, nextVisualFrame=(time===0?0:Math.floor(time/interval))+visualRevision*10000000;
    // Nothing that repaints below is visible before the walk begins, so skip the canvas work
    // entirely at rest instead of re-rasterizing and re-uploading textures no one can see yet.
    if(nextVisualFrame!==visualFrame){
      visualFrame=nextVisualFrame;
      satelliteDisplays.forEach(display=>{paintInterface(display.canvas,display.kind,phase);display.texture.needsUpdate=true;});
      for(const index of [1,2]){
        for(const t of billboards[index].textures)if(t){if(index===2)paintInterface(t.image,1,phase);else visualBillboard(t.image,index);t.needsUpdate=true;}
        for(const phone of billboards[index].phones)paintPhone(phone,phase);
      }
    }

    // Condensed pacing: the same reveal order, packed into a shorter stretch of p so the walk
    // reads dense and quick rather than spread thin across a long scroll.
    const searchProgress=time===0?1:THREE.MathUtils.clamp((p-.13)/.28,0,1),frame=Math.round(searchProgress*45);
    if(frame!==searchFrame){searchFrame=frame;const sign=billboards[3];for(const t of sign.textures)if(t){drawSearch(t.image,searchProgress);t.needsUpdate=true;}}

    buildings.forEach((group,i)=>{
      const start=i>=8?(i<10?-.14:.08):i===2?.25:.06+(i%3)*.035;
      const reveal=THREE.MathUtils.smoothstep(p,start,start+.16);
      group.position.y=-(1-reveal)*25;group.visible=reveal>.001;
    });
    billboards.forEach(({mount,panel,index,copy})=>{
      const start=index===0?.3:index===2?.15:.01;
      const reveal=THREE.MathUtils.smoothstep(p,start,start+.11);
      panel.position.y=0;panel.rotation.x=0;panel.visible=reveal>.001;
      if(index===3)panel.visible=false;
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
