(function(){
  'use strict';
  var d=document,root=d.documentElement;
  root.classList.remove('no-js');
  var tg=d.querySelector('.nav-toggle'),menu=d.getElementById('menu'),scrim=d.querySelector('.scrim');
  function setMenu(o){menu.classList.toggle('open',o);scrim.classList.toggle('open',o);menu.setAttribute('aria-hidden',o?'false':'true');tg.setAttribute('aria-expanded',o?'true':'false');root.classList.toggle('menu-open',o);if(o){var x=menu.querySelector('.drawer-x');x&&x.focus();}else if(d.activeElement&&menu.contains(d.activeElement)){tg.focus();}}
  function closeNav(){setMenu(false);}
  tg.addEventListener('click',function(){setMenu(!menu.classList.contains('open'));});
  d.addEventListener('click',function(e){if(e.target.closest('[data-menu-close]')||(menu.classList.contains('open')&&e.target.closest('#menu a')))setMenu(false);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))setMenu(false);});
  function openModal(id){var m=d.getElementById(id);if(!m)return;
    if(typeof m.showModal==='function')m.showModal();else m.setAttribute('open','');
    root.classList.add('modal-open');}
  d.addEventListener('click',function(e){
    var op=e.target.closest('[data-open]');
    if(op){e.preventDefault();openModal(op.getAttribute('data-open'));return;}
    var cl=e.target.closest('[data-close]');
    if(cl){cl.closest('dialog').close();return;}
    if(e.target.tagName==='DIALOG')e.target.close();
  });
  d.querySelectorAll('dialog').forEach(function(m){
    m.addEventListener('close',function(){
      if(!d.querySelector('dialog[open]'))root.classList.remove('modal-open');
    });
  });
})();
