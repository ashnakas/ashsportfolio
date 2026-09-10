import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createObservatory} from './cyber-world.js';

const section=document.querySelector('#journey'),container=document.querySelector('#canvas-container');
const opening=document.querySelector('#opening'),chapter=document.querySelector('#chapter'),arrival=document.querySelector('#arrival');
const link=document.querySelector('#chapter-link'),status=document.querySelector('#journey-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const projects=[
  ['01 / INTERACTION DESIGN','Pinwheels','Turning a moment of curiosity into purposeful discovery.','/pinwheels'],
  ['02 / PRODUCT DESIGN','ReCart','Connecting scattered possibilities. Giving good things a second life.','/recart'],
  ['03 / ACCESSIBLE EXPERIENCES','SHOWAbility','Opening up more ways to experience, participate, and belong.','#work'],
  ['04 / STORYTELLING','CNN Academy','Finding the human story. Sending it a little further.','#work']
];
let world,renderer,camera,mixer,duration,progress=0,target=0,raf,last=0,active=-2;
const pointer=new THREE.Vector2(),smoothedPointer=new THREE.Vector2();
const clamp=THREE.MathUtils.clamp,smooth=THREE.MathUtils.smoothstep;
function range(){return Math.max(1,section.offsetHeight-innerHeight);}
function onScroll(){target=clamp(scrollY/range(),0,1);document.body.classList.toggle('in-work',scrollY>=section.offsetHeight-innerHeight*.05);}
function fail(error){console.error('Observatory could not start:',error);clearTimeout(window.observatoryTimer);window.observatoryFailed();}
try{
  renderer=new THREE.WebGLRenderer({antialias:innerWidth>=768,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.25:1.5));renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  container.append(renderer.domElement);
  const scene=new THREE.Scene(),gltf=await new GLTFLoader().loadAsync('/walk-camera.gltf');scene.add(gltf.scene);
  gltf.scene.traverse(o=>{if(o.isCamera&&!camera)camera=o;});if(!camera||!gltf.animations.length)throw new Error('Camera animation missing');
  camera.aspect=innerWidth/innerHeight;camera.near=.02;camera.far=500;camera.updateProjectionMatrix();
  mixer=new THREE.AnimationMixer(gltf.scene);gltf.animations.forEach(clip=>{const action=mixer.clipAction(clip);action.setLoop(THREE.LoopOnce);action.clampWhenFinished=true;action.play();});duration=Math.max(...gltf.animations.map(a=>a.duration));
  // Keep the reference climb and stop inside the pavilion, before the final fly-away.
  const timeAt=p=>p*duration*.925;
  const sample=p=>{mixer.setTime(timeAt(p));scene.updateMatrixWorld(true);return{position:camera.getWorldPosition(new THREE.Vector3()),quaternion:camera.getWorldQuaternion(new THREE.Quaternion())};};
  world=createObservatory(scene,sample,renderer);mixer.setTime(0);
  clearTimeout(window.observatoryTimer);document.body.classList.remove('scene-failed');status.textContent='SCROLL TO WANDER ↓';
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);},{passive:true});
  window.addEventListener('blur',()=>pointer.set(0,0));
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.25:1.5));onScroll();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);fail(new Error('Graphics context lost'));});
  renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
  onScroll();progress=target;
  const savedPosition=new THREE.Vector3(),savedRotation=new THREE.Euler();
  function draw(now){
    raf=requestAnimationFrame(draw);if(document.hidden||now-last<24)return;last=now;
    if(scrollY>section.offsetHeight+innerHeight)return;
    progress=reduced?target:THREE.MathUtils.lerp(progress,target,.065);if(Math.abs(progress-target)<.0002)progress=target;
    mixer.setTime(timeAt(progress));camera.updateMatrixWorld(true);savedPosition.copy(camera.position);savedRotation.copy(camera.rotation);
    if(!reduced&&innerWidth>=768){smoothedPointer.lerp(pointer,.045);camera.position.x+=smoothedPointer.x*.07;camera.rotation.y-=smoothedPointer.x*.012;camera.rotation.x+=smoothedPointer.y*.008;}
    scene.updateMatrixWorld(true);
    const index=world.update(progress,now,camera);
    const intro=1-smooth(progress,.035,.14);opening.style.opacity=intro;opening.style.transform=`translateY(${-20*(1-intro)}px)`;opening.setAttribute('aria-hidden',String(intro<.1));
    const entered=smooth(progress,.88,.96);arrival.style.opacity=entered;arrival.setAttribute('aria-hidden',String(entered<.1));
    if(index!==active){active=index;chapter.setAttribute('aria-hidden',String(index<0));link.tabIndex=index<0?-1:0;
      if(index>=0){const data=projects[index];document.querySelector('#chapter-kind').textContent=data[0];document.querySelector('#chapter-title').textContent=data[1];document.querySelector('#chapter-copy').textContent=data[2];link.href=data[3];link.innerHTML=index<2?'Explore the project <span>↗</span>':'View selected work <span>↗</span>';}
    }
    chapter.style.opacity=index>=0?1:0;chapter.style.pointerEvents=index>=0?'auto':'none';
    document.querySelector('#journey-count').textContent=`${String(Math.max(0,index+1)||Math.min(4,Math.floor(progress*5))).padStart(2,'0')} / 04`;
    document.querySelector('#progress-fill').style.transform=`scaleX(${progress})`;
    const fade=1-clamp((scrollY-range())/innerHeight,0,1);container.style.opacity=fade;document.querySelector('#scene-ui').style.opacity=fade;
    renderer.render(scene,camera);camera.position.copy(savedPosition);camera.rotation.copy(savedRotation);
  }
  raf=requestAnimationFrame(draw);
}catch(error){fail(error);}
