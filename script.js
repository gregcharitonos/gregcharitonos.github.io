init = function(){
  E = {
    card:document.querySelector("#card"),
    icon:document.querySelector("#icon"),
    background:document.querySelector("#background")
  }
  
  let parallax = function(e){
    let dy = null;
    let dx = null;
    mx = E.card.getBoundingClientRect().width/2;
    my = E.card.getBoundingClientRect().height/2;
    if(e.type == "mousemove"){
      let x = e.clientX;
      let y = e.clientY;
      dx = -(mx - x)/mx - 2;
      dy = -(my - y)/my;
    } else {
      dx = e.alpha/36; dx = Math.sign(dx) * Math.min(1,Math.abs(dx));
      dy = e.beta/36; dy = Math.sign(dy) * Math.min(1,Math.abs(dy));
    }
    // E.card.style.transform = `
    //   rotateY(${Math.floor(dx*10)}deg)
    //   rotateX(${Math.floor(dy*10)}deg)
    // `
    // E.card.style.boxShadow = `
    //   ${Math.floor(-dx * 5)}px ${Math.floor(-dy * 5)}px 2px black
    // `
    E.icon.style.boxShadow = `
    inset ${Math.floor(dx * 3)}px ${Math.floor(dy * 3)}px 5px black
    `

    E.icon.style.backgroundPosition = `
    ${-10 + Math.floor(dx*10)}px
    ${-10 + Math.floor(dy*10)}px
    `
  }

   E.card.addEventListener("mousemove",parallax,false);
   window.addEventListener("deviceorientation",parallax,false);

  background_init();
}
window.onload = init;