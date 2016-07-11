"use strict";

var Game = {
    canvas: null,
    canvasContext: null,
    map: null,
    ftps: 60
};

//画tank
var tankColor = new Array('#FEF26E','#BA9658');
var tank = new Tank(30.5, 0, 2, {i:0, j: 1}, tankColor);
//记录地雷位置
var boom = {
    booePos: null,
    boomMusic: null
};

var pos = {i: 0, j: 0}; // map下标
//方格长宽
var gridWidth = 30;
var gridHeight = 26;
//爆炸效果
var booms={}; 
var boomsHavBo = false;  //标志是否已经炸过
var footStep = 10000; 

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
    'reeeeeeereeeeeeeeeeeeeeeeeeeer',
    'reeeeeeereeeeeeeeeeeeeeeeeeeer',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrreer',
    'reeeeeeeeebeereeeeeeeeeeeereer',
    'reeeeeeeeebeereeeeeeeeeeeereer',
    'reerrrrrrrreereerrrrrrrreeeeer',
    'reereeeeeeeeereeeeeereereeeeer',
    'reereeeeeeeeereeeeeereerrrreer',
    'reereerrrrrrrrrrrreereeeeereer',
    'reereeeeeeeeeeeeeeeereeeeereer',
    'reereeeeeeeeeeeeeeeereeeeereer',
    'reerrrrrrrrrrrrrrrrrreereereer',
    'reereeeeeeeeeeeeereeeeereeeeer',
    'reereeeeeeeeeeeeereeeeereeeeer',
    'reeeeereeeeerrreereerrrrrrrrrr',
    'reeeeereeeeeeereereereeeeeeeer',
    'reerrrrrrrrreereereerrrrrrreer',
    'reereereeeereereereeeeeeeeeeer',
    'reeeeereeeeeeereereeeeeeeeeeer',
    'reeeeerbreeeeereerrrrrrrrrreer',
    'rrrreeeerrrrrrreeeeeeeeeeereer',
    'reeeeeeereeeeeeeerreeeerrrreer',
    'reeeeeeereeeeeeeereeeeereeeeer',
    'reerrrrrreerrrreerrrreereerrrr',
    'reereeeereeeeereeeeerrrreereer',
    'reereeeerrreeerbbreeeeeeeeeeer',
    'reereeeeeeeeeeeeereeeeeeeeeeer',
    'reereeeeeeeeeeeeereeeeeeeeeeer',
    'reerrrrrrrrrrrrrrrrrrrrrrrrrrr'
];

/*
*绘制坦克及坦克移动函数
*/
function Tank(x, y, direct, pos, tankColor){
    this.x = x;
    this.y = y;
    this.direct = direct;
    this.pos = pos;
    this.color = tankColor;

    this.moveUp = function(){
        //最顶上不能往上再移动
        if(this.y < 0){
            this.y = 0;
        }

        else{
            this.pos.i -= 1;
            if(this.pos.i < 0){
                this.pos.i = 0;
            }
            //判断是否可以往上走
            if(Game.map[this.pos.i][this.pos.j] !== 'r'){
                this.y -= 26;
            }
            else{
                this.pos.i +=1;
            }
        }

        this.direct = 0;
    }
    this.moveRight = function(){
        this.pos.j += 1;
        //判断是否可往右走
        if(Game.map[this.pos.i][this.pos.j] !== 'r'){
            this.x += 30;
        }
        else{
            this.pos.j -= 1;
        }
        this.direct = 1;
    }
    this.moveBottom = function(){
        this.pos.i += 1;
        if(Game.map[this.pos.i][this.pos.j] !== 'r'){
             this.y += 26;
        }
        else{
            this.pos.i -= 1;
        }
        this.direct = 2;   
    }
    this.moveLeft = function(){
        this.pos.j -= 1;
        if(this.pos.j < 0){
            this.pos.j = 0;
        }
        if(Game.map[this.pos.i][this.pos.j] !== 'r'){
            this.x -= 30;
        }
        else{
            this.pos.j += 1;
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
    if(e && !boomsHavBo && Game.map[tank.pos.i][tank.pos.j] !== 'b' && footStep){  //防止踩雷继续移动
        switch(keycode){
            case 87:
                tank.moveUp();
                footStep--;
                break;
            case 68:
                tank.moveRight();
                footStep--;
                break;
            case 83:
                tank.moveBottom();
                footStep--;
                break;
            case 65:
                tank.moveLeft();
                footStep--;
                break;
            default:
                break;
        }
    }
}

/*
*爆炸效果的函数
*先移动原点坐标到300,300. 随机分布20个爆炸碎片, 用渐变线表示. 长度为0,100的渐变线,由黄变红.
*分配起始点start,画线长度height,角度angle,线粗width.
*在spread中,画线完成后每帧刷新步长为5, 线长每次减3直到少于3.角度稍微变化.
*maxheight为最大总长,超过此长度则不再绘画.
*/
//随机函数， 用于爆炸效果
function random(start, end) {  
    return Math.round(Math.random() * (end - start) + start);  
}

function drawLine(booms){  
    if(booms.start + booms.height < booms.maxheight){  
        booms.ctx.lineWidth = booms.width;  
        booms.ctx.save();   
        booms.ctx.rotate(Math.PI * 2 / 360 * booms.angle)  
        booms.ctx.beginPath();  
          
        booms.ctx.moveTo(booms.start, 0);  
          
        booms.ctx.lineTo(booms.start + booms.height, 0)  
        booms.ctx.stroke();  
        booms.ctx.restore();  
    }  
}

function boomEx(id,ctx,start,height,angle,width){  
    this.id = id;  
    this.ctx = ctx;  
    this.start = start;  
    this.height = height;  
    this.angle = angle;  
    this.width = width;  
    this.maxheight = 3 * (start + height);  
}

function spread(booms){  
    booms.start += 5;  
    if(booms.height > 3){  
        booms.height -= 3;  
        booms.angle += 1;  
    }     
} 

function drawExplode(){  
    Game.canvasContext.save();  
    Game.canvasContext.translate(tank.pos.j * 30 + 15, tank.pos.i * 26 + 13);   
    var rg = Game.canvasContext.createRadialGradient(0, 0, 0, 40, 0, 40);  
    rg.addColorStop(0, '#ff0');  
    rg.addColorStop(1, '#f00');  
    Game.canvasContext.lineCap = "round";  
    Game.canvasContext.strokeStyle=rg;  
      
    for(var i = 1; i < 20; i++){  
        if(booms[i] && booms[i].id){  
            spread(booms[i]);  
        }
        else{  
            var start = random(5, 15);  
            var height = random(5, 25);  
            var angle = random(10, 360);  
            var width = random(1, 3);  
            booms[i] = new boomEx(i, Game.canvasContext, start, height, angle, width);  
        }  
        drawLine(booms[i]);  
    }  
      
    Game.canvasContext.restore();  
    setTimeout(drawExplode, 50);  
}

/*
*游戏逻辑流程
*/       
Game.start = function(){
	Game.canvas = document.getElementById("myCanvas");
    Game.canvasContext = Game.canvas.getContext("2d");
    boom.boomPos = [];
    boom.boomMusic = new Audio();
    boom.boomMusic.src = "music/4737.wav";
    document.onkeydown = changeDirect; //键盘事件
    setTimeout(Game.mainLoop, 500);
};

Game.gameOver = function(){
    //gameover

}

Game.update = function(){
	//更新事件
    //踩到雷，播放音乐及爆炸特效
    if(Game.map[tank.pos.i][tank.pos.j] === 'b' && !boomsHavBo){
        boom.boomMusic.play();
        boomsHavBo = true;
    }
};

Game.draw = function(){
    //填充矩形
    Game.canvasContext.fillStyle = "#cccccc";
    Game.canvasContext.strokeStyle = "#000";
    var x = gridWidth + 0.5, y = 0;
    //遍历map
    for(var i = 0; i < Game.map.length; i++){
        x = gridWidth + 0.5;
        for(var j = 1; j < Game.map[i].length; j++){
            if(Game.map[i][j] === 'r'){
                Game.canvasContext.fillRect(x, y, gridWidth, gridHeight);
                Game.canvasContext.beginPath();
                Game.canvasContext.moveTo(x, y);
                Game.canvasContext.lineTo(x + gridWidth, y + gridHeight);
                Game.canvasContext.moveTo(x, y + gridHeight);
                Game.canvasContext.lineTo(x + gridWidth, y);
                Game.canvasContext.moveTo(x, y);
                Game.canvasContext.lineTo(x + gridWidth, y);
                Game.canvasContext.lineTo(x + gridWidth, y + gridHeight);
                Game.canvasContext.lineTo(x, y + gridHeight);
                Game.canvasContext.lineTo(x, y);
                Game.canvasContext.closePath();
                Game.canvasContext.stroke();
            }
            else if(Game.map[i][j] === 'b'){
                pos.i = i;
                pos.j = j;
                boom.boomPos.push(pos);
                Game.canvasContext.fillRect(x, y, gridWidth / 2, gridHeight / 2);
                Game.canvasContext.stroke();
            }
            x += gridWidth;
        }
        y += gridHeight;
    }

    y = 0;
    for(i = 0; i < Game.map.length; i++){
        Game.canvasContext.fillRect(0, y, gridWidth, gridHeight);
        Game.canvasContext.beginPath();
        Game.canvasContext.moveTo(0, y);
        Game.canvasContext.lineTo(gridWidth, y + gridHeight);
        Game.canvasContext.moveTo(0, y + gridHeight);
        Game.canvasContext.lineTo(gridWidth, y);
        Game.canvasContext.moveTo(0, y);
        Game.canvasContext.lineTo(gridWidth, y);
        Game.canvasContext.lineTo(gridWidth, y + gridHeight);
        Game.canvasContext.lineTo(0, y + gridHeight);
        Game.canvasContext.lineTo(0, y);
        Game.canvasContext.closePath();
        y += gridHeight;
        Game.canvasContext.stroke();
    }
    
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

    if(boomsHavBo){
        drawExplode();
        Game.gameOver();
    }
    else{
        //画tank
        drawTank(tank);
    }
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