init = function () {
  anim = null;
  canvas = document.querySelector("#background");
  ctx = canvas.getContext("2d");

  render = function () {
    anim = requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    var t = Date.now();
    for (var i in bits) {
      var o = bits[i][3];
      ctx.font = (16 * o) + "px monospace";
      bits[i][2] -= o ** 2;
      if (bits[i][2] < 0) {
        bits[i][2] = canvas.height + 5;
        bits[i][1] = Math.floor(Math.random() * canvas.width);
      }
      ctx.fillStyle = `hsla(256, 77%, 38%, ${o})`;
      ctx.fillText(bits[i][0], bits[i][1], bits[i][2]);
    }
  }

  resetCanvas = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    cancelAnimationFrame(anim);
    bits = [];
    for (var i = 0; i < 100; i++) {
      var b = Math.round(Math.random());
      var x = Math.floor(Math.random() * canvas.width);
      var y = Math.floor(Math.random() * canvas.height);
      var o = Math.floor(Math.random() * 100) / 100;
      bits.push([b, x, y, o]);
    }
    render();
  }
  resetCanvas();
  window.addEventListener("resize",resetCanvas,false);
}
window.onload = init;
