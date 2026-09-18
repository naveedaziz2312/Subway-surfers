const track = document.getElementById('track');
const scoreEl = document.getElementById('score');
let lane = 1;
let score = 0;
let isOver = false;

const lanes = ['9%', '39%', '69%'];

// Player
const player = document.createElement('div');
player.id = 'player';
player.innerText = '😎';
player.style.left = lanes[1];
track.appendChild(player);

function move(d) {
  if(isOver) return;
  if(d==='left' && lane>0) lane--;
  if(d==='right' && lane<2) lane++;
  player.style.left = lanes[lane];
}

document.addEventListener('keydown', e=>{
  if(e.key==='ArrowLeft') move('left');
  if(e.key==='ArrowRight') move('right');
});

let sx=0;
track.addEventListener('touchstart', e=> sx=e.touches[0].clientX);
track.addEventListener('touchend', e=>{
  let ex=e.changedTouches[0].clientX;
  if(ex-sx>40) move('right');
  else if(sx-ex>40) move('left');
});

function spawn(){
  if(isOver) return;
  let l = Math.floor(Math.random()*3);
  let obs = document.createElement('div');
  obs.className='obstacle';
  obs.innerText='🚂';
  obs.style.left=lanes[l];
  obs.style.top='-15%';
  obs.dataset.lane=l;
  track.appendChild(obs);
  let y=-15;
  let iv=setInterval(()=>{
    if(isOver){ clearInterval(iv); obs.remove(); return; }
    y+=1.8;
    obs.style.top=y+'%';
    if(y>75 && y<88 && parseInt(obs.dataset.lane)===lane){
      isOver=true;
      alert('GAME OVER Hero! Score: '+score);
      location.reload();
    }
    if(y>100){
      clearInterval(iv);
      obs.remove();
      score+=10;
      scoreEl.innerText='Score: '+score;
    }
  },20);
}
setInterval(spawn, 1100);
