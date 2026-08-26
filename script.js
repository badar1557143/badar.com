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

const scrollMouse=$('#scrollMouse');
addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  $('.progress').style.width=(scrollY/max*100)+'%';
  if(scrollY>80)scrollMouse.classList.add('hide');else scrollMouse.classList.remove('hide');
});

const savedTheme=localStorage.getItem('badar-theme');
if(savedTheme==='dark'||(!savedTheme&&matchMedia('(prefers-color-scheme: dark)').matches)){
  document.body.classList.add('dark');
}
$('#themeToggle').onclick=()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('badar-theme',document.body.classList.contains('dark')?'dark':'light');
};

const menuToggle=$('#menuToggle'), mobileMenu=$('#mobileMenu');
function openMenu(){
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded','true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeMenu(){
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded','false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
menuToggle.onclick=()=>menuToggle.classList.contains('active')?closeMenu():openMenu();
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(e.key==='Escape'&&menuToggle.classList.contains('active'))closeMenu()});

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
    intro:'A premium cotton t-shirt storefront built for a Pakistan-based streetwear brand, pairing GOTS-certified fabric with a clean, editorial shopping experience and WhatsApp-based checkout.',
    details:[['Role','UI/UX · Front-end'],['Focus','Conversion · Responsive UI'],['Stack','HTML · CSS · JavaScript'],['Catalog','New arrivals, bestsellers & size-guided product pages'],['Checkout','Cart → WhatsApp order confirmation flow'],['Live site','savigstyle.com']],
    link:'http://savigstyle.com/',
    image:'images/savigstyle-products.jpg'
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

const modalEl=$('#projectModal');
let lastFocused=null;
function getFocusable(container){return [...container.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')]}
function openProjectModal(card){
  const p=projects[card.dataset.project];
  $('#modalKicker').textContent=p.kicker;
  $('#modalTitle').textContent=p.title;
  $('#modalIntro').textContent=p.intro;
  $('#modalDetails').innerHTML=p.details.map(d=>`<div><b>${d[0]}</b><p>${d[1]}</p></div>`).join('');
  const modalLink=$('#modalLink');
  if(p.link){modalLink.href=p.link;modalLink.style.display='inline-flex'}else{modalLink.style.display='none'}
  const modalImage=$('#modalImage');
  if(p.image){modalImage.src=p.image;modalImage.alt=p.title+' preview';modalImage.style.display='block'}else{modalImage.style.display='none'}
  lastFocused=document.activeElement;
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  setTimeout(()=>$('#modalClose').focus(),120);
}
$$('.project-card').forEach(card=>{
  card.setAttribute('tabindex','0');
  card.setAttribute('role','button');
  card.setAttribute('aria-haspopup','dialog');
  card.addEventListener('click',()=>openProjectModal(card));
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();openProjectModal(card)}
  });
});
function closeModal(){
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  if(lastFocused)lastFocused.focus();
}
$('#modalClose').onclick=closeModal;
modalEl.addEventListener('click',e=>{if(e.target.id==='projectModal')closeModal()});
addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modalEl.classList.contains('open'))closeModal();
  if(e.key==='Tab'&&modalEl.classList.contains('open')){
    const focusables=getFocusable(modalEl);
    if(focusables.length){e.preventDefault();focusables[0].focus()}
  }
});
