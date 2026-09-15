import * as THREE from 'three';
import {createSculptureWorld,sculptureCamera} from './sculpture-world.js';

const section=document.querySelector('#journey'),container=document.querySelector('#canvas-container'),ui=document.querySelector('#scene-ui');
const status=document.querySelector('#journey-status'),count=document.querySelector('#journey-count'),fill=document.querySelector('#progress-fill');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=THREE.MathUtils.clamp;
let renderer,world,camera,raf,progress=0,target=0,last=0,ready=false;
let lastWheel=-1000,destination=0,movingUntil=0,touch=null;
const pointer=new THREE.Vector2(),parallax=new THREE.Vector2();
const range=()=>Math.max(1,section.offsetHeight-innerHeight);
// Three deliberate gestures reveal the intro; a fourth takes the visitor into the work.
const stops=()=>[0,range()*.25,range()*.55,range()*.85];
const inside=()=>ready&&scrollY<section.offsetTop+section.offsetHeight-2;
function scrollState(){target=clamp(scrollY/range(),0,1);document.body.classList.toggle('in-work',scrollY>=section.offsetHeight-innerHeight*.05);}
function advance(direction){
  const positions=stops();let base=performance.now()<movingUntil?destination:scrollY;
  let next=direction>0?positions.find(p=>p>base+6):positions.slice().reverse().find(p=>p<base-6);
  if(next===undefined)next=direction>0?section.offsetHeight:0;
  destination=next;movingUntil=performance.now()+650;
  window.scrollTo({top:next,behavior:reduced?'instant':'smooth'});
}
function fail(error){console.error('Scroll City could not start:',error);clearTimeout(window.cityTimer);window.cityFailed();}
try{
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',precision:'highp'});
  renderer.localClippingEnabled=true;
  renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,2),3));renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.append(renderer.domElement);
  const scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,180);
  world=createSculptureWorld(scene,renderer);ready=true;window.cityLoadProgress?.(55);
  Promise.race([world.assetsReady,new Promise(resolve=>setTimeout(resolve,8000))]).then(()=>{
    if(!ready)return;
    world.update(target,reduced?0:performance.now(),innerWidth<768);
    sculptureCamera(camera,target,innerWidth<768);renderer.render(scene,camera);
    window.cityLoadProgress?.(100);clearTimeout(window.cityTimer);document.body.classList.remove('scene-failed');document.body.classList.add('scene-ready');
  });
  window.addEventListener('scroll',scrollState,{passive:true});
  // A wheel/trackpad burst is one gesture. Its inertial events never consume extra steps.
  window.addEventListener('wheel',event=>{
    if(!inside()||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.deltaY===0)return;
    const now=performance.now(),fresh=now-lastWheel>220;lastWheel=now;event.preventDefault();if(fresh)advance(Math.sign(event.deltaY));
  },{passive:false});
  window.addEventListener('touchstart',event=>{touch=inside()&&event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
  window.addEventListener('touchmove',event=>{if(!touch||event.touches.length!==1){touch=null;return;}const dx=touch.x-event.touches[0].clientX,dy=touch.y-event.touches[0].clientY;if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx))event.preventDefault();},{passive:false});
  window.addEventListener('touchend',event=>{if(!touch)return;const dy=touch.y-event.changedTouches[0].clientY,dx=touch.x-event.changedTouches[0].clientX;touch=null;if(Math.abs(dy)>28&&Math.abs(dy)>Math.abs(dx))advance(Math.sign(dy));},{passive:true});
  window.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  window.addEventListener('keydown',event=>{if(!inside()||event.target.closest('a,button,input,textarea,select,[contenteditable]'))return;const down=['ArrowDown','PageDown',' '].includes(event.key),up=['ArrowUp','PageUp'].includes(event.key);if(down||up){event.preventDefault();if(!event.repeat)advance(up||event.shiftKey?-1:1);}});
  window.addEventListener('pointermove',event=>{pointer.set(event.clientX/innerWidth*2-1,1-event.clientY/innerHeight*2);},{passive:true});
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,2),3));renderer.setSize(innerWidth,innerHeight);scrollState();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;cancelAnimationFrame(raf);fail(new Error('Graphics context lost'));});
  renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
  scrollState();progress=target;
  function draw(now){
    raf=requestAnimationFrame(draw);if(document.hidden||now-last<20)return;last=now;if(scrollY>section.offsetHeight+innerHeight)return;
    progress=reduced?target:THREE.MathUtils.lerp(progress,target,.16);if(Math.abs(progress-target)<.0005)progress=target;
    const mobile=innerWidth<768;sculptureCamera(camera,progress,mobile);
    if(!reduced&&!mobile){parallax.lerp(pointer,.07);camera.rotation.y-=parallax.x*.006;camera.rotation.x+=parallax.y*.004;}
    world.update(progress,reduced?0:now,mobile);
    const title=document.querySelector('#intro-title');title.style.opacity=1-clamp(progress/.20,0,1);title.style.visibility=progress<.20?'visible':'hidden';
    const beat=progress<.20?0:progress<.45?1:progress<.72?2:3;count.textContent='0'+beat+' / 03';
    status.textContent=beat===3?'EXPLORE SELECTED WORK ↓':'CONTINUE ↓';
    fill.style.transform=`scaleX(${Math.min(progress/.68,1)})`;
    document.querySelector('#enter-work').classList.toggle('visible',progress>.72);
    const fade=1-clamp((scrollY-section.offsetHeight+innerHeight*.22)/(innerHeight*.22),0,1);container.style.opacity=fade;ui.style.opacity=fade;
    renderer.render(scene,camera);
  }
  raf=requestAnimationFrame(draw);
}catch(error){ready=false;fail(error);}
