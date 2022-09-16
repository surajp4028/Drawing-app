const canvas = document.querySelector('canvas'),
toolbtn = document.querySelectorAll('.tool'),
fillcolor = document.querySelector('#check'),
range = document.querySelector('#range'),
clr = document.querySelector("#clr"),
clearCanvas = document.querySelector('#reset'),
saveCanvas = document.querySelector('#save'),
brushWidthShow = document.querySelector("#brush-size-show"),text = document.querySelector("#text"),
ctx = canvas.getContext('2d');

let premouseX, premouseY, snapshot;
let isdrawing = false,
selectedtool = brush,
selectedclr = "#f00a79",
brushwidth = 5;

const setCanvasBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = selectedclr ;// setting back brush color
}

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    brushWidthShow.style.backgroundColor = `${selectedclr}`;
    setCanvasBackground();
});

const drawSqua = (e) => {
    if(!fillcolor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY, premouseX - e.offsetX, premouseY - e.offsetY); // react(x-cordi, y-cordi, width, height)  
    }
    ctx.fillRect(e.offsetX,e.offsetY, premouseX - e.offsetX, premouseY - e.offsetY); // react(x-cordi, y-cordi, width, height)  
   
}
const drawCircle = (e)=> {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((premouseX - e.offsetX),2) , ((premouseY - e.offsetY),2));
    ctx.arc(premouseX,premouseY, radius, 0 , 2 * Math.PI);// used to daw circle (x-cord, y-cordi, radius, st angle, en angle)
    fillcolor.checked ? ctx.fill() : ctx.stroke();
}

const startdrawing = (e) => {
    isdrawing = true;
    premouseX = e.offsetX;
    premouseY = e.offsetY;
    ctx.beginPath(); // create new path
    ctx.lineWidth = brushwidth;
    ctx.strokeStyle = selectedclr;
    ctx.fillStyle = selectedclr;
    // copies canvas data & passing as snapshot value that avoid dragging the image
    snapshot = ctx.getImageData(0,0,canvas.width, canvas.height); // method return an imagedata object that copies the pixel data
}

const drawLine = (e)=>{
    ctx.beginPath();
    ctx.moveTo(premouseX,premouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();

}

const drawing = (e) => {
    if(!isdrawing) return; // to allow drawing
    ctx.putImageData(snapshot,0,0); // put the image data back onto the canvas 
    if(selectedtool === "brush"){
         ctx.lineTo(e.offsetX,e.offsetY); // creating a line
    ctx.stroke(); // filling line
    }
    else if(selectedtool === "square"){
        drawSqua(e);
    }
    else if(selectedtool === "circle"){
        drawCircle(e);
    }
    else if(selectedtool === "line"){
        drawLine(e);
    }
    else if(selectedtool === "eraser"){
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
        ctx.strokeStyle = selectedtool === "eraser" ? "#fff" : selectedclr ;
    }
   
    
}

toolbtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector(".icon .active").classList.remove("active");
        btn.classList.add("active");
        selectedtool = btn.id;
        console.log(selectedtool);
    });
});

clr.addEventListener("change", ()=> {
    let v = clr.value;
    selectedclr = v;
    brushWidthShow.style.backgroundColor = `${selectedclr}`;
    // brushWidthShow.style = "border"
    // console.log(selectedclr);
});

clearCanvas.addEventListener("click", ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeRect(0,0,canvas.width,canvas.height);
});

saveCanvas.addEventListener("click", () => {
    const link = document.createElement("a"); // create <a> element
    link.download = `${Date.now()}.jpg`; // date as download value
    link.href = canvas.toDataURL(); // passing canvas data as link href value
    link.click(); // click link to download
});

range.addEventListener('change', ()=> {
    brushwidth = range.value;
    brushWidthShow.style = `width: ${brushwidth}px; height: ${brushwidth}px;`;
    brushWidthShow.style.backgroundColor = `${selectedclr}`;
    // brushWidthShow.style = `height: ${brushwidth}px`;
    // console.log(brushwidth);
}

);
text.addEventListener("click", (e)=> {
    ctx.font = "light 12px sans-serif";
    ctx.fillText(e.key,e.offsetX,e.offsetY);
    ctx.fillStyle = selectedclr;
    // ctx.textAlign = 
    // ctx.
    e.offsetX += ctx.measureText(e.key).width;
});
canvas.addEventListener('mousedown',startdrawing);
canvas.addEventListener('mousemove',drawing);
canvas.addEventListener('mouseup',stopdrawing =()=>isdrawing = false );