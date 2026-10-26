/* FX engine — one rAF loop turns scroll position into CSS progress variables (0..1).
   Modes (same maths as the reference site): enter · exit · draw · sticky */
(function(){
  'use strict';
  var d=document,w=window,rm=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||d).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))};
  var clamp=function(v){return v<0?0:v>1?1:v};
  function el(tag,cls,html){var e=d.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e}

  /* ---------- inject decorative layers ---------- */
  var hero=$('.hero');
  if(hero){
    var sky=el('div','hero-sky','<span class="a"></span><span class="b"></span><span class="c"></span>');sky.setAttribute('aria-hidden','true');
    hero.insertBefore(sky,hero.firstChild);
    ['','m2','m3'].forEach(function(c){var m=el('span','mote '+c);m.setAttribute('aria-hidden','true');hero.appendChild(m)});
    var ph=$('.hero-photo',hero);if(ph)ph.appendChild(el('span','hero-sweep'));
    hero.setAttribute('data-fx','exit');hero.setAttribute('data-fx-var','--hero-p');
  }
  $$('.marquee-set').forEach(function(s){
    var r=el('div','sigil-rule','<i></i>');r.setAttribute('aria-hidden','true');s.insertBefore(r,s.firstChild);
    r.setAttribute('data-fx','draw');r.setAttribute('data-fx-var','--rule-p');r.setAttribute('data-fx-anchor','.9');
  });
  $$('.marquee').forEach(function(m){m.setAttribute('data-fx','enter');m.setAttribute('data-fx-var','--corrente-p')});
  var art=$('.alch-fig');if(art){art.appendChild(el('span','art-wash'));art.setAttribute('data-fx','draw');art.setAttribute('data-fx-var','--alchemy-p');art.setAttribute('data-fx-anchor','.78')}
  var comp=$('.compiac');if(comp){comp.setAttribute('data-fx','enter');comp.setAttribute('data-fx-var','--contract-p')}
  var cap=$('.capacita');if(cap){cap.setAttribute('data-fx','draw');cap.setAttribute('data-fx-var','--watt-p');cap.setAttribute('data-fx-anchor','1')}


  /* filo: every section carries its own thread (rail · lit walk · bead · ring node) */
  (function(){
    var map=[['.hero','oro','origin'],['.piombo','piombo','head'],['.manifesto','transmute','none'],['.elementi-head','oro','head'],['.elements','oro','none'],
      ['.ecosistema','oro','head'],['.app','oro','head'],['.posa','oro','head'],['.capacita','oro','head'],['.guida','oro','head'],['.corpo','oro','head'],
      ['.testi','oro','head'],['.accesso','oro','head'],['.faq','oro','head'],['.contatti','oro','head']];
    function mk(host,walk,node,gap){
      var f=el('div','filo','<span class="rail"></span><span class="walk"></span><span class="carrier"><span class="bead"></span></span>'+(node!=='none'?'<span class="node"></span>':''));
      f.setAttribute('aria-hidden','true');f.setAttribute('data-walk',walk);f.setAttribute('data-node',node);
      f.setAttribute('data-fx','draw');f.setAttribute('data-fx-var','--filo-p');f.setAttribute('data-fx-size','--filo-h');
      host.classList.add('has-filo');host.insertBefore(f,host.firstChild);
    }
    map.forEach(function(m){var h=$(m[0]);if(h)mk(h,m[1],m[2])});
    $$('.marquee-set').forEach(function(s){mk(s,s.classList.contains('on-cream')?'piombo':'oro','none')});
  })();

  /* elements: stage + runway + spine */
  var els=$$('section.el');
  if(els.length){
    var runway=el('div','elements');els[0].parentNode.insertBefore(runway,els[0]);
    var spine=el('div','el-spine','<ol><li></li><li></li><li></li><li></li></ol>');spine.setAttribute('aria-hidden','true');
    runway.appendChild(spine);
    els.forEach(function(s){
      runway.appendChild(s);
      var inn=$('.el-in',s);inn.classList.remove('reveal');
      var st=el('div','el-stage');s.insertBefore(st,inn);st.appendChild(inn);
      Array.prototype.forEach.call(inn.children,function(c,i){c.style.setProperty('--i',i)});
      s.setAttribute('data-fx','sticky');s.setAttribute('data-fx-var','--el-p');
    });
    runway.setAttribute('data-fx','sticky');runway.setAttribute('data-fx-var','--spine-p');
  }

  /* ---------- progress engine ---------- */
  var items=[],vh=w.innerHeight,ticking=false;
  function collect(){
    items=$$('[data-fx]').map(function(e){return {e:e,mode:e.getAttribute('data-fx'),v:e.getAttribute('data-fx-var'),
      a:parseFloat(e.getAttribute('data-fx-anchor')||'.78'),size:e.getAttribute('data-fx-size'),top:0,h:0,last:''}});
  }
  function measure(){
    vh=w.innerHeight;
    items.forEach(function(it){var r=it.e.getBoundingClientRect();it.top=r.top+w.scrollY;it.h=r.height;
      if(it.size){it.e.style.setProperty(it.size,String(Math.round(it.h)));if(it.e.getAttribute('data-node')==='head')it.e.style.setProperty('--filo-at',(56/Math.max(it.h,1)).toFixed(4))}});
  }
  function calc(it,y){
    var F=it.top-y,h=it.h||1,p;
    switch(it.mode){
      case'exit':p=-F/h;break;
      case'sticky':var sp=h-vh;p=sp>vh*.25?-F/sp:(vh-F)/(vh+h);break;
      case'draw':p=(vh*it.a-F)/h;break;
      default:p=(vh-F)/(vh+h)}
    return clamp(p);
  }
  var wattEl=cap&&$('.watt .display',cap),spineLis=spine&&$$('li',spine);
  function update(){
    ticking=false;var y=w.scrollY;page();
    items.forEach(function(it){
      var p=rm?1:calc(it,y);if(rm&&it.mode==='exit')p=0;
      var s=p.toFixed(4);if(s===it.last)return;it.last=s;
      it.e.style.setProperty(it.v,s);
      if(it.v==='--el-p')it.e.classList.toggle('is-active',rm||p>=.32);
      if(it.v==='--spine-p'&&spineLis){var n=p*4;spineLis.forEach(function(li,i){li.classList.toggle('on',n>=i+.15)})}
      if(it.v==='--watt-p'&&wattEl){wattEl.textContent=(Math.round((100+p*300)/10)*10)+' W'}
    });
  }
  function page(){var m=d.documentElement.scrollHeight-w.innerHeight;d.documentElement.style.setProperty('--page-p',(m>0?clamp(w.scrollY/m):0).toFixed(4))}
  function req(){if(!ticking){ticking=true;w.requestAnimationFrame(update)}}

  /* "armed" = element was off-screen on arrival, so its entrance can play */
  if('IntersectionObserver' in w&&!rm){
    var seen=new WeakSet(),io=new IntersectionObserver(function(es){
      es.forEach(function(en){var first=!seen.has(en.target);seen.add(en.target);
        if(!en.isIntersecting&&first)en.target.classList.add('is-armed');
        if(en.isIntersecting)io.unobserve(en.target)});
    },{threshold:.12});
    els.forEach(function(s){io.observe(s)});
  }

  collect();measure();update();
  w.addEventListener('scroll',req,{passive:true});
  w.addEventListener('resize',function(){measure();req()},{passive:true});
  w.addEventListener('load',function(){measure();update()});
  if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){measure();update()});
  setTimeout(function(){measure();update()},600);
})();
