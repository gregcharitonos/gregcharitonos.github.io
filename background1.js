anim = null;
act = null;
config = {
  node_num:50,
  default_velocity:1,
  connection_strength:2,
  radius:2,
  distance_threshold:100,
  mouse_power:5
}
class Node {
  static distance(a,b){
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  static draw(ctx,node){
    ctx.moveTo(node.x,node.y);
    ctx.arc(node.x,node.y,config.radius,0,Math.PI*2);
  }

  move(nodelist){
    let forceX = nodelist.reduce((a,b)=>{
      let distance = Node.distance(this,b);
      let power = distance > config.distance_threshold? (this.x - b.x) / distance**2 : distance > 0? -config.connection_strength * (this.x - b.x) / distance**2 : 0;
      return a + power;
    },0);
    let forceY = nodelist.reduce((a,b)=>{
      let distance = Node.distance(this,b);
      let power = distance > config.distance_threshold? (this.y - b.y) / distance**2 : distance > 0? -config.connection_strength*(this.y-b.y) / distance**2 : 0
      return a + power;
    },0);
    let mouse_distance = Node.distance(this,Mouse);
    let mouse_x = mouse_distance > config.distance_threshold? (this.x - Mouse.x) / mouse_distance**2 : mouse_distance > 0? -config.connection_strength*(this.x-Mouse.x) / mouse_distance**2 : 0;
    let mouse_y = mouse_distance > config.distance_threshold? (this.y - Mouse.y) / mouse_distance**2 : mouse_distance > 0? -config.connection_strength*(this.y-Mouse.y) / mouse_distance**2 : 0;
    forceX += mouse_x * config.mouse_power;
    forceY += mouse_y * config.mouse_power;
    this.vx -= forceX * 1e-1;
    this.vy -= forceY * 1e-1;
    this.vx *= 0.999;
    this.vy *= 0.999;
    return new Node({
      x:this.x + this.vx,
      y:this.y + this.vy,
      vx:this.vx,
      vy:this.vy
    })
  }

  constructor({x,y,vx,vy}){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
}
Mouse = {
  x:window.innerWidth/2,
  y:window.innerHeight/2
}
reset_canvas = function(){
  cancelAnimationFrame(anim);
  canvas = document.getElementById("background");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  nodes = [];
  for(let i=0; i<config.node_num; i++){
    let a = Math.floor(Math.random() * Math.PI*2);
    nodes.push(new Node({
      x:Math.floor(Math.random() * canvas.width),
      y:Math.floor(Math.random() * canvas.height),
      vx:Math.sin(a) * config.default_velocity,
      vy:Math.cos(a) * config.default_velocity
    }))
  }
  ctx.fillStyle = "#fff";
}

action_loop = function(){
  let new_nodes = nodes.map(node=>{
    return node.move(nodes);
  });
  nodes = new_nodes;
  act = setTimeout(action_loop,1000/60);
}

animation_loop = function(){
  anim = requestAnimationFrame(animation_loop);
  ctx.beginPath();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let i = nodes.length;
  while(i--){
    Node.draw(ctx,nodes[i]);
  }
  ctx.fill();
}

background_init = function(){
  reset_canvas();
  action_loop();
  animation_loop();
  window.addEventListener("mousemove",e=>{
    Mouse.x = e.clientX;
    Mouse.y = e.clientY;
  })
}

