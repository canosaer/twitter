class TwitterAPI{API_BASE_URL="./twitter-proxy.php";constructor(){this.termInput=document.querySelector(".search-controls__input"),this.sortButton=document.querySelector(".sort-menu__active"),this.firstSortOpen=!0,this.sortList=document.querySelector(".sort-menu__list"),this.sortText=document.querySelector(".sort-menu__text"),this.countButton=document.querySelector(".count-menu__active"),this.countList=document.querySelector(".count-menu__list"),this.countText=document.querySelector(".count-menu__text"),this.firstCountOpen=!0,this.setupListeners()}setupListeners(){const t=document.querySelector(".search-controls__button");this.termInput.addEventListener("keyup",this.checkForEnter),t.addEventListener("click",this.handleSearch),this.sortButton.addEventListener("click",this.handleSortClick),this.countButton.addEventListener("click",this.handleCountClick)}handleSearch=t=>{const e=document.querySelector(".search-controls__input").value;if(e){let t="mixed";-1!==this.sortText.textContent.indexOf("Popularity")?t="popular":-1!==this.sortText.textContent.indexOf("Newest")&&(t="recent");const s=parseInt(this.countText.textContent.substring(0,3).trim());let n=document.querySelector(".popularity-message");s>15&&"popular"===t?n.classList.remove("hidden"):n.classList.contains("hidden")||n.classList.add("hidden");const r={op:"search_tweets",q:e,result_type:t,count:s};axios.get(this.API_BASE_URL,{params:r}).then(this.processResults).catch(this.handleError)}};processResults=t=>{let e=t.data.statuses;const s=document.querySelector(".results"),n=s.querySelectorAll("*");n&&n.forEach((t=>{t.remove()})),e.forEach((t=>{let e=document.createElement("div");e.classList.add("results__row");let n=document.createElement("div");n.classList.add("results__avatar"),n.style.background=`url(${t.user.profile_image_url})`,n.style.backgroundSize="cover",n.style.backgroundPoisition="center",e.appendChild(n);let r=document.createElement("p");r.classList.add("results__user-name"),r.textContent=t.user.name,e.appendChild(r);let o=document.createElement("p");o.classList.add("results__at-row"),o.textContent="@";let i=document.createElement("span");i.classList.add("results__screen-name"),i.textContent=t.user.screen_name,o.appendChild(i),e.appendChild(o);let c=document.createElement("p");c.classList.add("results__tweet");let l=t.text,a=l.indexOf("https://");if(-1!==a){let t=document.createElement("a");t.href=l.substring(a,l.length),t.setAttribute("target","_blank"),t.textContent=l.substring(a,l.length),t.style.color="skyblue",c.textContent=l.substring(0,a)+" ",c.appendChild(t)}else c.textContent=l;e.appendChild(c);let u=document.createElement("p");u.classList.add("results__timestamp"),u.textContent=this.formatTimestamp(t.created_at),e.appendChild(u),s.appendChild(e)}))};formatTimestamp=t=>{let e="",s=t.substring(4,7);"Jan"===s?e="1":"Feb"===s?e="2":"Mar"===s?e="3":"Apr"===s?e="4":"May"===s?e="5":"Jun"===s?e="6":"Jul"===s?e="7":"Aug"===s?e="8":"Sep"===s?e="9":"Oct"===s?e="10":"Nov"===s?e="11":"Dec"===s&&(e="12");let n="",r=t.substring(8,10);return n="0"===r[0]?r[1]:r,`${e}/${n}/${t.substring(28,30)}`};handleError=t=>{console.error("ERROR!",t)};checkForEnter=t=>{"Enter"===t.key&&this.handleSearch()};handleSortClick=t=>{if(this.sortList.classList.toggle("hidden"),this.firstSortOpen){let t=document.querySelectorAll(".sort-menu__item");this.firstSortOpen=!1,t.forEach((t=>{t.addEventListener("click",this.handleSortItemClick)}))}};handleSortItemClick=t=>{this.sortText.textContent!=t.target.textContent&&(this.sortText.textContent=t.target.textContent,document.querySelector(".results__row")&&this.handleSearch()),this.sortList.classList.toggle("hidden")};handleCountClick=t=>{if(this.countList.classList.toggle("hidden"),this.firstCountOpen){let t=document.querySelectorAll(".count-menu__item");this.firstCountOpen=!1,t.forEach((t=>{t.addEventListener("click",this.handleCountItemClick)}))}};handleCountItemClick=t=>{this.countText.textContent!=t.target.textContent&&(this.countText.textContent=t.target.textContent,this.termInput.value&&this.handleSearch()),this.countList.classList.toggle("hidden")}}
//# sourceMappingURL=twitter.js.map