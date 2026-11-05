(() => {
  'use strict';
  const canvas = document.querySelector('#game');
  const ctx = canvas.getContext('2d');
  const el = id => document.getElementById(id);
  const ui = { score: el('score'), best: el('best'), deploys: el('deploys'), level: el('level'), overlay: el('overlay'), panelTitle: el('panelTitle'), panelDesc: el('panelDesc'), panelControls: el('panelControls'), panelResults: el('panelResults'), primaryBtn: el('primaryBtn'), panelHint: el('panelHint'), pauseBtn: el('pauseBtn'), soundBtn: el('soundBtn'), jumpBtn: el('jumpBtn'), message: el('message') };
  const W = 960, H = 420, GROUND = 338;
  const palette = { pink:'#ff2d95', cyan:'#00f5ff', purple:'#8b5cf6', yellow:'#ffe580', green:'#53ffa9', red:'#ff546d' };
  const rand = (a,b) => a + Math.random()*(b-a);
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const boxHit = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  const pad = n => String(Math.floor(n)).padStart(6,'0');
  const sprite = new Image(); sprite.src = './roxsfest.png';
  let spriteReady = false; sprite.onload = () => spriteReady = true;
  sprite.onerror = () => console.warn('No se pudo cargar roxsfest.png: comprobá que esté junto a index.html');

  class AudioManager {
    constructor(){this.enabled=false;this.context=null;}
    toggle(){this.enabled=!this.enabled;ui.soundBtn.textContent=this.enabled?'🔊':'🔇';ui.soundBtn.setAttribute('aria-label',this.enabled?'Desactivar sonido':'Activar sonido');if(this.enabled)this.init();}
    init(){if(!this.context){const AC=window.AudioContext||window.webkitAudioContext;if(AC)this.context=new AC();}if(this.context?.state==='suspended')this.context.resume().catch(()=>{});}
    play(type){if(!this.enabled)return;this.init();const a=this.context;if(!a)return;const patterns={start:[[440,0,.07],[660,.09,.09]],jump:[[390,0,.1],[540,.07,.10]],collect:[[700,0,.06],[920,.07,.09]],hit:[[220,0,.1],[110,.11,.20]],onfire:[[520,0,.08],[680,.09,.08],[850,.18,.14]],record:[[650,0,.08],[800,.1,.08],[1020,.21,.18]]};for(const [frequency,delay,duration] of patterns[type]||[]){const start=a.currentTime+delay;const o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.setValueAtTime(frequency,start);g.gain.setValueAtTime(.055,start);g.gain.exponentialRampToValueAtTime(.001,start+duration);o.connect(g);g.connect(a.destination);o.start(start);o.stop(start+duration+.02);}}
  }
  const audio = new AudioManager();

  class Particle {
    constructor(x,y,color,vx,vy,life=0.5,size=5){Object.assign(this,{x,y,color,vx,vy,life,maxLife:life,size});}
    update(dt){this.x+=this.vx*dt;this.y+=this.vy*dt;this.vy+=180*dt;this.life-=dt;}
    draw(){ctx.globalAlpha=clamp(this.life/this.maxLife,0,1);ctx.fillStyle=this.color;ctx.fillRect(Math.round(this.x),Math.round(this.y),this.size,this.size);ctx.globalAlpha=1;}
  }
  class Player {
    constructor(){this.x=120;this.w=84;this.h=108;this.y=GROUND-this.h;this.vy=0;this.onGround=true;this.anim=0;}
    jump(){if(!this.onGround)return false;this.vy=-690;this.onGround=false;game.burst(this.x+this.w/2,GROUND,palette.cyan,8);audio.play('jump');return true;}
    update(dt){this.anim+=dt;this.vy+=1900*dt;this.y+=this.vy*dt;if(this.y+this.h>=GROUND){if(!this.onGround){game.burst(this.x+this.w/2,GROUND,palette.pink,9);}this.y=GROUND-this.h;this.vy=0;this.onGround=true;}if(this.onGround&&Math.random()<dt*15)game.particles.push(new Particle(this.x+5,GROUND-6,'#8b5cf6',rand(-95,-25),rand(-60,-10),.28,4));}
    get hitbox(){return{x:this.x+22,y:this.y+12,w:this.w-39,h:this.h-21};}
    draw(){const bob=this.onGround?Math.sin(this.anim*23)*2:0;ctx.save();ctx.translate(Math.round(this.x+this.w/2),Math.round(this.y+this.h/2+bob));if(!this.onGround)ctx.rotate(clamp(this.vy/5000,-.10,.10));ctx.fillStyle='#08071266';ctx.beginPath();ctx.ellipse(0,GROUND-(this.y+this.h/2)-1,36,7,0,0,Math.PI*2);ctx.fill();if(spriteReady)ctx.drawImage(sprite,-this.w/2-14,-this.h/2-15,this.w+28,this.h+28);else{ctx.fillStyle=palette.pink;ctx.fillRect(-25,-52,50,95);ctx.fillStyle='#fff';ctx.fillText('ROXS',-21,-5);}ctx.restore();}
  }
  const obstacleTypes=[{name:'BUG',color:palette.red,w:41,h:39},{name:'500',color:'#ff5c5c',w:50,h:54},{name:'CI FAIL',color:palette.purple,w:73,h:43},{name:'BOX',color:'#ffa75c',w:47,h:57},{name:'ALERT',color:'#ffdf62',w:54,h:49}];
  class Obstacle {
    constructor(){this.type=obstacleTypes[Math.floor(Math.random()*obstacleTypes.length)];this.w=this.type.w;this.h=this.type.h;this.x=W+20;this.y=GROUND-this.h;this.passed=false;}
    update(dt,speed){this.x-=speed*dt;}
    get hitbox(){return{x:this.x+5,y:this.y+5,w:this.w-10,h:this.h-7};}
    draw(){let{x,y,w,h,type:t}=this;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.fillStyle='#0b0a17';ctx.fillRect(4,5,w,h);ctx.fillStyle=t.color;ctx.fillRect(0,0,w-4,h-5);ctx.fillStyle='#191328';ctx.font='bold 15px monospace';ctx.textAlign='center';if(t.name==='BUG'){ctx.fillStyle='#200d20';ctx.fillRect(10,10,23,19);ctx.fillStyle='#fff';ctx.fillRect(15,15,4,4);ctx.fillRect(24,15,4,4);ctx.fillStyle=t.color;ctx.fillRect(2,4,6,5);ctx.fillRect(33,4,6,5);ctx.fillRect(1,29,7,5);ctx.fillRect(34,29,7,5);}else if(t.name==='BOX'){ctx.strokeStyle='#623323';ctx.lineWidth=4;ctx.strokeRect(6,7,31,35);ctx.beginPath();ctx.moveTo(8,8);ctx.lineTo(31,31);ctx.lineTo(19,43);ctx.stroke();ctx.fillStyle='#161122';ctx.font='bold 10px monospace';ctx.fillText('BOX',22,20);}else if(t.name==='ALERT'){ctx.fillStyle='#161122';ctx.beginPath();ctx.moveTo(w/2,9);ctx.lineTo(8,h-9);ctx.lineTo(w-8,h-9);ctx.closePath();ctx.fill();ctx.fillStyle=t.color;ctx.font='bold 23px monospace';ctx.fillText('!',w/2,h-13);}else{ctx.fillText(t.name,w/2,(h/2)+5);if(t.name==='CI FAIL')ctx.font='bold 9px monospace';}ctx.restore();}
  }
  const goodies=[{label:'D',color:'#25b9ef',name:'Docker'},{label:'K8s',color:'#5c9dff',name:'Kubernetes'},{label:'AWS',color:'#ffb743',name:'AWS'},{label:'GIT',color:'#ff765a',name:'Git'},{label:'TF',color:'#ad83ff',name:'Terraform'}];
  class Collectible {
    constructor(){this.type=goodies[Math.floor(Math.random()*goodies.length)];this.x=W+30;this.y=GROUND-rand(115,175);this.w=43;this.h=43;this.t=rand(0,6);}
    update(dt,speed){this.x-=speed*dt;this.t+=dt*5;}
    get hitbox(){return{x:this.x+5,y:this.y+5,w:33,h:33};}
    draw(){const y=this.y+Math.sin(this.t)*4;ctx.save();ctx.translate(Math.round(this.x+21),Math.round(y+21));ctx.fillStyle=this.type.color+'44';ctx.fillRect(-24,-24,48,48);ctx.fillStyle='#0c1226';ctx.fillRect(-20,-20,40,40);ctx.strokeStyle=this.type.color;ctx.lineWidth=3;ctx.strokeRect(-20,-20,40,40);ctx.fillStyle=this.type.color;ctx.font='bold '+(this.type.label.length>2?'12':'19')+'px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.type.label,0,1);ctx.restore();}
  }
  class Background {
    constructor(){this.stars=Array.from({length:55},()=>({x:rand(0,W),y:rand(5,270),s:rand(1,3),z:rand(.15,.5)}));this.t=0;}
    update(dt,speed){this.t+=dt*speed;for(const star of this.stars){star.x-=speed*dt*star.z*.15;if(star.x<-3)star.x=W+3;}}
    draw(){const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#0a0b20');grad.addColorStop(.6,'#201235');grad.addColorStop(1,'#381447');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);ctx.fillStyle='#daccff';for(const s of this.stars){ctx.globalAlpha=.3+s.z;ctx.fillRect(Math.floor(s.x),Math.floor(s.y),s.s,s.s);}ctx.globalAlpha=1;for(let l=0;l<2;l++){const step=l?110:165;const shift=(this.t*(l?.18:.08))%step;for(let i=-1;i<11;i++){const x=i*step-shift;const height=40+(Math.sin(i*3.1+l*9)+1)*35;ctx.fillStyle=l?'#231934':'#1a1931';ctx.fillRect(x,GROUND-height,step-12,height);ctx.fillStyle=l?'#483258':'#353151';for(let r=0;r<4;r++)for(let c=0;c<3;c++)if((i+c+r)%3===0)ctx.fillRect(x+12+c*25,GROUND-height+10+r*16,7,5);}}ctx.fillStyle='#0e1222';ctx.fillRect(0,GROUND,W,H-GROUND);ctx.fillStyle='#ff2d95';ctx.fillRect(0,GROUND,W,4);const lineShift=this.t%55;ctx.fillStyle='#3b2946';for(let x=-55;x<W;x+=55)ctx.fillRect(Math.floor(x-lineShift),GROUND+28,28,4);ctx.strokeStyle='#26213f';ctx.lineWidth=1;for(let y=GROUND+31;y<H;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.fillStyle='#631c65';ctx.fillRect(0,H-4,W,4);}
  }
  class Game {
    constructor(){this.state='MENU';this.best=this.readBest();this.bg=new Background();this.particles=[];this.player=new Player();this.obstacles=[];this.items=[];this.score=0;this.deploys=0;this.distance=0;this.speed=275;this.obstacleTimer=1.35;this.itemTimer=2.2;this.triggered=new Set();this.bannerTime=0;this.last=0;this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);this.updateHUD();}
    readBest(){try{return Number(localStorage.getItem('roxsRunnerBest'))||0;}catch{return 0;}}
    saveBest(){try{localStorage.setItem('roxsRunnerBest',String(Math.floor(this.best)));}catch{}}
    start(){if(this.state==='PLAYING')return;this.player=new Player();this.obstacles=[];this.items=[];this.particles=[];this.score=0;this.deploys=0;this.distance=0;this.speed=275;this.obstacleTimer=1.5;this.itemTimer=2;this.triggered=new Set();this.bannerTime=0;this.state='PLAYING';this.last=performance.now();ui.overlay.classList.add('hidden');ui.message.classList.remove('active');ui.pauseBtn.disabled=false;ui.pauseBtn.textContent='Ⅱ';this.updateHUD();audio.play('start');}
    jump(){if(this.state==='PLAYING')this.player.jump();}
    pause(){if(this.state==='PLAYING'){this.state='PAUSED';ui.pauseBtn.textContent='▶';this.showPanel('⏸ DEPLOY <em>PAUSED</em>','Tu pipeline está en pausa. Volvé cuando quieras.','▶ RESUME',false);}else if(this.state==='PAUSED'){this.state='PLAYING';this.last=performance.now();ui.overlay.classList.add('hidden');ui.pauseBtn.textContent='Ⅱ';}}
    showPanel(title,desc,button,showResults=false){ui.panelTitle.innerHTML=title;ui.panelDesc.textContent=desc;ui.primaryBtn.textContent=button;ui.panelResults.classList.toggle('hidden',!showResults);ui.panelControls.classList.toggle('hidden',showResults||this.state==='PAUSED');ui.panelHint.classList.toggle('hidden',this.state==='PAUSED');ui.overlay.classList.remove('hidden');}
    end(){this.state='GAME_OVER';audio.play('hit');this.burst(this.player.x+40,this.player.y+50,palette.red,28);const record=Math.floor(this.score)>this.best;if(record){this.best=Math.floor(this.score);this.saveBest();setTimeout(()=>audio.play('record'),260);}ui.panelResults.innerHTML=`<span>SCORE: <strong>${pad(this.score)}</strong></span><span>BEST: <strong>${pad(this.best)}</strong></span><span>DEPLOYS COMPLETED: <strong>${this.deploys}</strong></span>${record?'<span class="record">🏆 NEW HIGH SCORE!</span>':''}`;const quotes=['En mi máquina funcionaba.','¿Quién hizo push a main?','Otro viernes en producción.','Rollback y seguimos.','El pipeline tenía otros planes.','¿Probaste reiniciarlo?'];this.showPanel('💥 PIPELINE <em>FAILED!</em>',quotes[Math.floor(rand(0,quotes.length))],'🔄 RETRY DEPLOY',true);ui.pauseBtn.disabled=true;this.updateHUD();}
    burst(x,y,color,n){for(let i=0;i<n;i++)this.particles.push(new Particle(x,y,color,rand(-170,170),rand(-245,15),rand(.25,.7),rand(3,7)));}
    announce(label){ui.message.textContent=label;ui.message.classList.add('active');this.bannerTime=2.1;this.burst(W/2,95,palette.pink,34);audio.play('onfire');}
    updateHUD(){ui.score.textContent=pad(this.score);ui.best.textContent=pad(Math.max(this.best,this.score));ui.deploys.textContent=String(this.deploys).padStart(2,'0');ui.level.textContent=this.score<100?'EASY':this.score<300?'NORMAL':this.score<600?'HARD':this.score<1000?'EXPERT':'ON FIRE';}
    update(dt){this.distance+=this.speed*dt;this.score+=dt*this.speed*.055;this.speed=Math.min(490,275+Math.floor(this.score/100)*13);this.bg.update(dt,this.speed);this.player.update(dt);this.obstacleTimer-=dt;this.itemTimer-=dt;
      if(this.obstacleTimer<=0){this.obstacles.push(new Obstacle());this.obstacleTimer=rand(1.2,1.9)*320/this.speed+0.15;}
      if(this.itemTimer<=0){this.items.push(new Collectible());this.itemTimer=rand(2.2,3.9)*300/this.speed;}
      for(const o of this.obstacles){o.update(dt,this.speed);if(boxHit(this.player.hitbox,o.hitbox)){this.end();return;}}
      for(const item of this.items){item.update(dt,this.speed);if(!item.collected&&boxHit(this.player.hitbox,item.hitbox)){item.collected=true;this.score+=25;this.deploys++;this.burst(item.x+20,item.y+20,item.type.color,16);audio.play('collect');}}
      this.obstacles=this.obstacles.filter(o=>o.x+o.w>-20);this.items=this.items.filter(i=>!i.collected&&i.x+i.w>-20);
      for(const p of this.particles)p.update(dt);this.particles=this.particles.filter(p=>p.life>0);
      for(const [threshold,label] of [[295,'🔥 ON FIRE!'],[500,'🚀 DEPLOY MASTER!'],[1000,'👑 DEVOPS LEGEND!']])if(this.score>=threshold&&!this.triggered.has(threshold)){this.triggered.add(threshold);this.announce(label);}
      if(this.bannerTime>0){this.bannerTime-=dt;if(this.bannerTime<=0)ui.message.classList.remove('active');}
      this.updateHUD();}
    render(){this.bg.draw();for(const item of this.items)item.draw();for(const o of this.obstacles)o.draw();this.player.draw();for(const p of this.particles)p.draw();if(this.state==='GAME_OVER'){ctx.fillStyle='#ff2d9540';ctx.fillRect(0,0,W,H);}}
    frame(time){const dt=clamp((time-(this.last||time))/1000,0,.033);this.last=time;if(this.state==='PLAYING')this.update(dt);else if(this.state==='MENU')this.bg.update(dt,60);ctx.clearRect(0,0,W,H);this.render();requestAnimationFrame(this.frame);}
  }
  const game = new Game();
  ui.primaryBtn.addEventListener('click',()=>game.state==='PAUSED'?game.pause():game.start());
  ui.pauseBtn.addEventListener('click',()=>game.pause());
  ui.soundBtn.addEventListener('click',()=>audio.toggle());
  ui.jumpBtn.addEventListener('pointerdown',e=>{e.preventDefault();game.jump();});
  canvas.addEventListener('pointerdown',e=>{e.preventDefault();game.jump();});
  window.addEventListener('keydown',e=>{if(['Space','ArrowUp','KeyP'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='KeyP')game.pause();else if(e.code==='Space'||e.code==='ArrowUp'){if(game.state==='PLAYING')game.jump();else if(game.state==='MENU')game.start();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='PLAYING')game.pause();});
})();
