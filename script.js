const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

let pct=0;
const loadTimer=setInterval(()=>{
  pct=Math.min(100,pct+Math.floor(Math.random()*12)+4);
  $('#loadPct').textContent=pct;
  $('.loader-line i').style.width=pct+'%';
  if(pct>=100){clearInterval(loadTimer);setTimeout(()=>$('#loader').classList.add('done'),350)}
},80);

const dot=$('.cursor-dot'), ring=$('.cursor-ring');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function cursorLoop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(cursorLoop)})();

$$('a,.magnetic,.project-card,.theme-toggle').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='54px';ring.style.height='54px'});
  el.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px'});
});

$$('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})
},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  $('.progress').style.width=(scrollY/max*100)+'%';
});

$('#themeToggle').onclick=()=>document.body.classList.toggle('dark');

$$('.tilt').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${y*-5}deg) rotateY(${x*5}deg)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

const projects={
  savig:{
    kicker:'E-COMMERCE · UI/UX · FRONT-END',
    title:'SavigStyle',
    intro:'A premium cotton essentials storefront designed to make product discovery feel simple, confident and editorial.',
    details:[['Role','UI/UX · Front-end'],['Focus','Conversion · Responsive UI'],['Stack','HTML · CSS · JavaScript']]
  },
  finance:{
    kicker:'PRODUCT · DASHBOARD',
    title:'Finora',
    intro:'A finance dashboard concept that turns dense financial information into a calm, scannable daily overview.',
    details:[['Role','Product Design'],['Focus','Information Architecture'],['Stack','Figma · Prototyping']]
  },
  mobile:{
    kicker:'MOBILE · PRODUCT',
    title:'Focusly',
    intro:'A focused productivity app concept built around deep-work sessions, simple progress feedback and low cognitive load.',
    details:[['Role','UI/UX Design'],['Focus','Mobile Experience'],['Stack','Figma · Design System']]
  },
  studio:{
    kicker:'BRAND · CREATIVE WEB',
    title:'Forma Studio',
    intro:'A visual identity and creative web direction for a modern design studio that wanted its website to behave like an interactive brand piece.',
    details:[['Role','Creative Direction'],['Focus','Brand · Motion'],['Stack','HTML · CSS · JavaScript']]
  }
};

$$('.project-card').forEach(card=>card.onclick=()=>{
  const p=projects[card.dataset.project];
  $('#modalKicker').textContent=p.kicker;
  $('#modalTitle').textContent=p.title;
  $('#modalIntro').textContent=p.intro;
  $('#modalDetails').innerHTML=p.details.map(d=>`<div><b>${d[0]}</b><p>${d[1]}</p></div>`).join('');
  $('#projectModal').classList.add('open');
  $('#projectModal').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
});
function closeModal(){ $('#projectModal').classList.remove('open');$('#projectModal').setAttribute('aria-hidden','true');document.body.style.overflow='' }
$('#modalClose').onclick=closeModal;
$('#projectModal').addEventListener('click',e=>{if(e.target.id==='projectModal')closeModal()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
