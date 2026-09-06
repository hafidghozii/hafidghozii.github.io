(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  document.body.classList.add('is-loading');

  const start = () => {
    const loader = $('.site-loader');
    const line = $('.loader-line span');
    if (window.gsap) {
      gsap.to(line, {width:'100%', duration:.85, ease:'power2.inOut'});
      gsap.to(loader, {opacity:0, duration:.65, delay:.95, ease:'power2.out', onComplete:()=>{loader.remove();document.body.classList.remove('is-loading'); heroIntro();}});
    } else { loader.remove(); document.body.classList.remove('is-loading'); }
  };

  function smoothScrollTo(el, duration=1150){
    if(!el)return;
    const startY=window.scrollY;
    const targetY=Math.max(0, el.getBoundingClientRect().top + window.scrollY - 18);
    const distance=targetY-startY;
    if(Math.abs(distance)<4){window.scrollTo(0,targetY);return;}
    const t0=performance.now();
    const ease=t=>1-Math.pow(1-t,4);
    function frame(now){
      const p=Math.min(1,(now-t0)/duration);
      window.scrollTo(0,startY+distance*ease(p));
      if(p<1)requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initSmoothScroll(){
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis=null;
    if(window.Lenis && !reduced){
      try{
        lenis=new Lenis({duration:1.2,smoothWheel:true,smoothTouch:false,touchMultiplier:1.05,wheelMultiplier:.9});
        window.__lenis=lenis;
        function raf(t){lenis.raf(t);requestAnimationFrame(raf)}
        requestAnimationFrame(raf);
      }catch(e){lenis=null;}
    }

    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(!id || id==='#')return;
      const el=$(id);
      if(!el)return;
      e.preventDefault();
      closeMenu();
      if(lenis){lenis.scrollTo(el,{offset:-18,duration:1.35,easing:(t)=>1-Math.pow(1-t,4)});}
      else if(reduced){el.scrollIntoView({behavior:'auto',block:'start'});}
      else{smoothScrollTo(el,1200);}
    }));
  }

  function heroIntro(){
    if(!window.gsap)return;
    gsap.from('.hero-title span',{y:80,opacity:0,duration:1.15,stagger:.12,ease:'power4.out'});
    gsap.from('.hero-meta,.hero-bottom',{y:25,opacity:0,duration:.9,stagger:.08,delay:.25,ease:'power3.out'});
  }

  function initGSAP(){
    if(!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.registerPlugin(ScrollTrigger);

    // Existing hero motion — kept and refined.
    gsap.to('.hero-media',{scale:1.12,yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.hero-title',{yPercent:-16,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});

    // Section-level reveal. The class also powers subtle kicker feedback.
    $$('section').forEach(section=>{
      ScrollTrigger.create({trigger:section,start:'top 78%',once:true,onEnter:()=>section.classList.add('is-inview')});
    });
    $$('.reveal-up,.reveal-media').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));

    // More micro reveals without replacing previous animations.
    $$('.practice-head > *, .archive-head > *, .skills-intro > *, .why-content > *, .next-grid > div, .contact-top p, .cv-intro > *, .cv-paper').forEach((el,i)=>{
      gsap.from(el,{opacity:0,y:28,duration:.85,delay:(i%4)*.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
    });
    $$('.day-item').forEach((el,i)=>gsap.from(el,{opacity:0,x:35,duration:.75,delay:(i%2)*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    $$('.skill-list article').forEach((el,i)=>gsap.from(el,{opacity:0,x:-28,duration:.75,delay:i*.06,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));

    gsap.to('.journey-items',{xPercent:-75,ease:'none',scrollTrigger:{trigger:'.journey-track',start:'top top',end:'bottom bottom',scrub:1,pin:false,onUpdate:self=>{const pct=self.progress*100;const bar=$('.journey-line span');if(bar)bar.style.width=Math.max(8,pct)+'%';const items=$$('.journey-item');const active=Math.min(items.length-1,Math.floor(self.progress*items.length));items.forEach((x,i)=>x.classList.toggle('active',i===active));}}});
    const isPhone=window.matchMedia('(max-width:800px)').matches;
    gsap.fromTo('.statement-word',{x:isPhone?-18:-200,opacity:isPhone?1:.88},{x:isPhone?0:80,opacity:1,ease:'none',scrollTrigger:{trigger:'.statement',start:isPhone?'top 88%':'top bottom',end:isPhone?'top 35%':'bottom top',scrub:1}});
    gsap.to('.cinema-stage video',{scale:1.1,ease:'none',scrollTrigger:{trigger:'.cinema-stage',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.from('.route-line span',{scaleX:0,transformOrigin:'left',ease:'none',scrollTrigger:{trigger:'.route',start:'top 75%',end:'top 30%',scrub:1}});
    gsap.from('.principles span',{opacity:0,y:20,stagger:.12,duration:.6,ease:'power2.out',scrollTrigger:{trigger:'.principles',start:'top 80%',once:true}});

    // Cinematic image depth on scroll.
    $$('.media-card img, .media-card video, .zigna-media img, .guest-panel img').forEach(el=>{
      gsap.to(el,{yPercent:4,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1.2}});
    });

    // CV paper gets a very slight editorial float.
    gsap.fromTo('.cv-paper',{y:35,rotate:2.2},{y:-8,rotate:1.2,ease:'none',scrollTrigger:{trigger:'.cv-paper',start:'top bottom',end:'bottom top',scrub:1.2}});

    // Refresh after fonts/media dimensions settle.
    setTimeout(()=>ScrollTrigger.refresh(),500);
  }

  function initCursor(){
    if(window.matchMedia('(pointer:coarse)').matches)return;
    const cursor=$('.cursor'); if(!cursor)return;
    let x=window.innerWidth/2,y=window.innerHeight/2,tx=x,ty=y;
    window.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
    function move(){x+=(tx-x)*.18;y+=(ty-y)*.18;cursor.style.left=x+'px';cursor.style.top=y+'px';requestAnimationFrame(move)} move();
    $$('a,button,.media-card,.desk-sticky').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('is-hover'));el.addEventListener('mouseleave',()=>cursor.classList.remove('is-hover'))});
  }

  const menu=$('.mobile-menu'),toggle=$('.menu-toggle');
  function closeMenu(){
    if(!menu)return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden','true');
    toggle?.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
  }
  function openMenu(){
    if(!menu)return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden','false');
    toggle?.setAttribute('aria-expanded','true');
    document.body.classList.add('menu-open');
  }
  toggle?.addEventListener('click',(e)=>{
    e.preventDefault();
    e.stopPropagation();
    menu?.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  $$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

  function initDesk(){
    const scene=$('.desk-sticky'); if(!scene)return;
    scene.addEventListener('click',()=>scene.classList.toggle('is-tapped'));
    scene.addEventListener('mouseenter',()=>$('.desk-media video')?.play().catch(()=>{}));
  }

  function initVideos(){
    $$('video').forEach(v=>{v.setAttribute('playsinline','');v.muted=true;v.addEventListener('error',()=>{v.style.opacity='.25'});});
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const v=e.target;if(v.dataset.autoplay==='false')return;v.play().catch(()=>{});}else{const v=e.target;if(v.closest('.hero'))return;v.pause();}}),{threshold:.15});
    $$('video').forEach(v=>observer.observe(v));
  }

  function initProgress(){
    const bar=$('.scroll-progress span');
    window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;bar.style.height=(window.scrollY/max*100)+'%';},{passive:true});
  }

  function initNavigation(){
    const nav=$('.nav');
    const links=$$('.desktop-nav a');
    const sections=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);
    const update=()=>{
      nav?.classList.toggle('is-scrolled',window.scrollY>40);
      let current='';
      sections.forEach(sec=>{if(window.scrollY >= sec.offsetTop - window.innerHeight*.34) current=sec.id;});
      links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+current));
    };
    window.addEventListener('scroll',update,{passive:true}); update();
  }

  function initContactForm(){
    const form=$('.contact-form');
    if(!form)return;
    form.addEventListener('submit',()=>{
      const button=$('.form-submit',form);
      if(button){button.dataset.original=button.innerHTML;button.innerHTML='SENDING … <span>↗</span>';button.disabled=true;}
    });
  }

  function initMagnetic(){
    if(window.matchMedia('(pointer:coarse)').matches)return;
    $$('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-(r.left+r.width/2))*.12;
        const y=(e.clientY-(r.top+r.height/2))*.12;
        el.style.transform=`translate(${x}px,${y}px)`;
      });
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
  }

  window.addEventListener('load',()=>{start();setTimeout(()=>{initSmoothScroll();initGSAP();initCursor();initDesk();initVideos();initProgress();initNavigation();initMagnetic();initContactForm()},50)});
})();
