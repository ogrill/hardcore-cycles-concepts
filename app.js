'use strict';
const menuButton=document.querySelector('.mobile-menu');
const mainNav=document.getElementById('mainnav');
if(menuButton&&mainNav){
 menuButton.addEventListener('click',()=>{
  const open=mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.innerHTML=open?'CLOSE <span aria-hidden="true">✕</span>':'MENU <span aria-hidden="true">☰</span>';
 });
 mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mainNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
 }));
}
// Premium 50-star, 13-stripe US flag: drawn locally; no external script or video.
(function flagAnimation(){
 const canvas=document.getElementById('waving-flag');
 if(!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return;
 const flag=document.createElement('canvas');
 const W=900,H=475,sw=W/13;
 flag.width=W;flag.height=H;
 const p=flag.getContext('2d');
 const stripe=H/13;
 const red='#B22234',blue='#3C3B6E';
 for(let j=0;j<13;j++){
  p.fillStyle=j%2===0?red:'#fff';
  p.fillRect(0,j*stripe,W,stripe+.75);
 }
 const cantonW=W*.4,cantonH=stripe*7;
 p.fillStyle=blue;p.fillRect(0,0,cantonW,cantonH);
 function star(cx,cy,r){
  p.beginPath();
  for(let i=0;i<10;i++){
   const a=(i*Math.PI/5)-Math.PI/2;
   const rad=i%2?0.40*r:r;
   p[i===0?'moveTo':'lineTo'](cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);
  }
  p.closePath();p.fill();
 }
 p.fillStyle='#fff';
 // Nine staggered rows: six stars on five rows, five stars on four rows.
 for(let row=0;row<9;row++){
  const count=row%2===0?6:5;
  const xOffset=row%2===0?0.5:1.0;
  for(let col=0;col<count;col++)
   star((col+xOffset)*(cantonW/6), (row+1)*(cantonH/10), 10.1);
 }
 // Fine woven-cloth texture, in the underlying image so it follows the folds.
 for(let y=0;y<H;y+=3){
  p.fillStyle='rgba(0,0,0,0.025)';
  p.fillRect(0,y,W,1);
 }
 const prefersStill=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let visible=true,raf=0,last=0;
 const offsetX=64,offsetY=70,stripWidth=4;
 function render(ms){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Pole, finial and understated metallic highlights.
  const pole=ctx.createLinearGradient(31,0,53,0);
  pole.addColorStop(0,'#262522');pole.addColorStop(.25,'#a5a1a0');
  pole.addColorStop(.52,'#e2ddd2');pole.addColorStop(.8,'#72706a');
  pole.addColorStop(1,'#292928');
  ctx.fillStyle=pole;ctx.fillRect(30,44,21,561);
  ctx.beginPath();ctx.arc(40.5,43,14,0,Math.PI*2);
  ctx.fillStyle='#c7bfa9';ctx.fill();
  ctx.beginPath();ctx.arc(36,38,4,0,Math.PI*2);
  ctx.fillStyle='#f2e2b8';ctx.fill();
  const time=ms*.001;
  const waveTime=prefersStill?0:time;
  for(let x=0;x<W;x+=stripWidth){
   let a=x/W;
   let wav=Math.sin(a*13.1-waveTime*2.8)+.33*Math.sin(a*23.5-waveTime*3.5);
   let depth=Math.sin(a*13.1-waveTime*2.8-0.2);
   let dy=offsetY+wav*(5+11*a);
   let sy=H*(1+0.018*wav*a);
   let dstX=offsetX+x+5*a*Math.sin(waveTime*2.6+ a*8);
   ctx.drawImage(flag,x,0,stripWidth,H,dstX,dy,stripWidth+1,sy);
   const shade=.20*(-depth)+.035*Math.cos(a*35-waveTime*2.8);
   if(shade>0){
    ctx.fillStyle='rgba(0,0,0,'+Math.min(.30,shade).toFixed(3)+')';
   }else{
    ctx.fillStyle='rgba(255,255,255,'+Math.min(.18,-shade*.6).toFixed(3)+')';
   }
   ctx.fillRect(dstX,dy,stripWidth+1,sy);
  }
  const fade=ctx.createLinearGradient(offsetX,0,offsetX+W,0);
  fade.addColorStop(0,'rgba(0,0,0,.035)');
  fade.addColorStop(.4,'rgba(0,0,0,0)');
  fade.addColorStop(1,'rgba(0,0,0,.10)');
  ctx.fillStyle=fade;ctx.fillRect(offsetX,offsetY-30,W,H+65);
 }
 function animate(ts){
  if(!visible||document.hidden)return;
  if(ts-last>34){render(ts);last=ts}
  raf=requestAnimationFrame(animate);
 }
 render(0);
 if(!prefersStill){
  const io=new IntersectionObserver(entries=>{
   const now=entries[0]?.isIntersecting??false;
   if(visible!==now){
    visible=now;
    if(visible){last=0;raf=requestAnimationFrame(animate)}
    else cancelAnimationFrame(raf);
   }
  },{threshold:.02});
  io.observe(canvas);
  document.addEventListener('visibilitychange',()=>{
   if(!document.hidden&&visible)raf=requestAnimationFrame(animate);
   else cancelAnimationFrame(raf);
  });
  raf=requestAnimationFrame(animate);
 }
})();
