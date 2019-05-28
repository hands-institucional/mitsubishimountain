var lastRender = 0
var yValues = [];
var ySize = 230; 
var direction;
var gammaValue;
var rotation = 0;
var p1 = 24;
var p2 = 129;

const compass = new Image(23, 22);
const car = new Image(105, 42);
const bg = new Image(320, 480);

window.onload = function() {
    init();
}

function init() {
    
    for (let i = 0; i < ySize; i++){
        yValues[i] = 115;
    }

    var canvas = document.getElementById("canvas");
    var app = document.getElementById("app");
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    canvas.width = app.offsetWidth;
    canvas.height = app.offsetHeight;
    compass.src = "./images/gps.png";
    car.src = "./images/car.png";
    bg.src = "./images/bg.jpg";

    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
    } else {
        //Navegador sem suporte. Compre um celular desta década! :)
    }

    window.requestAnimationFrame(function(timestamp) {
        loop(timestamp, context);
    });
}

function degToRad(deg) {
    return ((Math.PI/180) * deg);
}

function update(){
    yValues.shift();

    if(direction === "left") {
        if((yValues[yValues.length - 1] + 1) < 200)
            yValues.push(yValues[yValues.length - 1] + 1);
        else
            yValues.push(200);
    } else if(direction === "right") {
        if((yValues[yValues.length - 1] - 1) > 115)
            yValues.push(yValues[yValues.length - 1] - 1);
        else
            yValues.push(115);
    } else {
        yValues.push(yValues[yValues.length - 1]);
    }

}

function draw(context) {

    let yP1 = yValues[p1];
    let yP2 = yValues[p2];
    let pDiff = p2 - p1; 
    let yDiff = yP2 - yP1;

    hip = Math.sqrt(Math.pow(pDiff, 2) + Math.pow(yDiff, 2));

    angle = yDiff/hip;

    //Clear screen
    context.drawImage(bg, 0, 0);

    //Line trail
    for (let x = 0; x < ySize; x++) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(x - 1, canvas.height - yValues[x] - 1, 2, 2);
    }

    //Buffer
    context.save();

    //Rotate
    context.translate(yValues.length, canvas.height - yValues[yValues.length - 1]);
    context.rotate(degToRad(gammaValue));

    //Compass
    context.drawImage(compass, 25 -compass.width/2, -compass.height/2);

    //Restore
    context.restore();

    //Buffer
    context.save();

    //Rotate
    context.translate(p2, canvas.height - yP2);
    context.rotate(-angle);

    //Compass
    context.drawImage(car, -car.width, -car.height/2 - 20);

    //Restore
    context.restore();
}

function deviceOrientationListener(event) {

    let gamma = event.gamma;
    gammaValue = gamma;

    if(gamma > -80 && gamma < -20) {
        direction = "left"
    } else if(gamma > 20 && gamma < 80) {
        direction = "right"
    } else if(gamma >= 20 && gamma <= 275) {
        //"Nothing";
    } else {
        direction = "center"
    }
}

function loop(timestamp, context) {

    update();
    draw(context);
  
    lastRender = timestamp;
    window.requestAnimationFrame(function() {
        loop(timestamp, context);
    });
}