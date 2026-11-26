/* One Piece Store - shared layout + catalog logic. Edit SITE below to change contact links. */
var SITE = {
  name: 'One Piece Store',
  whatsapp: 'https://wa.me/201551301299',
  facebook: 'https://www.facebook.com/share/194MGY1kdn/',
  instagram: 'https://www.instagram.com/el__mnse____14__0600?igsh=MW9sNHl4ODd0dG5ldQ==',
  tiktok: 'https://www.tiktok.com/@el_mnse_140600',
  youtube: '' /* ضع رابط قناة يوتيوب هنا */
};
var CATS = {collectibles:'مقتنيات',caps:'كابات',tshirts:'تيشيرتات',mugs:'أكواب'};
var ICON = {collectibles:'🏴‍☠️',caps:'🧢',tshirts:'👕',mugs:'☕'};
var STORES = {noon:'noon',amazon:'Amazon',aliexpress:'AliExpress',jumia:'Jumia'};
var BASE = (document.currentScript && document.currentScript.dataset.base) || '';
function $(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ok(u){return /^https?:\/\//.test(u||'')}
function saved(){try{return JSON.parse(localStorage.getItem('ops_saved')||'[]')}catch(e){return []}}
function setSaved(a){localStorage.setItem('ops_saved',JSON.stringify(a));var c=$('#cartcount');if(c)c.textContent=a.length}
function toggleSave(id){var a=saved(),i=a.indexOf(id);if(i<0)a.push(id);else a.splice(i,1);setSaved(a)}
function layout(active){
  var nav=[['index.html','الرئيسية','home'],['products.html','المنتجات','products'],['cart.html','قائمتي','cart'],['payment.html','طريقة الشراء','pay'],['contact.html','تواصل معنا','contact']];
  var links=nav.map(function(n){return '<a class="'+(n[2]===active?'on':'')+'" href="'+BASE+n[0]+'">'+n[1]+'</a>'}).join('');
  var hdr='<header class="top"><a class="logo" href="'+BASE+'index.html"><img src="'+BASE+'logo.svg" alt=""><h2>'+SITE.name+'</h2></a><nav class="main">'+links+'</nav><div class="hicons"><a class="cartbtn" href="'+BASE+'cart.html" title="قائمتي">♥<b id="cartcount">0</b></a></div></header><nav class="mnav">'+links+'</nav>';
  var soc='<a href="'+SITE.facebook+'" target="_blank" rel="noopener" title="Facebook">f</a><a href="'+SITE.instagram+'" target="_blank" rel="noopener" title="Instagram">IG</a>'+(SITE.tiktok?'<a href="'+SITE.tiktok+'" target="_blank" rel="noopener" title="TikTok">TT</a>':'')+(ok(SITE.youtube)?'<a href="'+SITE.youtube+'" target="_blank" rel="noopener" title="YouTube">YT</a>':'');
  var ft='<footer><div class="fl"><a href="'+BASE+'payment.html">طريقة الشراء والدفع</a><a href="'+BASE+'shipping.html">الشحن والاسترجاع</a><a href="'+BASE+'delivery.html">مدة التوصيل</a><a href="'+BASE+'contact.html">تواصل معنا</a></div><p>© '+new Date().getFullYear()+' '+SITE.name+' - جميع الحقوق محفوظة.</p><small>إفصاح: بعض الروابط روابط إحالة (Affiliate)، وقد نحصل على عمولة عند الشراء من خلالها دون أي تكلفة إضافية عليك. الدفع والشحن يتمان على موقع المتجر الأصلي. الموقع غير تابع للشركات المالكة للعلامات المذكورة.</small></footer>';
  document.body.insertAdjacentHTML('afterbegin',hdr);
  document.body.insertAdjacentHTML('beforeend','<a class="wa" href="'+SITE.whatsapp+'" target="_blank" rel="noopener" title="واتساب">☎</a><div class="social">'+soc+'</div>'+ft);
  setSaved(saved());
}
var CATALOG=null;
function load(){
  if(CATALOG)return Promise.resolve(CATALOG);
  return fetch(BASE+'products.json').then(function(r){return r.json()}).then(function(d){CATALOG=d;return d});
}
function thumb(p){
  var inner=ok(p.image)?'<img loading="lazy" referrerpolicy="no-referrer" src="'+esc(p.image)+'" alt="'+esc(p.name)+'">':'<span>'+(p.emoji||ICON[p.category]||'🛍️')+'</span>';
  return '<div class="thumb">'+(p.badge?'<span class="badge">'+esc(p.badge)+'</span>':'')+inner+'</div>';
}
function buy(p,cls){
  return ok(p.link)?'<a class="btn '+(cls||'')+'" href="'+esc(p.link)+'" target="_blank" rel="sponsored noopener">اشتري من '+esc(STORES[p.store]||'المتجر')+'</a>':'<span class="btn dis">قريباً</span>';
}
function card(p){
  var on=saved().indexOf(p.id)>=0;
  return '<article class="card"><a href="'+BASE+'product.html?id='+p.id+'">'+thumb(p)+'</a><div class="cbody"><span class="tag">'+esc(CATS[p.category]||'')+'</span><h3><a href="'+BASE+'product.html?id='+p.id+'">'+esc(p.name)+'</a></h3><p>'+esc(p.description)+'</p>'+(p.store?'<span class="store">المتجر: '+esc(STORES[p.store]||p.store)+'</span>':'')+'<div class="cact">'+buy(p)+'<button class="btn ghost" data-save="'+p.id+'" title="أضف لقائمتي">'+(on?'♥':'♡')+'</button></div></div></article>';
}
function bindSave(root){
  root.addEventListener('click',function(e){var b=e.target.closest('[data-save]');if(!b)return;toggleSave(+b.dataset.save);b.textContent=saved().indexOf(+b.dataset.save)>=0?'♥':'♡';if(root.dataset.onsave)window[root.dataset.onsave]()});
}
/* paging for big catalogs */
var PAGE=24;
function renderGrid(list,el,empty,more){
  var shown=0;
  function next(){el.insertAdjacentHTML('beforeend',list.slice(shown,shown+PAGE).map(card).join(''));shown=Math.min(list.length,shown+PAGE);if(more)more.hidden=shown>=list.length}
  el.innerHTML='';if(empty)empty.hidden=list.length>0;
  next();if(more)more.onclick=next;
}
