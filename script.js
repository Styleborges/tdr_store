// LOGIN FUNCIONAL
const users = [
  { username:"admin", password:"1234" },
  { username:"teste", password:"abcd" }
];

document.getElementById('loginBtn').addEventListener('click', ()=>{
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('loginMessage');

  const user = users.find(u=>u.username===username && u.password===password);

  if(user){
    message.style.color="#80ff80";
    message.innerText=`Bem-vindo, ${username}!`;
    setTimeout(()=>{window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'})},500);
  }else{
    message.style.color="#ff8080";
    message.innerText="Usuário ou senha incorretos!";
  }
});

// CONTADOR FUNCIONAL DE VISITANTES
let counter = localStorage.getItem('visitorCounter') ? parseInt(localStorage.getItem('visitorCounter')) : 0;

function updateCounter(){
  counter += 1;
  document.getElementById('visitorCounter').innerText = counter;
  localStorage.setItem('visitorCounter', counter);
}
updateCounter();

// CANVAS PARTICULAS DINÂMICAS
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 120;

for(let i=0;i<particleCount;i++){
  particles.push({
    x:Math.random()*width,
    y:Math.random()*height,
    size:Math.random()*3 + 1,
    speedX:(Math.random()-0.5)*1.5,
    speedY:(Math.random()-0.5)*1.5,
    color:`rgba(255,215,0,${Math.random()})`
  });
}

function animate(){
  ctx.clearRect(0,0,width,height);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle=p.color;
    ctx.fill();

    p.x+=p.speedX;
    p.y+=p.speedY;

    if(p.x<0||p.x>width)p.speedX*=-1;
    if(p.y<0||p.y>height)p.speedY*=-1;
  });
  requestAnimationFrame(animate);
}

animate();
