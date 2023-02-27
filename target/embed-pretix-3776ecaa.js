import{r as t,a as e}from"./scripts.js";import{h as r}from"./htmlTemplateTag-56ff717c.js";import{a as s}from"./usercentrics-e0f50db0.js";function i(i){const a=t(i),n=a["shop-url"],p=a["shop-css-url"],o=a["script-url"];if(n&&p&&o){i.innerHTML="";e(i,"p").innerHTML=r`Direct link to <a href="${n}" target="_blank">adaptTo() Ticket Shop</a>.`;const t=e(i,"div");s("pretix",t,(t=>{const e=document.createElement("script");e.src=o,e.type="text/javascript",e.onload=()=>{t.innerHTML=r`
          <link rel="stylesheet" type="text/css" href="${p}">
          <pretix-widget event="${n}"></pretix-widget>
        `},document.head.append(e)}))}}export{i as default};
