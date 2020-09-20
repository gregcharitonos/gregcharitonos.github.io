init = function(){
  E = {
    card:document.querySelector("#card"),
    icon:document.querySelector("#icon"),
    background:document.querySelector("#background")
  }
  
  let parallax = function(e){
    let dy = null;
    let dx = null;
    if(e.type == "mousemove"){
      let x = e.clientX;
      let y = e.clientY;
      let mx = e.currentTarget.clientWidth/2;
      let my = e.currentTarget.clientHeight/2;
      dx = -(mx - x)/mx;
      dy = -(my - y)/my;
    } else {
      dx = e.alpha/36; dx = Math.sign(dx) * Math.min(1,Math.abs(dx));
      dy = e.beta/36; dy = Math.sign(dy) * Math.min(1,Math.abs(dy));
    }
    
    E.card.style.transform = `
      rotateY(${Math.floor(dx*10)}deg)
      rotateX(${Math.floor(dy*10)}deg)
    `
    E.card.style.boxShadow = `
      ${Math.floor(-dx * 5)}px ${Math.floor(-dy * 5)}px 2px black
    `
    E.icon.style.boxShadow = `
    inset ${Math.floor(dx * 3)}px ${Math.floor(dy * 3)}px 2px black
    `
    E.icon.style.transform = `
      rotateY(${Math.floor(dx*10)}deg)
      rotateX(${Math.floor(dy*10)}deg)
    `

    E.icon.style.backgroundPosition = `
    ${Math.floor(dx*10)}px
    ${-10 + Math.floor(dy*10)}px
    `
  }

  E.card.addEventListener("mousemove",parallax,false);
  window.addEventListener("deviceorientation",parallax,false);

  slowStyles = async function(){
    let data = await fetch("./style.css").then(d=>{return d.text()});
    let length = data.length;
    let index = 0;
    let style= document.createElement("style");
    document.head.appendChild(style);
    update(data,0,style);
  }

  update = function(data,index,style){
    style.innerHTML += data[index];
    E.background.textContent += data[index];
    if(index < data.length-1){
      index++;
      setTimeout(()=>{
        update(data,index,style);
      },1000/60)
    } else {
      E.background.contentEditable = true;
      E.background.addEventListener("keyup",e=>{
        style.innerHTML = E.background.textContent;
      },false);
    }
  }

  slowStyles();
}
window.onload = init;