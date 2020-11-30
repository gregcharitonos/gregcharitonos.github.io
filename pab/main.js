E = {
  body:'body',
  header: "body > header",
  nav: "body > header > nav",
  main: "body > main",
  footer: "body > footer",
  navToggler: "#nav-toggler",
  loader:"#loader"
}

async function GetPage(pageHash){
  let page = false;
  try {
    page = await fetch(`./pages/${pageHash}.html`);
  } catch {
    return page;
  }
  if(page.status != 200){return false};
  let rawHTML = await page.text();
  // let parser = new DOMParser();
  // let content = parser.parseFromString(rawHTML,'text/html');
  return rawHTML; //content.body.innerHTML;
}

async function HashChangeHandler(e){
  let hash = window.location.hash.substring(1) || "home";
  if(!hash) return false;
  E.loader.classList.toggle("visible");
  let pageContent = await GetPage(hash);
  E.loader.classList.toggle("visible");
  if (!pageContent) return false;
  E.main.innerHTML = pageContent;
}

function getHeaderStickiness(){
  if(window.scrollY > E.header.getBoundingClientRect().height){
    if(!E.header.classList.contains('isSticky')){
      E.header.classList.add('isSticky')
    }
  } else {
    if(E.header.classList.contains('isSticky')){
      E.header.classList.remove('isSticky');
    }
  }
}

function toggleNav() {
  E.nav.classList.toggle("toggled");
  E.navToggler.classList.toggle("toggled");
}

function init(){
  Object.entries(E).forEach(([key,val])=>{
    E[key] = document.querySelector(val)
  });
  HashChangeHandler();
  getHeaderStickiness();

  E.navToggler.addEventListener("click",toggleNav,false);
  E.nav.addEventListener("click",e=>{
    if(e.target.parentElement == e.currentTarget){
      toggleNav();
    }
  })
  window.addEventListener("scroll",getHeaderStickiness,false);
}

window.addEventListener('hashchange',HashChangeHandler,false)

window.onload = init;