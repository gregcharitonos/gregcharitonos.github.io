async function get_grades() {
  let response = await fetch("/grades.json");
  let data = await response.json();
  return data;
}

init = function () {
  anim = null;
  gradesEl = document.querySelector("#grades");
  prev_scroll = 0;
  delta_scroll = 0;
  canvas = document.querySelector("#background");
  toggleListEl = document.querySelector("#toggleList");
  courseWrapper = document.querySelector("#course-wrapper");
  ctx = canvas.getContext("2d");
  

  render = function () {
    anim = requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var t = Date.now();
    for (var i in bits) {
      var o = bits[i][3];
      ctx.font = (16 * o) + "px monospace";
      bits[i][2] -= Math.sign(delta_scroll) * ((o)**2);
      if (bits[i][2] < -5) {
        bits[i][2] = canvas.height + 5;
        bits[i][1] = Math.floor(Math.random() * canvas.width);
      } else if (bits[i][2] > canvas.height + 5) {
        bits[i][2] = -5;
      }
      ctx.beginPath();
      ctx.fillStyle = `hsla(256, 0%, 0%, ${o*0.1})`; // hsl(0, 0%, 0%)
      //ctx.fillText(bits[i][0], bits[i][1], bits[i][2]);
      ctx.arc(bits[i][1],bits[i][2],bits[i][0]*bits[i][3],0,Math.PI*2);
      ctx.fill();
    }
    delta_scroll = 0;
  }

  resetCanvas = function () {
    canvas.width = screen.width;//window.innerWidth;
    canvas.height = screen.height;//window.innerHeight;
    ctx = canvas.getContext("2d");
    cancelAnimationFrame(anim);
    bits = [];
    for (var i = 0; i < 100; i++) {
      //var b = Math.round(Math.random());
      var b = 2 + Math.floor(Math.random() * 8);
      var x = Math.floor(Math.random() * canvas.width);
      var y = Math.floor(Math.random() * canvas.height);
      var o = Math.floor(Math.random() * 100) / 100;
      bits.push([b, x, y, o]);
    }
    render();
  }

  //window.addEventListener("resize", resetCanvas, false);
  window.addEventListener("scroll", () => {
    delta_scroll = window.scrollY - prev_scroll;
    prev_scroll = window.scrollY;
    //render();
  }, false)
  resetCanvas();
  
  dyear = {
    "2017-2018":16,
    "2018-2019":17,
    "2019-2020":18
  };
  
  get_grades().then((grades)=>{
    for(key in grades){
      let tr = document.createElement("tr");
      let code = document.createElement("td");
      let name = document.createElement("td");
      let year = document.createElement("td");
      let yr = dyear[grades[key]["year"]];
      let url = `https://www.rug.nl/ocasys/rug/main/setyear?year=${yr}&referer=/ocasys/rug/vak/show%3Fcode%3D${key}`;
      if(key[key.length-1] == "A"){
        url = `https://www.rug.nl/ocasys/rug/main/setyear?year=${yr}&referer=/ocasys/rug/vak/show%3Fcode%3D${key.substring(0,key.length-1)}`;
      }
      code.innerHTML = `<a target="_blank" href="${url}">${key}</a>`;
      name.innerText = grades[key]["name"];
      year.innerText = grades[key]["year"];
      tr.appendChild(code);
      tr.appendChild(name);
      tr.appendChild(year);
      gradesEl.appendChild(tr);
    }
  })
  
  toggleList = function(){
    toggleListEl.classList.toggle("active");
    courseWrapper.classList.toggle("active");
  }
  
  toggleListEl.addEventListener("click",toggleList,false);
}
window.onload = init;
