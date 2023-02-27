import{h as e}from"./htmlTemplateTag-dcfc1724.js";import{a as t}from"./scripts.js";import{a as i}from"./usercentrics-674c010a.js";const r=/^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w-]{10,20})/i;function c(c){const o=c.querySelector("a")?.href,a=function(e){const t=e.match(r);if(t)return t[9]}(o);if(a){c.innerHTML="";const r=t(c,"div","placeholder");r.innerHTML=`<button title="Play"></button>${function(t){return e`<picture>
      <source media="(min-width: 799px)" srcset="https://i.ytimg.com/vi_webp/${t}/maxresdefault.webp" type="image/webp">
      <source media="(min-width: 799px)" srcset="https://i.ytimg.com/vi/${t}/maxresdefault.jpg" type="image/jpeg">
      <source srcset="https://i.ytimg.com/vi_webp/${t}/hqdefault.webp" type="image/webp">
      <source srcset="https://i.ytimg.com/vi/${t}/hqdefault.jpg" type="image/jpeg">
      <img src="https://i.ytimg.com/vi/${t}/maxresdefault.jpg" alt="YouTube Video">
    </picture>`}(a)}`,r.addEventListener("click",(()=>{i("youtube",c,(t=>{t.innerHTML=function(t){return e`<iframe src="https://www.youtube.com/embed/${t}?rel=0&muted=1&autoplay=1"
     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
     scrolling="no"
     loading="lazy"></iframe>`}(a)}))}))}}export{c as default};
