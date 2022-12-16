import { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import "./Canvas.css";
import {io} from 'socket.io-client';
import socketIOClient from "socket.io-client";


const socket = socketIOClient('http://localhost:5000');
const pathname = window.location.pathname;
const roomId = pathname.split('/')[1];

function Canvas() {
const canvasRef = useRef(null);
const ctxRef = useRef(null);
var puedo=false,imgData;
//var numCaptura=0;
let x1,y1;
const miId=socket.id;
const [numCaptura,cambiarNum]=useState(0);
const [x,cambiarx]=useState(null);
const [y,cambiary]=useState(null);
const [dibujando, cambiarDibujando] = useState(false);
const [grosor, cambiarGrosor] = useState(5);
const [color, cambiarColor] = useState("black");
const [relleno, cambiarRelleno] = useState("black");
const [herramienta,cambiarHerramienta] = useState("lapiz");
const [rotacion,cambiarRotacion]= useState("0")
const [control,cambiarcontrol]= useState("null")
var startX;
  var startY;
  var selectedText=-1;
  var textos = [];

useEffect(() => {
  
  const canvas = canvasRef.current;
	const ctx = canvas.getContext("2d");
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.strokeStyle = color;
  ctx.fillStyle = relleno;
	ctx.lineWidth = grosor;
	ctxRef.current = ctx; 

  socket.on('connect', ()=>{
    console.log(socket.id)
    socket.emit('join room', roomId);
    alert(`The name you entered was: ${ window.location.pathname}`);
  }
    )
  
  socket.on('connect_error', ()=>{
    
      setTimeout(()=>socket.connect(),5000)
  })
  socket.on('terminado', data => {
    //console.log('miId=',miId," control=",control,"data=")
    var dataa = JSON.parse(data.lienzoActual);
    var image = new Image();
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
  }
  image.src = dataa.image;
    console.log("hay cambios")
  });
  
  socket.on('control', (data)=>{
    cambiarcontrol(data.control);
    console.log('miId=',miId," control=",control,"data=",data.control)
})
  return () => {
    socket.off('connect');
    socket.off('terminado');
  };

}, [color,grosor,relleno,control]);




const iniciarDibujo = (e) => {
  e.preventDefault();
    startX = parseInt(e.clientX - e.nativeEvent.offsetX);
    startY = parseInt(e.clientY - e.nativeEvent.offsetY);

    console.log("imprimiendo tamano" + textos.length)
    for (var i = 0; i < textos.length; i++) {
      console.log("checking hit")
      if (textHittest(startX, startY, i)) {
        console.log("hitted")
        selectedText = i;
      }
    }

  cambiarx(e.nativeEvent.offsetX);
  cambiary(e.nativeEvent.offsetY);
  x1=e.nativeEvent.offsetX;
  y1=e.nativeEvent.offsetY;
  console.log("x="+x+"y="+y);
  console.log("x1="+x1+"y1="+y1);
  cambiarDibujando(true);
  ;
  if(herramienta==="lapiz"){	
    ctxRef.current.beginPath()
	ctxRef.current.moveTo(x1,y1);
  }
  if(herramienta==="triangulo"){	
    }
};

const terminarDibujo = (e) => {
	puedo=false;
	cambiarDibujando(false);
    ctxRef.current.closePath();
    e.preventDefault();
    selectedText = -1;

    var canvasContents = canvasRef.current.toDataURL();
    var data = { image: canvasContents };
    var string = JSON.stringify(data);
    socket.emit('terminado', { lienzoActual: string });
};
function draw(){
  var ctx =  canvasRef.current.getContext("2d");
  ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
  for(var i=0;i<textos.length;i++){
      var text=textos[i];
      ctx.fillText(text.text,text.x,text.y);
  }
}
const dibujar = (e) => {
	if (!dibujando) {
    if (selectedText < 0) { return; }
    e.preventDefault();
    // const canvasOffset=canvasRef.current.offset;
    // var offsetX=canvasOffset.left;
    // var offsetY=canvasOffset.top;
    var mouseX = parseInt(e.clientX - e.nativeEvent.offsetX);
    var mouseY = parseInt(e.clientY - e.nativeEvent.offsetY);

    // Put your mousemove stuff here
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var text = textos[selectedText];
    text.x += dx;
    text.y += dy;
    draw();
    return;
  }
  
    if(herramienta==="lapiz"){
    ctxRef.current.lineTo(
    e.nativeEvent.offsetX,
    e.nativeEvent.offsetY
    );
    ctxRef.current.stroke();}
    if(herramienta==="cuadrado"){
      if(puedo){ctxRef.current.putImageData(imgData, 0, 
        0)}
      imgData = ctxRef.current.getImageData(0, 0,canvasRef.current.width,canvasRef.current.height);
      
      ctxRef.current.translate(x,y);
      ctxRef.current.rotate(rotacion * Math.PI / 180);
      ctxRef.current.translate(-x,-y);
      ctxRef.current.strokeRect(x,y,e.nativeEvent.offsetX-x,e.nativeEvent.offsetY-y);
      ctxRef.current.fillRect(x,y,e.nativeEvent.offsetX-x,e.nativeEvent.offsetY-y);
      ctxRef.current.translate(x,y);
      ctxRef.current.rotate(-rotacion * Math.PI / 180);
      ctxRef.current.translate(-x,-y);
      puedo=true;
      console.log("????"+x+"????"+y)
    }
    if(herramienta==="triangulo"){
      ctxRef.current.beginPath()
      if(puedo){ctxRef.current.putImageData(imgData, 0, 0);}
      imgData = ctxRef.current.getImageData(0, 0, canvasRef.current.width,canvasRef.current.height);
      
      ctxRef.fillStyle="black";
      ctxRef.current.moveTo(x,e.nativeEvent.offsetY);
      ctxRef.current.lineTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY);
      ctxRef.current.lineTo(e.nativeEvent.offsetX - (e.nativeEvent.offsetX-x)/2,y);
      ctxRef.current.fill();
      ctxRef.current.closePath();      
      ctxRef.current.stroke();
      puedo=true;
      console.log((e.nativeEvent.offsetX-x1)+"y"+y1);
    }
  
  
	
	
};



const dibujarImagen = (url) => {
  console.log(url)

  const ctx = canvasRef.current.getContext('2d');

  var imageObj1 = new Image();
  imageObj1.src = url
  imageObj1.setAttribute('crossOrigin', '');
  imageObj1.onload = function() {
      ctx.drawImage(imageObj1,0,0);
  }
}
const dibujarTexto = (texto) => {
  textos.push({ text: texto, x: Math.floor(Math.random() * 1000), y: Math.floor(Math.random() * 1000) });
  const canvas = canvasRef.current;

  var ctx = canvas.getContext("2d");
  ctx.font = "16px verdana";


  for (var i = 0; i < textos.length; i++) {
    var text = textos[i];
    text.width = ctx.measureText(text.text).width;
    text.height = 16;
  }

  console.log(textos)
  ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
  for (var i = 0; i < textos.length; i++) {
    var text = textos[i];
    ctx.fillText(text.text, text.x, text.y);
  }
}

function textHittest(x, y, textIndex) {
  var text = textos[textIndex];
  return (x >= text.x &&
    x <= text.x + text.width &&
    y >= text.y - text.height &&
    y <= text.y);
}
const limpiar = () =>{
  const canvas = canvasRef.current;
  // eslint-disable-next-line
  canvas.width=canvas.width;  
}
/*<ListaLienzos/>
    <Guardado
    canvas={canvasRef.current}
    />*/
return (
	<div className="App">
    
		<canvas
		onMouseDown={iniciarDibujo}
		onMouseUp={terminarDibujo}
		onMouseMove={dibujar}
		ref={canvasRef}
		width={1150}
		height={700}
		/>
    
    <Menu
		cambiarColor={cambiarColor}
    cambiarRelleno={cambiarRelleno}
		cambiarGrosor={cambiarGrosor}
    limpiar={limpiar}
    cambiarHerramienta={cambiarHerramienta}
    dibujarImagen={dibujarImagen}
    cambiarRotacion={cambiarRotacion}
    agregarTexto={dibujarTexto}
		/>
	</div>
);
}

export default Canvas;
