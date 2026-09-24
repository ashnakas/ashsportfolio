import * as THREE from 'three';
import {createScrollCity,cityCamera} from './scroll-city.js';

const section=document.querySelector('#journey'),container=document.querySelector('#canvas-container'),ui=document.querySelector('#scene-ui');
const status=document.querySelector('#journey-status'),count=document.querySelector('#journey-count'),fill=document.querySelector('#progress-fill');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=THREE.MathUtils.clamp;
let renderer,world,camera,raf,progress=0,target=0,last=0,ready=false;
const pointer=new THREE.Vector2(),parallax=new THREE.Vector2();
const range=()=>Math.max(1,section.offsetHeight-innerHeight);
function scrollState(){
  target=clamp((scrollY-section.offsetTop)/range(),0,1);
  document.body.classList.toggle('in-work',scrollY>=section.offsetTop+section.offsetHeight-innerHeight*.05);
}
function fail(error){console.error('Scroll City could not start:',error);clearTimeout(window.cityTimer);window.cityFailed();}
try{
  // Preserve crisp type and edges on both screen sizes; cap resolution for mobile memory.
  const mobileGpu=innerWidth<768;
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',precision:'highp'});
  renderer.localClippingEnabled=true;
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobileGpu?2:2.5));renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.append(renderer.domElement);
  const scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,180);
  world=createScrollCity(scene,renderer);ready=true;window.cityLoadProgress?.(55);
  Promise.race([world.assetsReady,new Promise(resolve=>setTimeout(resolve,8000))]).then(()=>{
    if(!ready)return;
    world.update(target,reduced?0:performance.now(),innerWidth<768);
    cityCamera(camera,target,innerWidth<768);renderer.render(scene,camera);
    window.cityLoadProgress?.(100);clearTimeout(window.cityTimer);document.body.classList.remove('scene-failed');document.body.classList.add('scene-ready');
  });
  window.addEventListener('scroll',scrollState,{passive:true});
  window.addEventListener('pointermove',event=>{pointer.set(event.clientX/innerWidth*2-1,1-event.clientY/innerHeight*2);},{passive:true});
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?2:2.5));renderer.setSize(innerWidth,innerHeight);scrollState();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;cancelAnimationFrame(raf);fail(new Error('Graphics context lost'));});
  renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
  scrollState();progress=target;
  function draw(now){
    raf=requestAnimationFrame(draw);if(document.hidden||now-last<20)return;last=now;if(scrollY>section.offsetHeight+innerHeight)return;
    progress=reduced?target:THREE.MathUtils.lerp(progress,target,.16);if(Math.abs(progress-target)<.0005)progress=target;
    const mobile=innerWidth<768;cityCamera(camera,progress,mobile);
    if(!reduced&&!mobile){parallax.lerp(pointer,.07);camera.rotation.y-=parallax.x*.006;camera.rotation.x+=parallax.y*.004;}
    world.update(progress,reduced?0:now,mobile);
    const title=document.querySelector('#intro-title');title.style.opacity=1-clamp(progress/.19,0,1);title.style.visibility=progress<.19?'visible':'hidden';
    const beat=progress<.20?0:progress<.48?1:progress<.72?2:3;count.textContent='0'+beat+' / 03';
    status.textContent=beat===3?'ENTER PORTFOLIO ↓':'SCROLL TO ENTER ↓';
    fill.style.transform=`scaleX(${progress})`;
    document.querySelector('#enter-work').classList.toggle('visible',progress>.84);
    const fade=1-clamp((scrollY-section.offsetHeight+innerHeight*.22)/(innerHeight*.22),0,1);container.style.opacity=fade;ui.style.opacity=fade;
    renderer.render(scene,camera);
  }
  raf=requestAnimationFrame(draw);
}catch(error){ready=false;fail(error);}
