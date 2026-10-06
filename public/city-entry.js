import * as THREE from 'three';
import {createScrollCity,cityCamera} from './scroll-city.js';
const container=document.querySelector('#canvas-container'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const destinations={recart:{position:[.6,5.4,23],look:[-4.6,5.4,18]},pinwheels:{position:[-.8,6.5,13],look:[4.8,6,7]},showability:{position:[0,5,7],look:[6.5,4.7,-4.7]},moonbase:{position:[-2,18,2],look:[-7.5,17,-12]}};
let ready=false,raf,last=0,focus=null,returning=false,savedPosition,savedLook;
try{
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.5:2));renderer.setSize(innerWidth,innerHeight);renderer.localClippingEnabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=innerWidth>=768;renderer.shadowMap.type=THREE.PCFSoftShadowMap;container.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,180),world=createScrollCity(scene,renderer),look=new THREE.Vector3(0,6,-5),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 cityCamera(camera,0,innerWidth<768);const homePosition=camera.position.clone(),homeLook=look.clone();let goalPosition=homePosition.clone(),goalLook=look.clone();
 window.cityLoadProgress?.(65);
 world.assetsReady.then(()=>{world.update(1,0,innerWidth<768);renderer.render(scene,camera);ready=true;clearTimeout(window.cityTimer);document.body.classList.add('scene-ready');window.cityLoadProgress?.(100);});
 function resize(){camera.aspect=innerWidth/innerHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.5:2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=innerWidth>=768;if(!focus){cityCamera(camera,0,innerWidth<768);homePosition.copy(camera.position);goalPosition.copy(homePosition);}camera.updateProjectionMatrix();}
 window.addEventListener('resize',resize);
 window.addEventListener('city-focus',e=>{const destination=destinations[e.detail];if(!destination)return;if(!focus){savedPosition=camera.position.clone();savedLook=look.clone();}focus=e.detail;returning=false;goalPosition.fromArray(destination.position);goalLook.fromArray(destination.look);document.querySelectorAll('.project-dock button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.project===focus));});
 window.addEventListener('city-return',()=>{focus=null;returning=true;goalPosition.copy(savedPosition||homePosition);goalLook.copy(savedLook||homeLook);document.querySelectorAll('.project-dock button').forEach(b=>b.setAttribute('aria-pressed','false'));});
 function hit(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(world.targets,true).find(h=>{let o=h.object;while(o){if(!o.visible)return false;o=o.parent;}return true;});}
 container.addEventListener('pointermove',e=>{if(!ready)return;container.style.cursor=hit(e)?'pointer':'default';});container.addEventListener('click',e=>{if(!ready||focus)return;const selected=hit(e);if(selected)window.dispatchEvent(new CustomEvent('city-select',{detail:selected.object.userData.project}));});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;cancelAnimationFrame(raf);window.cityFailed();});renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
 function draw(now){raf=requestAnimationFrame(draw);if(!ready||document.hidden||now-last<33||scrollY>innerHeight*1.2)return;const delta=Math.min((now-last)/1000,.1);last=now;const alpha=reduced?1:1-Math.exp(-delta*5);camera.position.lerp(goalPosition,alpha);look.lerp(goalLook,alpha);if(returning&&camera.position.distanceTo(goalPosition)<.002){camera.position.copy(goalPosition);look.copy(goalLook);returning=false;}camera.lookAt(look);camera.updateMatrixWorld();world.update(1,reduced?0:now,innerWidth<768);renderer.render(scene,camera);}
 raf=requestAnimationFrame(draw);
}catch(error){console.error('City could not start',error);clearTimeout(window.cityTimer);window.cityFailed();}
