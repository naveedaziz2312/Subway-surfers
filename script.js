const track=document.getElementById('track'), scoreEl=document.getElementById('score'), levelEl=document.getElementById('level');
const gameOverScreen=document.getElementById('gameOver'), pauseMenu=document.getElementById('pauseMenu');
let lane=1,score=0,level=1,speed=2.2,isOver=false,isPaused=false,isJumping=false;
let high=localStorage.getItem('heroBest')||0;
const lanes=['10%','40%','70%'];
const player=document.createElement('div'); player.id='player'; player.innerText='🏃'; player.style.left=lanes[1]; track.appendChild(player);
function move(d){if(isOver||isPaused)return; if(d==='left'&&lane>0)lane--; if(d==='right'&&lane<2)lane++; if(d==='up'&&!isJumping){isJumping=true;player.classList.add('jump');setTimeout(()=>{player.classList.remove('jump');isJumping=false},450);return;} player.style.left=lanes[lane];}
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')move('left');if(e.key==='ArrowRight')move('right');if(e.key==='ArrowUp'||e.code==='Space')move('up')});
let sx=0; track.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:false});
track.addEventListener('touchend',e=>{let ex=e.changedTouches[0].clientX; if(ex-sx>35)move('right'); else if(sx-ex>35)move('left'); else if(Math.abs(ex-sx)<20)move('up');},{passive:false});
function spawnObs(){if(isOver||isPaused)return; let l=Math.floor(Math.random()*3); let el=document.createElement('div'); el.className='obstacle '+(Math.random()>0.5?'train':'barrier'); el.innerText=Math.random()>0.5?'🚂':'🚧'; el.style.left=lanes[l]; el.style.top='-18%'; el.dataset.lane=l; track.appendChild(el); let y=-18; let iv=setInterval(()=>{if(isPaused)return; if(isOver){clearInterval(iv);el.remove();return;} y+=speed; el.style.top=y+'%'; if(y>70&&y<86&&parseInt(el.dataset.lane)===lane&&!isJumping){endGame();} if(y>102){clearInterval(iv);el.remove();}},16);}
function spawnCoin(){if(isOver||isPaused)return; let l=Math.floor(Math.random()*3); let c=document.createElement('div'); c.className='coin'; c.innerText='💰'; c.style.left=(parseFloat(lanes[l])+4)+'%'; c.style.top='-10%'; c.dataset.lane=l; track.appendChild(c); let y=-10; let iv=setInterval(()=>{if(isPaused)return; if(isOver){clearInterval(iv);c.remove();return;} y+=speed*0.95; c.style.top=y+'%'; if(y>72&&y<86&&parseInt(c.dataset.lane)===lane){score+=10;upd();c.remove();clearInterval(iv);} if(y>102){clearInterval(iv);c.remove();}},16);}
function upd(){scoreEl.innerText='💰 '+score; level=Math.floor(score/80)+1; levelEl.innerText='Lvl '+level; document.getElementById('levelInfo').innerText=level; speed=2.2+level*0.5;}
function endGame(){isOver=true; if(score>high){high=score;localStorage.setItem('heroBest',high);} document.getElementById('finalScore').innerText='Score: '+score; document.getElementById('highScore').innerText='Best: '+high; gameOverScreen.style.display='flex';}
function shareGame(){const url='https://naveedaziz2312.github.io/Subway-surfers/'; const txt=`🏃 Mera Game Khelo! Subway Hero - Maine ${score} Score Banaya! ${url}`; if(navigator.share){navigator.share({title:'Subway Hero',text:txt,url})} else {navigator.clipboard.writeText(txt); alert('Link Copy Ho Gaya Hero! Ab WhatsApp par Paste karke dosto ko bhejo!\n\n'+url);} }
document.getElementById('restartBtn').onclick=()=>location.reload();
document.getElementById('restartBtn2').onclick=()=>location.reload();
document.getElementById('pauseBtn').onclick=()=>{isPaused=true; pauseMenu.style.display='flex';};
document.getElementById('resumeBtn').onclick=()=>{isPaused=false; pauseMenu.style.display='none';};
document.getElementById('shareBtn').onclick=shareGame;
document.getElementById('shareBtn2').onclick=shareGame;
document.getElementById('soundToggle').onclick=function(){this.innerText=this.innerText==='ON'?'OFF':'ON';};
setInterval(spawnObs,800); setInterval(spawnCoin,1100);
setInterval(()=>{if(!isOver&&!isPaused){score+=1; upd();}},180);
upd();
