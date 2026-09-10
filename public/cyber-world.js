import * as THREE from 'three';
const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);

export function createObservatory(scene,sampleCamera,renderer){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const world=new THREE.Group();world.name='Observatory world';scene.add(world);
  const start=sampleCamera(0),finish=sampleCamera(1);
  const chrome=new THREE.MeshStandardMaterial({color:0xe5eaff,metalness:1,roughness:.16});
  const pearl=new THREE.MeshPhysicalMaterial({color:0xe8eaf6,metalness:.42,roughness:.24,clearcoat:1});
  const glass=new THREE.MeshPhysicalMaterial({color:0xa9c9ff,metalness:.08,roughness:.09,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false,clearcoat:1});
  const rose=new THREE.MeshStandardMaterial({color:0xf5bfe5,metalness:.7,roughness:.18,emissive:0x5e1b41,emissiveIntensity:.1});
  const light=new THREE.MeshBasicMaterial({color:0xe5ecff,toneMapped:false});
  const pinkLight=new THREE.MeshBasicMaterial({color:0xffc5e9,toneMapped:false});
  const navy=new THREE.MeshStandardMaterial({color:0x1c337b,metalness:.8,roughness:.2});

  // Continuous procedural atmosphere, with clouds below and a cobalt zenith.
  const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uTime:{value:0}},
    vertexShader:`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec3 vDirection;uniform float uTime;
      float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
      float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1)),f.x),f.y),f.z);}
      float fbm(vec3 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+7.1;a*=.5;}return n;}
      void main(){vec3 d=normalize(vDirection);vec3 col=mix(vec3(.30,.40,.77),vec3(.015,.045,.34),smoothstep(-.1,.85,d.y));
        float dusk=exp(-pow((d.y+.04)*4.,2.));col+=vec3(.19,.10,.18)*dusk;
        vec3 p=d*vec3(7.,12.,7.)+vec3(uTime*.002,0.,0.);float cloud=fbm(p),detail=fbm(p*2.2+4.);
        float body=smoothstep(.36,.69,cloud+detail*.16)*(1.-smoothstep(-.1,.34,d.y));
        vec3 cloudColor=mix(vec3(.31,.37,.64),vec3(.91,.86,.94),smoothstep(.44,.67,cloud));col=mix(col,cloudColor,body*.97);
        col+=vec3(.75,.81,1.)*step(.9989,hash(floor(d*720.)))*smoothstep(.18,.65,d.y)*.55;
        gl_FragColor=vec4(col,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(220,40,24),skyMaterial);sky.position.copy(start.position);sky.renderOrder=-100;scene.add(sky);
  scene.background=new THREE.Color('#152e80');scene.fog=new THREE.FogExp2('#8b99d4',.008);

  // A reflection environment is computed once, keeping reflective materials inexpensive.
  const envScene=new THREE.Scene();envScene.background=new THREE.Color('#7586c2');
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(80,24,16),new THREE.MeshBasicMaterial({color:0x122d7e,side:THREE.BackSide})));
  for(const [x,y,z,w,h,color] of [[0,18,0,35,20,0xffffff],[-15,4,8,7,28,0xd5e8ff],[16,4,-9,12,25,0xffd8f3],[0,-15,0,24,10,0x6877bc]]){
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));plane.position.set(x,y,z);plane.lookAt(0,0,0);envScene.add(plane);
  }
  const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(envScene,.045);
  scene.environment=environment.texture;pmrem.dispose();envScene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  world.add(new THREE.HemisphereLight(0xe2eaff,0x283971,2.4));
  const sun=new THREE.DirectionalLight(0xf3e9ff,3.5);sun.position.set(-7,20,25);world.add(sun);
  const edge=new THREE.DirectionalLight(0xadcfff,2);edge.position.set(15,8,-20);world.add(edge);
  function mesh(parent,geometry,material,x=0,y=0,z=0){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);parent.add(o);return o;}
  function tube(parent,points,radius=.025,material=chrome){return mesh(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(24,points.length*3),radius,6,false),material);}
  function ring(parent,radius,width,material,x=0,y=0,z=0){return mesh(parent,new THREE.TorusGeometry(radius,width,10,96),material,x,y,z);}
  function anchored(p,x,y,z){const pose=sampleCamera(p),g=new THREE.Group();g.position.copy(pose.position).add(new THREE.Vector3(x,y,z).applyQuaternion(pose.quaternion));g.quaternion.copy(pose.quaternion);world.add(g);return g;}

  // A continuous silver ribbon follows the camera's physical climb.
  const vertices=[],indices=[],left=[],right=[],route=[];
  for(let i=0;i<=120;i++){
    const p=i/120,pose=sampleCamera(p),center=pose.position.clone().add(new THREE.Vector3(0,-1.18,-.6));
    const width=THREE.MathUtils.lerp(1.05,2.25,smooth(.72,1,p));
    const sideways=new THREE.Vector3(1,0,0).applyQuaternion(pose.quaternion);sideways.y=0;sideways.normalize();
    const l=center.clone().addScaledVector(sideways,-width),r=center.clone().addScaledVector(sideways,width);left.push(l);right.push(r);route.push(center);
    vertices.push(...l.toArray(),...r.toArray());if(i<120){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const pathMaterial=pearl.clone();pathMaterial.side=THREE.DoubleSide;pathMaterial.color.set('#bac7e7');mesh(world,geometry,pathMaterial);
  tube(world,left,.027,chrome);tube(world,right,.027,chrome);
  tube(world,left.map(v=>v.clone().add(new THREE.Vector3(0,.017,0))),.009,light);
  tube(world,right.map(v=>v.clone().add(new THREE.Vector3(0,.017,0))),.009,light);
  let distance=0,last=route[0];route.forEach((v,i)=>{distance+=v.distanceTo(last);last=v;if(distance>.34){distance=0;tube(world,[left[i],right[i]],.006,chrome);}});

  // The pavilion stays in the world throughout the journey; the camera enters its dome.
  const pavilion=new THREE.Group();pavilion.name='Glass observatory';
  pavilion.position.copy(finish.position).add(new THREE.Vector3(0,0,-4.4).applyQuaternion(finish.quaternion));pavilion.position.y=finish.position.y-1.18;world.add(pavilion);
  const radius=5.4;
  mesh(pavilion,new THREE.CylinderGeometry(6.1,5.7,.20,96),pearl,0,-.12,0);
  mesh(pavilion,new THREE.CylinderGeometry(5.5,5.5,.04,96),navy,0,.008,0);
  for(const [r,mat] of [[6.12,chrome],[5.65,light],[4.1,chrome],[2.35,chrome]]){const o=ring(pavilion,r,.025,mat);o.rotation.x=Math.PI/2;o.position.y=.05;}
  mesh(pavilion,new THREE.SphereGeometry(radius,56,28,0,Math.PI*2,0,Math.PI/2),glass);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,points=[];for(let j=0;j<=32;j++){const theta=j/32*Math.PI/2;points.push(new THREE.Vector3(Math.sin(theta)*radius*Math.cos(a),Math.cos(theta)*radius,Math.sin(theta)*radius*Math.sin(a)));}tube(pavilion,points,.027,chrome);}
  const crown=ring(pavilion,2.6,.023,light,0,4.65,0);crown.rotation.x=Math.PI/2;
  const orbit=ring(pavilion,7.4,.035,chrome,0,3.2,0);orbit.rotation.set(Math.PI/2+.15,.12,.08);
  const orbitLight=ring(pavilion,7.43,.010,pinkLight,0,3.2,0);orbitLight.rotation.copy(orbit.rotation);
  const telescope=new THREE.Group();telescope.position.set(0,1.7,-1.2);telescope.rotation.z=-.65;pavilion.add(telescope);
  mesh(telescope,new THREE.CylinderGeometry(.3,.4,2.4,32),pearl);
  mesh(telescope,new THREE.CylinderGeometry(.285,.285,.07,32),navy,0,1.21,0);
  const rim=ring(telescope,.30,.035,chrome,0,1.24,0);rim.rotation.x=Math.PI/2;
  for(let i=0;i<3;i++){const a=i*2*Math.PI/3;tube(pavilion,[new THREE.Vector3(0,1.2,-1.2),new THREE.Vector3(Math.cos(a)*.8,.12,-1.2+Math.sin(a)*.8)],.045,chrome);}
  const bench=mesh(pavilion,new THREE.TorusGeometry(3.6,.16,12,72,Math.PI*.7),pearl,0,.42,-.2);bench.rotation.x=Math.PI/2;bench.rotation.z=.45;

  const moon=anchored(0,-12,11,-50);mesh(moon,new THREE.SphereGeometry(2,40,28),pearl);
  const moonRing=ring(moon,3.2,.018,chrome);moonRing.rotation.set(.35,.75,.1);
  const stars=new THREE.BufferGeometry(),starPositions=[];let seed=31;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  for(let i=0;i<180;i++)starPositions.push(start.position.x+(random()-.5)*150,8+random()*65,start.position.z-12-random()*120);
  stars.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));world.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0xebefff,size:.045,transparent:true,opacity:.7,sizeAttenuation:true})));

  const moments=[];
  function moment(p,name,url,side){const root=anchored(p,side*.58,.05,-3),art=new THREE.Group();root.name=name;root.add(art);const base=root.position.clone(),offset=new THREE.Vector3(side*.58,0,0).applyQuaternion(root.quaternion);moments.push({root,art,p,name,url,base,offset});return art;}
  const flower=moment(.22,'Pinwheels','/pinwheels',1),petals=[];
  for(let i=0;i<7;i++){const hinge=new THREE.Group();hinge.rotation.z=i/7*Math.PI*2;flower.add(hinge);const petal=mesh(hinge,new THREE.SphereGeometry(1,24,16),i%3===0?rose:chrome,0,.46,0);petal.scale.set(.18,.49,.065);petal.rotation.z=.25;petals.push(hinge);}
  mesh(flower,new THREE.SphereGeometry(.17,24,16),pearl,0,0,.11);
  ring(flower,1.13,.012,light).rotation.y=.35;

  const constellation=moment(.43,'ReCart','/recart',-1),beads=[],beadCount=12;
  for(let i=0;i<beadCount;i++)beads.push(mesh(constellation,new THREE.SphereGeometry(i%3===0?.10:.06,16,12),i%3===0?rose:chrome));
  const constellationGeometry=new THREE.BufferGeometry();constellationGeometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(beadCount*6),3));
  constellation.add(new THREE.LineSegments(constellationGeometry,new THREE.LineBasicMaterial({color:0xe1e8ff,transparent:true,opacity:.55})));
  ring(constellation,.46,.017,chrome).rotation.x=.7;

  const orb=moment(.63,'SHOWAbility','#work',1);
  mesh(orb,new THREE.SphereGeometry(.67,40,28),glass);
  const orbCore=mesh(orb,new THREE.IcosahedronGeometry(.28,3),rose),orbRings=[];
  for(let i=0;i<3;i++){const o=ring(orb,.80+i*.10,.019,i===1?rose:chrome);o.rotation.set(i*.7,.4+i*.9,0);orbRings.push(o);}

  const satellite=moment(.81,'CNN Academy','#work',-1);
  mesh(satellite,new THREE.OctahedronGeometry(.32,0),chrome);
  const dish=mesh(satellite,new THREE.SphereGeometry(.47,32,16,0,Math.PI*2,0,.65),pearl,0,.06,.27);dish.rotation.x=Math.PI/2;
  tube(satellite,[new THREE.Vector3(0,0,.3),new THREE.Vector3(0,0,.8)],.018,chrome);
  mesh(satellite,new THREE.SphereGeometry(.035,12,8),pinkLight,0,0,.81);
  for(const side of [-1,1]){tube(satellite,[new THREE.Vector3(side*.2,0,0),new THREE.Vector3(side*.85,0,0)],.025,chrome);mesh(satellite,new THREE.BoxGeometry(.62,.78,.035),navy,side*.77,0,0);for(let j=0;j<5;j++)tube(satellite,[new THREE.Vector3(side*.77-.28,-.32+j*.16,.025),new THREE.Vector3(side*.77+.28,-.32+j*.16,.025)],.007,chrome);}
  ring(satellite,1.15,.009,light).rotation.y=.25;

  const pointer=new THREE.Vector2(),ray=new THREE.Raycaster();let activeCamera,current=-1;
  function hit(event){if(!activeCamera||current<0)return null;pointer.set(event.clientX/innerWidth*2-1,1-event.clientY/innerHeight*2);ray.setFromCamera(pointer,activeCamera);return ray.intersectObject(moments[current].art,true)[0];}
  window.addEventListener('click',e=>{if(e.target.closest?.('a,button'))return;if(hit(e))location.href=moments[current].url;});
  return {moments,update(p,time,camera){
    activeCamera=camera;const t=reduced?0:time*.001;sky.position.copy(camera.getWorldPosition(new THREE.Vector3()));skyMaterial.uniforms.uTime.value=t;
    const fit=Math.min(1,Math.max(.5,camera.aspect));current=-1;
    moments.forEach((m,i)=>{const entrance=smooth(m.p-.15,m.p-.075,p),exit=1-smooth(m.p+.09,m.p+.17,p);m.root.visible=entrance*exit>.001;m.root.scale.setScalar(fit*(.68+.32*entrance)*exit);m.root.position.copy(m.base).addScaledVector(m.offset,fit-1);m.art.position.y=Math.sin(t*.5+i)*.045;if(p>m.p-.08&&p<m.p+.1)current=i;});
    const bloom=smooth(.07,.24,p);petals.forEach((h,i)=>{h.rotation.x=(1-bloom)*1.25;h.rotation.z=i/7*Math.PI*2+t*.055;});flower.rotation.y=Math.sin(t*.2)*.15;
    const join=smooth(.29,.44,p),pos=constellationGeometry.attributes.position;
    beads.forEach((b,i)=>{const a=i/beadCount*Math.PI*2;b.position.set(Math.cos(a)*(.74+(1-join)*.30*Math.sin(i*4)),Math.sin(a)*(.74+(1-join)*.24*Math.cos(i*3)),Math.sin(a*2)*.19*(1-join));});
    beads.forEach((b,i)=>{pos.setXYZ(i*2,...b.position.toArray());pos.setXYZ(i*2+1,...beads[(i+1)%beadCount].position.toArray());});pos.needsUpdate=true;
    constellation.rotation.set(.2,Math.sin(t*.17)*.3,t*.06);orbRings.forEach((r,i)=>{r.rotation.y=t*.16+i*.9;r.rotation.x=i*.7+p*.9;});orbCore.rotation.y=t*.35;
    satellite.rotation.set(.15,-.6+smooth(.66,.83,p)*.8,Math.sin(t*.2)*.08);crown.material=p>.83?pinkLight:light;return current;
  },dispose(){environment.dispose();}};
}
