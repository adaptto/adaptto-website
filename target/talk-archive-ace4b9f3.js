import{i as e,m as t,k as s,a}from"./scripts.js";import{h as r}from"./htmlTemplateTag-56ff717c.js";function l(e){return[e.title??"",e.description??"",e.keywords.join(", "),e.tags.join(", "),e.speakers.join(", ")].join("\n")}class i{index;constructor(e){this.index=e.map((e=>({talk:e,text:l(e).toLocaleLowerCase()})))}search(e){const t=e.toLocaleLowerCase();return this.index.filter((e=>e.text.includes(t))).map((e=>e.talk))}}class n{path;year;title;description;keywords=[];tags=[];speakers=[]}function o(e){return[...new Set(e)].filter((e=>void 0!==e)).sort()}class c{filter;talks;filteredTalks;index;constructor(e){this.talks=e.getAllTalks().map((e=>{const a=new n;return a.path=e.path,a.year=t(e.path)?.toString(),a.title=s(e.title),a.description=e.description,a.keywords=e.getKeywords(),a.tags=e.getTags(),a.speakers=e.getSpeakers(),a})).filter((e=>e.speakers.length>0)),this.filteredTalks=this.talks}applyFilter(e){this.filter=e,this.filteredTalks=e?this.talks.filter((t=>e.matches(t))):this.talks,this.index=void 0}getFilteredTalks(){return this.filteredTalks}getFilteredTalksFullTextSearch(e){return this.index||(this.index=new i(this.filteredTalks)),this.index.search(e)}getTagFilterOptions(){return o(this.talks.flatMap((e=>e.tags)))}getYearFilterOptions(){return o(this.talks.map((e=>e.year))).reverse()}getSpeakerFilterOptions(){return o(this.talks.flatMap((e=>e.speakers)))}}const h=["tags","years","speakers"];function d(e){return e.map((e=>encodeURIComponent(e))).join(",")}class p{tags;years;speakers;matches(e){return!(this.tags&&!this.tags.find((t=>e.tags.includes(t))))&&(!(this.years&&!this.years.includes(e.year))&&!(this.speakers&&!this.speakers.find((t=>e.speakers.includes(t)))))}buildHash(){const e=[];return this.tags&&e.push(`tags=${d(this.tags)}`),this.years&&e.push(`years=${d(this.years)}`),this.speakers&&e.push(`speakers=${d(this.speakers)}`),`#${e.join("/")}`}}function u(e){const t=new p;return e.substring(1).split("/").forEach((e=>{const s=e.split("=");if(2===s.length){const e=s[0],a=s[1].split(",").map((e=>decodeURIComponent(e)));h.includes(e)&&a.length>0&&(t[e]=a)}})),t}const g=[{category:"tags",label:"Tags",archiveMethod:"getTagFilterOptions",collapsible:!1},{category:"years",label:"Year",archiveMethod:"getYearFilterOptions",collapsible:!0},{category:"speakers",label:"Speaker",archiveMethod:"getSpeakerFilterOptions",collapsible:!0}];function k(e,s,a){a&&s.applyFilter(u(window.location.hash));const l=e.querySelector(".search input").value.trim(),i=e.querySelector(".result table tbody");i.innerHTML="";const n=""!==l?s.getFilteredTalksFullTextSearch(l):s.getFilteredTalks();n.length>0?n.forEach((e=>{i.insertAdjacentHTML("beforeend",r`<tr>
        <td>${t(e.path)}</td>
        <td><a href="${e.path}">${e.title}</a></td>
        <td>${e.speakers.join(", ")}</td>
      </tr>`)})):i.insertAdjacentHTML("beforeend",r`<tr class="no-result">
      <td colspan="3">No matching talk found.</td>
    </tr>`)}function f(e,t){const s=e.querySelector(".filter");g.forEach((l=>{const i=function(e,t,s,l,i){const n=a(e,"div","filter-category");a(n,"span","category").textContent=t;const o=a(n,"ul");return s.forEach((e=>{const t=a(o,"li"),s=a(t,"label"),r=a(s,"input");r.type="checkbox",r.value=e,l&&l.includes(e)&&(r.checked=!0),s.append(e)})),i&&s.length>5&&(o.classList.add("collapsible"),l&&0!==l.length||o.classList.add("collapsed"),o.insertAdjacentHTML("beforeend",r`
      <li class="collapse-toggle more"><a href="">more...</a></li>
      <li class="collapse-toggle less"><a href="">less...</a></li>`)),n}(s,l.label,t[l.archiveMethod](),t.filter[l.category],l.collapsible);i.querySelectorAll("input[type=checkbox]").forEach((s=>{s.addEventListener("change",(()=>{let s=Array.from(i.querySelectorAll("input[type=checkbox]")).filter((e=>e.checked)).map((e=>e.value));0===s.length&&(s=void 0);const a=u(window.location.hash);a[l.category]=s,window.history.replaceState(null,null,a.buildHash()),k(e,t,!0)}))}))})),s.querySelectorAll("ul.collapsible").forEach((e=>{e.querySelectorAll(" li.collapse-toggle a").forEach((t=>{t.addEventListener("click",(t=>{t.preventDefault(),e.classList.toggle("collapsed")}))}))}))}async function y(t){const s=await async function(){const t=await e();return new c(t)}();let a;t.innerHTML=r`
      <div class="search">
        <input type="search" placeholder="Search">
      </div>
      <div class="filter">
      </div>
      <div class="result">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Talk</th>
              <th>Speaker</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>`,t.querySelector(".search input").addEventListener("input",(()=>{clearInterval(a),a=setTimeout((()=>k(t,s,!1)),500)})),window.addEventListener("hashchange",(()=>k(t,s,!0))),k(t,s,!0),f(t,s)}export{y as default};
