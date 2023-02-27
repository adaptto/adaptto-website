import{h as e}from"./htmlTemplateTag-56ff717c.js";import{a as t}from"./scripts.js";import{a as i}from"./usercentrics-e0f50db0.js";const r=/^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w-]{10,20})/i;function o(o){const c=o.querySelector("a")?.href,s=function(e){const t=e.match(r);if(t)return t[9]}(c);if(s){o.innerHTML="";const r=t(o,"div","placeholder");r.innerHTML=`<button title="Play"></button>${function(t){return e`<picture>
      <source media="(min-width: 799px)" srcset="https://i.ytimg.com/vi_webp/${t}/maxresdefault.webp" type="image/webp">
      <source media="(min-width: 799px)" srcset="https://i.ytimg.com/vi/${t}/maxresdefault.jpg" type="image/jpeg">
      <source srcset="https://i.ytimg.com/vi_webp/${t}/hqdefault.webp" type="image/webp">
      <source srcset="https://i.ytimg.com/vi/${t}/hqdefault.jpg" type="image/jpeg">
      <img src="https://i.ytimg.com/vi/${t}/maxresdefault.jpg" alt="YouTube Video">
    </picture>`}(s)}`,r.addEventListener("click",(()=>{i("youtube",o,(t=>{t.innerHTML=function(t){return e`<iframe src="https://www.youtube.com/embed/${t}?rel=0&muted=1&autoplay=1"
     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
     scrolling="no"
     loading="lazy"></iframe>`}(s)}))}))}}export{o as default};
