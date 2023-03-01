import{a as e,e as l}from"./scripts.js";import{h as r}from"./htmlTemplateTag-dcfc1724.js";const a=/^#(fullscreen-)?image-(\d{1,4})$/;class t{index;fullscreen}function s(e,l){return`#${l?"fullscreen-":""}image-${e+1}`}function n(e,r,a,t){const n=t?[{media:"(min-width: 500px)",width:2048},{width:1024}]:[{media:"(min-width: 500px)",width:980},{width:490}],c=l(r[a],"",!0,n);c.classList.add("gallery-image"),e.querySelector(".gallery-placeholder").replaceChildren(c);let i=a-1;i<0&&(i=r.length-1);let o=a+1;o>r.length-1&&(o=0),e.querySelector(".gallery-prev").href=s(i,t),e.querySelector(".gallery-next").href=s(o,t);const d=e.querySelector(".gallery-fullscreen-btn");d&&(d.href=s(a,!0));const u=e.querySelector(".lb-close-btn");u&&(u.href=s(a,!1))}function c(l,s){const c=function(e){const l=new t,r=window.location.hash.match(a);return r?(l.index=parseInt(r[2],10)-1,l.fullscreen=void 0!==r[1]):(l.index=0,l.fullscreen=!1),(l.index<0||l.index>e.length-1)&&(l.index=0),l}(s);if(n(l,s,c.index,!1),c.fullscreen){n(function(){let l=document.body.querySelector(":scope > #image-gallery-overlay");return l||(l=e(document.body,"div","image-gallery"),l.id="image-gallery-overlay",l.innerHTML=r`<a class="lb-close-btn">Close</a>
      <div class="lb-content">
        <div class="lb-gallery">
          <div class="gallery-stage">
            <a class="gallery-prev">Previous</a>
            <div class="gallery-placeholder"></div>
            <a class="gallery-next">Next</a>
          </div>
        </div>
      </div>`),l}(),s,c.index,!0),document.body.classList.add("image-gallery-overlay")}else!function(){const e=document.body.querySelector(":scope > #image-gallery-overlay");e&&document.body.removeChild(e)}(),document.body.classList.remove("image-gallery-overlay")}function i(a){const t=Array.from(a.querySelectorAll("picture")).map((e=>e.querySelector("img")?.src)).filter((e=>void 0!==e));if(0===t.length)return;a.innerHTML=r`<div class="gallery-stage">
      <a class="gallery-prev">Previous</a>
      <div class="gallery-placeholder"></div>
      <a class="gallery-next">Next</a>
      <a class="gallery-fullscreen-btn" title="Fullscreen">Fullscreen</a>
    </div>
    <ul class="gallery-thumb-list"></ul>`;const n=a.querySelector(".gallery-thumb-list");t.forEach(((r,a)=>{const t=e(n,"li"),c=e(t,"a","gallery-thumb");c.href=s(a,!1);const i=a<=7;c.append(l(r,"",i,[{width:"100"}]))})),window.addEventListener("hashchange",(()=>c(a,t))),c(a,t)}export{i as default};
//# sourceMappingURL=image-gallery-be1ea384.js.map
