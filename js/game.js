"use strict";

var Game = {
	canvas: null,
	canvasContext: null,
	map: null,
	ftps: 60
};

//画tank
var tankColor = new Array('#FEF26E','#BA9658');
var tank = new Tank(18, 4, 2, tankColor);
//记录地雷位置
var bomePos = [];
var pos = {x: 0, y: 0}; // 位置坐标

//地图 空-e 矩形-r 雷-b
Game.map = [
    'reeerrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'reeeeereeeeeeeereeeeeeeereeeeer',
    'reeeeereeeeeeeereeeeeeeereeeeer',
    'reeerrreereereereerrrreereerrrr',
    'reeeeeeeereereereeeeereeeeeeeer',
    'reeeeeeeereereereeeeereeeeeeeer',
    'rrrrrrrrrrrrreerrrreerbbrrreeer',
    'reeeeereeeeeeeereeeeeeeereeeeer',
    'reeeeereeeeeeeereeeeeeeereeeeer',
    'reerrrreereereereerrrrrrreerrrr',
    'reereeeeereereeeeeeereeeeeereer',
    'reereeeeereereeeeeeereeeeeereer',
    'reereerrrreereerrrrrreeerbbreer',
    'reeeeereeeeereeeeebeeeeereeeeer',
    'reeeeereeeeereeeeebeeeeereeeeer',
    'reeeeereerrrrrrrrrreerrrrrrreer',
    'rbbrrrreereeeeeeeereereeeeereer',
    'reeeeeeeebeeeeeeeereereeeeereer',
    'reeeeeeeebeerrrreeeeeeeereeeeer',
    'reeerrrrrreereereeeeeeeereeeeer',
    'reeeeeeeereereerrrrrrrrrrrrrrrr',
    'reeeeeeeereeeeeeeeeeeeeeeeeeeee',
    'reeeeeeeereeeeeeeeeeeeeeeeeeeee',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
];

function Tank(x, y, direct, tankColor){
    this.x = x;
    this.y = y;
    this.speed = 4;
    this.direct = direct;
    this.color = tankColor;

    this.moveUp = function(){
        var ui, uj1, uj2;
        this.y -= this.speed;
        if(this.y < 4){
            this.y = 4;
        }
        //(map[i][j])
        if((this.y - 4) % 6 === 0){
            ui = (this.y - 4) / 6;
        }
        else{
            ui = (this.y - 4 - (this.y - 4) % 6) / 6;
        }
        if((this.x - 8) % 8 === 0){
            uj1 = (this.x - 8)/ 8;
        }
        else{
            uj1 = (this.x - 8 - (this.x - 8) % 8) / 8;
        }
        if((this.x + 12 - 8) % 8 === 0){
            uj2 = (this.x + 12 - 8) / 8;
        }
        else{
            uj2 = (this.x + 12 - 8 - (this.x + 12 - 8) % 8) / 8;
        }

        //碰壁
        if(Game.map[ui][uj1] === "r" || Game.map[ui][uj2] === "r"){
            this.y = 4 + ui * 6 + 6;
        }
        this.direct = 0;
    }
    this.moveRight = function(){
        var ri1, ri2, rj;
        this.x += this.speed;

        //(map[i][j])
        if((this.y - 4) % 6 === 0){
            ri1 = (this.y - 4) / 6;
        }
        else{
            ri1 = (this.y - 4 - (this.y - 4) % 6) / 6;
        }
        if((this.y + 10 - 4) % 6 === 0){
            ri2 = (this.y + 10 - 4) / 6;
        }
        else{
            ri2 = (this.y + 10 - 4 - (this.y + 10 - 4) % 6) / 6;
        }
        if((this.x + 12 - 8) % 8 === 0){
            rj = (this.x + 12 - 8) / 8;
        }
        else{
            rj = (this.x + 12 - 8 - (this.x + 12 - 8) % 8) / 8;
        }

        //碰壁
        if(Game.map[ri1][rj] === "r" || Game.map[ri2][rj] === "r"){
            this.x = 8 + rj * 8 - 12;
        }
        this.direct = 1;
    }
    this.moveBottom = function(){
        var bi, bj1, bj2;
        this.y += this.speed;
        if(this.y > 4 + 23 * 6){
            this.y = 4 + 23 * 6;
        }
        //(map[i][j])
        if((this.y + 10 - 4) % 6 === 0){
            bi = (this.y + 10 - 4) / 6;
        }
        else{
            bi = (this.y + 10 - 4 - (this.y + 10 - 4) % 6) / 6;
        }
        if((this.x - 8) % 8 === 0){
            bj1 = (this.x - 8)/ 8;
        }
        else{
            bj1 = (this.x - 8 - (this.x - 8) % 8) / 8;
        }
        if((this.x + 12 - 8) % 8 === 0){
            bj2 = (this.x + 12 - 8) / 8;
        }
        else{
            bj2 = (this.x + 12 - 8 - (this.x + 12 - 8) % 8) / 8;
        }

        //碰壁
        if(Game.map[bi][bj1] === "r" || Game.map[bi][bj2] === "r"){
            this.y = 4 + bi * 6 - 10;
        }
        this.direct = 2;   
    }
    this.moveLeft = function(){
        var li1, li2, lj;
        this.x -= this.speed;

        //(map[i][j])
        if((this.y - 4) % 6 === 0){
            li1 = (this.y - 4) / 6;
        }
        else{
            li1 = (this.y - 4 - (this.y - 4) % 6) / 6;
        }
        if((this.y + 10 - 4) % 6 === 0){
            li2 = (this.y + 10 - 4) / 6;
        }
        else{
            li2 = (this.y + 10 - 4 - (this.y + 10 - 4) % 6) / 6;
        }
        if((this.x - 8) % 8 === 0){
            lj = (this.x - 8) / 8;
        }
        else{
            lj = (this.x - 8 - (this.x - 8) % 8) / 8;
        }

        //碰壁
        if(Game.map[li1][lj] === "r" || Game.map[li2][lj] === "r"){
            this.x = 8 + lj * 8 + 8;
        }
        this.direct = 3;
        
    }
}

function drawTank(tank){
    switch(tank.direct){
        case 0:
        case 2:
            Game.canvasContext.fillStyle = tank.color[0];
            Game.canvasContext.fillRect(tank.x, tank.y, 3, 10);
            Game.canvasContext.fillRect(tank.x + 9, tank.y, 3, 10);
            Game.canvasContext.fillRect(tank.x + 3, tank.y + 2, 6, 6);
            //需要注意,画圆的时候需要重新开启路径
            
            Game.canvasContext.fillStyle = tank.color[1];
            Game.canvasContext.beginPath();
            Game.canvasContext.arc(tank.x + 6, tank.y + 5, 1, 0, Math.PI*2, true);
            Game.canvasContext.closePath();
            Game.canvasContext.fill();

            //画出炮筒(直线)
            Game.canvasContext.strokeStyle = tank.color[1];
            Game.canvasContext.lineWidth = 2;
            Game.canvasContext.moveTo(tank.x + 6, tank.y + 5);
            if(tank.direct == 0){
                Game.canvasContext.lineTo(tank.x + 6, tank.y);
            }else if(tank.direct == 2){
                Game.canvasContext.lineTo(tank.x + 6, tank.y + 10);
            }
            Game.canvasContext.stroke();
        break;
        case 1:
        case 3:
            Game.canvasContext.fillStyle = tank.color[0];
            Game.canvasContext.fillRect(tank.x, tank.y, 12, 2);
            Game.canvasContext.fillRect(tank.x, tank.y + 8, 12, 2);
            Game.canvasContext.fillRect(tank.x + 3, tank.y + 2, 6, 6);
            //需要注意,画圆的时候需要重新开启路径
            Game.canvasContext.fillStyle = tank.color[1];
            Game.canvasContext.beginPath();
            Game.canvasContext.arc(tank.x + 6, tank.y + 5, 1, 0, Math.PI*2, true);
            Game.canvasContext.closePath();
            Game.canvasContext.fill();
            //画出炮筒(直线)
            Game.canvasContext.strokeStyle = tank.color[1];
            Game.canvasContext.lineWidth = 2;
            Game.canvasContext.moveTo(tank.x + 6, tank.y + 5);
            if(tank.direct == 1){
                Game.canvasContext.lineTo(tank.x + 12, tank.y + 5);
            }else if(tank.direct == 3){
                Game.canvasContext.lineTo(tank.x, tank.y + 5);
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
	//画地图
	Game.canvasContext.fillStyle = "#A9A9A9";
	var x = 8, y = 4;
	//遍历map
	for(var i = 0; i < Game.map.length; i++){
		x = 8;
		for(var j = 0; j < Game.map[i].length; j++){
			if(Game.map[i][j] === 'r'){
				Game.canvasContext.fillRect(x, y, 8, 6);
			}
			else if(Game.map[i][j] === 'b'){
				pos.x = x;
				pos.y = y;
				bomePos.push(pos);
			}
			x += 8;
		}
		y += 6;
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