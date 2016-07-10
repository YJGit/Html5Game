"use strict";

var Game = {
	canvas: null,
	canvasContext: null,
	map: null,
	ftps: 60
};

//画tank
var tankColor = new Array('#FEF26E','#BA9658');
var tank = new Tank(30.5, 0, 2, tankColor);
//记录tank的map下标
var tankPos = {i: 0, j: 1};
//记录地雷位置
var bomePos = [];
var pos = {x: 0, y: 0}; // 位置坐标
//方格长宽
var gridWidth = 30;
var gridHeight = 26;

//地图 空-e 矩形-r 雷-b
Game.map = [
    'reerrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'reeeereeeeeeeereeeeeeeereeeeer',
    'reeeereeeeeeeereeeeeeeereeeeer',
    'reerrreereereereerrrreereerrrr',
    'reeeeeeereereereeeeereeeeeeeer',
    'reeeeeeereereereeeeereeeeeeeer',
    'rrrrrrrrrrrreerrrreerbbrrreeer',
    'reeeereeeeeeeereeeeeeeereeeeer',
    'reeeereeeeeeeereeeeeeeereeeeer',
    'rerrrreereereereerrrrrrreerrrr',
    'rereeeeereereeeeeeereeeeeereer',
    'rereeeeereereeeeeeereeeeeereer',
    'rereerrrreereerrrrrreeerbbreer',
    'reeeereeeeereeeeebeeeeereeeeer',
    'reeeereeeeereeeeebeeeeereeeeer',
    'reeeereerrrrrrrrrreerrrrrrreer',
    'rbbrrreereeeeeeeereereeeeereer',
    'reeeeeeebeeeeeeeereereeeeereer',
    'reeeeeeebeerrrreeeeeeeereeeeer',
    'reerrrrrreereereeeeeeeereeeeer',
    'reeeeeeereereerrrrrrrrrrrrrrrr',
    'reeeeeeereeeeeeeeeeeeeeeeeeeee',
    'reeeeeeereeeeeeeeeeeeeeeeeeeee',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
];

function Tank(x, y, direct, tankColor){
    this.x = x;
    this.y = y;
    this.direct = direct;
    this.color = tankColor;

    this.moveUp = function(){
        //最顶上不能往上再移动
        if(this.y < 0){
            this.y = 0;
        }

        else{
            tankPos.i -= 1;
            if(tankPos.i < 0){
                tankPos.i = 0;
            }
            //判断是否可以往上走
            if(Game.map[tankPos.i][tankPos.j] !== 'r'){
                this.y -= 26;
            }
            else{
                tankPos.i +=1;
            }
        }

        this.direct = 0;
    }
    this.moveRight = function(){
        tankPos.j += 1;
        //判断是否可往右走
        if(Game.map[tankPos.i][tankPos.j] !== 'r'){
            this.x += 30;
        }
        else{
            tankPos.j -= 1;
        }
        this.direct = 1;
    }
    this.moveBottom = function(){
        tankPos.i += 1;
        if(Game.map[tankPos.i][tankPos.j] !== 'r'){
             this.y += 26;
        }
        else{
            tankPos.i -= 1;
        }
        this.direct = 2;   
    }
    this.moveLeft = function(){
        tankPos.j -= 1;
        if(tankPos.j < 0){
            tankPos.j = 0;
        }
        if(Game.map[tankPos.i][tankPos.j] !== 'r'){
            this.x -= 30;
        }
        else{
            tankPos.j += 1;
        }
        this.direct = 3;
        
    }
}

function drawTank(tank){
    switch(tank.direct){
        case 0:
        case 2:
            Game.canvasContext.fillStyle = tank.color[0];
            Game.canvasContext.fillRect(tank.x, tank.y, 8, 26);
            Game.canvasContext.fillRect(tank.x + 22, tank.y, 8, 26);
            Game.canvasContext.fillRect(tank.x + 8, tank.y + 6, 14, 14);
            //需要注意,画圆的时候需要重新开启路径
            
            Game.canvasContext.fillStyle = tank.color[1];
            Game.canvasContext.beginPath();
            Game.canvasContext.arc(tank.x + 15, tank.y + 13, 4, 0, Math.PI*2, true);
            Game.canvasContext.closePath();
            Game.canvasContext.fill();

            //画出炮筒(直线)
            Game.canvasContext.strokeStyle = tank.color[1];
            Game.canvasContext.lineWidth = 2;
            Game.canvasContext.moveTo(tank.x + 15, tank.y + 13);
            if(tank.direct == 0){
                Game.canvasContext.lineTo(tank.x + 15, tank.y);
            }else if(tank.direct == 2){
                Game.canvasContext.lineTo(tank.x + 15, tank.y + 26);
            }
            Game.canvasContext.stroke();
        break;
        case 1:
        case 3:
            Game.canvasContext.fillStyle = tank.color[0];
            Game.canvasContext.fillRect(tank.x, tank.y, 30, 6);
            Game.canvasContext.fillRect(tank.x, tank.y + 20, 30, 6);
            Game.canvasContext.fillRect(tank.x + 8, tank.y + 6, 14, 14);
            //需要注意,画圆的时候需要重新开启路径
            Game.canvasContext.fillStyle = tank.color[1];
            Game.canvasContext.beginPath();
            Game.canvasContext.arc(tank.x + 15, tank.y + 13, 4, 0, Math.PI*2, true);
            Game.canvasContext.closePath();
            Game.canvasContext.fill();
            //画出炮筒(直线)
            Game.canvasContext.strokeStyle = tank.color[1];
            Game.canvasContext.lineWidth = 2;
            Game.canvasContext.moveTo(tank.x + 15, tank.y + 13);
            if(tank.direct == 1){
                Game.canvasContext.lineTo(tank.x + 30, tank.y + 13);
            }else if(tank.direct == 3){
                Game.canvasContext.lineTo(tank.x, tank.y + 13);
            }
            Game.canvasContext.stroke();
        break;
    }
}

//坦克移动
function changeDirect(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var keycode = e.keyCode;
    if(e){
        switch(keycode){
            case 87:
                tank.moveUp();
                break;
            case 68:
                tank.moveRight();
                break;
            case 83:
                tank.moveBottom();
                break;
            case 65:
                tank.moveLeft();
                break;
            default:
                break;
        }
    }
}



Game.start = function(){
	Game.canvas = document.getElementById("myCanvas");
	Game.canvasContext = Game.canvas.getContext("2d");
	document.onkeydown = changeDirect;
	setTimeout(Game.mainLoop, 500);
};

Game.update = function(){
	//更新事件
};

Game.draw = function(){
    //填充矩形
    Game.canvasContext.fillStyle = "#cccccc";
    var x = gridWidth + 0.5, y = 0;
    //遍历map
    for(var i = 0; i < Game.map.length; i++){
        x = gridWidth + 0.5;
        for(var j = 1; j < Game.map[i].length; j++){
            if(Game.map[i][j] === 'r'){
                Game.canvasContext.fillRect(x, y, gridWidth, gridHeight);
            }
            else if(Game.map[i][j] === 'b'){
                pos.x = x;
                pos.y = y;
                bomePos.push(pos);
            }
            x += gridWidth;
        }
        y += gridHeight;
    }

    y = 0;
    for(i = 0; i < Game.map.length; i++){
        Game.canvasContext.fillRect(0, y, gridWidth, gridHeight);
        y += gridHeight;
    }

    Game.canvasContext.stroke();
    
	//画网格线
     for(var i = gridWidth + 0.5; i < Game.canvas.width; i += gridWidth){
        Game.canvasContext.beginPath();
        Game.canvasContext.lineWidth = 0.5;
        Game.canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)";
        Game.canvasContext.moveTo(i, 0);
        Game.canvasContext.lineTo(i, Game.canvas.height);
        Game.canvasContext.closePath();
        Game.canvasContext.stroke();
    }
    for(var i = gridHeight + 0.5;i < Game.canvas.height; i += gridHeight){
        Game.canvasContext.beginPath();
        Game.canvasContext.lineWidth = 0.5;
        Game.canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)";
        Game.canvasContext.moveTo(0, i);
        Game.canvasContext.lineTo(Game.canvas.width, i);
        Game.canvasContext.closePath();
        Game.canvasContext.stroke();
    }

	//画tank
	drawTank(tank);
};

Game.clearCanvas = function(){
	Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.mainLoop = function(){
	Game.clearCanvas();
	Game.update();
	Game.draw();
	setTimeout(Game.mainLoop, 1000 / Game.ftps);
};


document.addEventListener("DOMContentLoaded", Game.start);