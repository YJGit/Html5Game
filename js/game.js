"use strict";

var Game = {
    canvas: null,
    canvasContext: null,
    map: null,
    ftps: 60
};

//画玩家
var player = new play(30.5, 0, 2, {i:0, j: 1});
var playerLife = 3;
var playerAlive = true; //标志玩家是否复活完成或者存活
//地雷爆炸音乐
var boom = {
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

//answered[i]表示编号为i的问题是否回答过，true表示回答过，false表示未回答过。
var answered = new Array(20);
for (var i = 0; i < answered.length; i++){
  answered[i] = false;
}
//是否重新开始完
var playAgain = false;

/*
*位置对应问题及建议路径
*/
var tips = [
    {
        pos: 5.12,
        ways: "you'd better go straight"
    },
    {
        pos: 5.13,
        ways: "you'd better go left and go foreword"
    },
    {
        pos: 1.17,
        ways: "go down please and take careful"
    },
    {
        pos: 2.17,
        ways: "go straight please and take careful"
    },
    {
        pos: 7.21,
        ways: "go back and choose antherWay, I suggest"
    },
    {
        pos: 7.22,
        ways: "go back and choose antherWay, I suggest"
    },
    {
        pos: 11.24,
        ways: "go left, if you don.t do so, you'll die"
    },
    {
        pos: 11.25,
        ways: "go left, if you don.t do so, you'll die"
    },
    {
        pos: 13.16,
        ways: "go down please"
    },
    {
        pos: 14.16,
        ways: "you.d better go down"
    },
    {
        pos: 15.01,
        ways: "bad luck! go back and choose another way"
    },
    {
        pos: 15.02,
        ways: "bad luck! go back and choose another way"
    },
    {
        pos: 17.07,
        ways: "back back back, and you'll find a true way"
    },
    {
        pos: 18.07,
        ways: "back back back, and you'll find a true way"
    },
    {
        pos: 18.15,
        ways: "go straight and be brave"
    },
    {
        pos: 18.16,
        ways: "go left will be a better choose"
    },
    {
        pos: 24.27,
        ways: "go right way and life will be more easy"
    },
    {
        pos: 24.28,
        ways: "just go straight"
    },
    {
        pos: 26.11,
        ways: "you'd better go back"
    },
    {
        pos: 26.12,
        ways: "there is no way in front of you"
    },
    {
        pos: 33.07,
        ways: "walk down"
    },
    {
        pos: 34.07,
        ways: "straight will be fine"
    },
    {
        pos: 38.08,
        ways: "no way!!! go back!!!"
    },
    {
        pos: 39.08,
        ways: "you'd better go back"
    },
    {
        pos: 42.15,
        ways: "choose right way to go"
    },
    {
        pos: 42.16,
        ways: "go, go, go"
    },
    {
        pos: 45.01,
        ways: "go straight, don't dsseparture route"
    },
    {
        pos: 45.02,
        ways: "you'd better go left way"
    },
];

/*
*游戏地图绘制
*/

//地图 空-e 矩形-r 雷-b
Game.map = [
    'reerrrrrrrrrrrrrrrrrrrrrrrrrrr',
    'reeeereeeeeeeereeqbeeeereeeeor',
    'reeeereeeeeeeereeqeebeereeeeer',
    'reerrreereereereerrrreereerrrr',
    'reeeeeeereereereeeeereeeeeeeer',
    'reeeeeeereerqqreeeeereeeeeeeer',
    'rrrrrrrrrrrrebrrrreerbbrrreeer',
    'reeeereeeeeeeereeeeeeqqreeeeer',
    'reeeoreeeeeeeereeeeeeeereeeeer',
    'rerrrreereereereerrrrrrreerrrr',
    'rereeeeereereeeeeeereeeeeereer',
    'rereeeeereereeeeeeereeeeqqreer',
    'rereerrrreereerrrrrreeerbbreer',
    'reeeereeeeereeeeqbeeeeereeeeer',
    'reeeereeeeereeeeqbeeeeereeeeer',
    'rqqeereerrrrrrrrrreerrrrrrreer',
    'rbbrrreereeeeeeeereereeeeereer',
    'reeeeeeqbeeeeeeebreereeeeereer',
    'reeeeeeqbeerrrrqqeeeeeereeeeer',
    'reerrrrrreereereeeeeeeereeeeer',
    'reeeeeeereereerrrrrrrrrrrrrrrr',
    'reeeeeeereeeeeeeeeeeeeeeeeeeer',
    'reeeeeeereeeeeeeeeeeeeeeeeeeer',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrreer',
    'reeeeeeeeebeereeeeeeeeeeeerqqr',
    'reeeeeeeeebeereeeeeeeeeeeerber',
    'reerrrrrrrrqqreerrrrrrrreeeeer',
    'reereeeeeeeeereeeeeereereeeeer',
    'reereeeeeeeeereeeeeereerrrreer',
    'reereerrrrrrrrrrrreereeeeereer',
    'reereeeeeeeeeeeeeeeereeeeereer',
    'reereeeeeeeeeeeeeeeereeeeereer',
    'reerrrrrrrrrrrrrrrrrreereereer',
    'reereebqeeeeeeeeereeeeereeeeer',
    'reereeeqeeeeeeeeereeeeereeeeer',
    'reeeeereeeeerrreereerrrrrrrrrr',
    'reeeeereeeeeeereereereeeeeeeer',
    'reerrrrrrrrreereereerrrrrrreer',
    'reereereqeereereereeeeeeeeeeer',
    'reeeeereqeeeeereereeeeeeeeeeer',
    'reeeeerbreeeeereerrrrrrrrrreer',
    'rrrreeeerrrrrrrbeeeeeeeeeereer',
    'reeeeeeereeeeeeqqrreeeerrrreer',
    'reeeeeeereeeeeeeereeeeereeeeer',
    'reerrrrrreerrrreerrrreereerrrr',
    'rqqroeeereeeeereeeeerrrreereer',
    'rebreeeerrreeereereeeeeeeeeeer',
    'rebreeeeeeeeeeeeereeeeeeeeeeer',
    'rebreeeeeeeeeeeeereeeeeeeeeeer',
    'reerrrrrrrrrrrrrrrrrrrrrrrrrrr'
];

function drawMap(){
    //填充矩形
    Game.canvasContext.fillStyle = "#cccccc";
    var x = gridWidth + 0.5, y = 0;
    //遍历map
    for(var i = 0; i < Game.map.length; i++){
        x = gridWidth + 0.5;
        for(var j = 1; j < Game.map[i].length; j++){
            //画矩形
            if(Game.map[i][j] === 'r'){
                Game.canvasContext.strokeStyle = "#000";
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
}

/*
*动态调整显示step
*及生命
*/
function changeShowLife(){
    var life = $("#tank-pic img");
    for(var i = 0; i < playerLife; i++){
      life.eq(i).css({visibility: "visible"});
    }
    for (i = playerLife; i < 3; i++){
      life.eq(i).css({visibility: "hidden"});
    }
}


/*
*绘制玩家
*及玩家移动函数
*玩家复活函数
*/
function play(x, y, direct, pos){
    this.x = x;
    this.y = y;
    this.direct = direct;
    this.pos = pos;

    this.moveUp = function(){
        this.pos.i -= 1;
        if(this.pos.i < 0){
            this.pos.i = 0;
        }
        else{
            //判断是否可以往上走
            if(Game.map[this.pos.i][this.pos.j] !== 'r'){
                this.y -= 26;
                //最顶上不能往上再移动
                if(this.y < 0){
                    this.y = 0;
                }
                footStep--;
                
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
            footStep--;
            
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
            footStep--;
            
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
            footStep--;
            
        }
        else{
            this.pos.j += 1;
        }
        this.direct = 3;
        
    }
    this.img = new Image(30, 26);
    this.img.src = "img/player.png";
}

function drawPlayer(player){
    Game.canvasContext.drawImage(player.img, player.x, player.y, 30, 26);
}

//玩家移动
function changeDirect(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var keycode = e.keyCode;
    if(e && !boomsHavBo && Game.map[player.pos.i][player.pos.j] !== 'b' && footStep){  //防止踩雷继续移动
        switch(keycode){
            case 87:
                //踩中问题
                if(Game.map[player.pos.i][player.pos.j] === 'q'){
                    for(var questionNum = 0; questionNum < tips.length; questionNum++){
                        if(tips[questionNum].pos === player.pos.i + 0.01 * player.pos.j){
                            //问题没有回答
                            if(!answered[questionNum]){
                              currentQuestionOrder = questionNum;
                              $('#step-button').trigger("click", [questionNum]);
                            }
                            else{  //已经回答
                              player.moveUp();
                            }
                            break;
                        }
                    }   
                }
                else{
                    player.moveUp();
                }
                break;
            case 68:
                //踩中问题
                if(Game.map[player.pos.i][player.pos.j] === 'q'){
                    for(var questionNum = 0; questionNum < tips.length; questionNum++){
                        if(tips[questionNum].pos === player.pos.i + 0.01 * player.pos.j){
                          console.log("qn", tips[questionNum].pos);
                            //问题没有回答
                            console.log("I am condition 1, the quesNum is", questionNum);
                            if(!answered[questionNum]){
                              currentQuestionOrder = questionNum;
                              $('#step-button').trigger("click", [questionNum]);
                            }
                          else{
                            console.log("I am condition 2, the quesNum is", questionNum);
                            player.moveRight();
                          }
                          break;
                        }
                    }   
                }
                else{
                    player.moveRight();
                }
                break;
            case 83:
                //踩中问题
                if(Game.map[player.pos.i][player.pos.j] === 'q'){
                    for(var questionNum = 0; questionNum < tips.length; questionNum++){
                        if(tips[questionNum].pos === player.pos.i + 0.01 * player.pos.j){
                             //问题没有回答
                            if(!answered[questionNum]){
                              currentQuestionOrder = questionNum;
                              $('#step-button').trigger("click", [questionNum]);
                            }
                          else{
                            player.moveBottom();
                          }
                          break;
                        }
                    }   
                }
                else{
                    player.moveBottom();
                }
                console.log("I am down.");
                break;
            case 65:
            //踩中问题
                if(Game.map[player.pos.i][player.pos.j] === 'q'){
                    for(var questionNum = 0; questionNum < tips.length; questionNum++){
                        if(tips[questionNum].pos === player.pos.i + 0.01 * player.pos.j){
                             //问题没有回答
                            if(!answered[questionNum]){
                              currentQuestionOrder = questionNum;
                              $('#step-button').trigger("click", [questionNum]);
                            }
                            else{
                              player.moveLeft();
                            }
                            break;
                        }
                    }   
                }
                else{
                    player.moveLeft();
                }
                break;
            default:
                break;
        }
    }
}

//复活玩家
function alivePlayer(){
    if(player.direct === 0){  //up
        player.y += gridHeight;
        player.pos.i += 1;
    }
    else if(player.direct === 1){ //right
        player.x -= gridWidth;
        player.pos.j -= 1;
    }
    else if(player.direct === 2){ //bottom
        player.y -= gridHeight;
        player.pos.i -= 1;
    }
    else if(player.direct === 3){ //left
        player.x += gridWidth;
        player.pos.j += 1;
    }
    playerAlive = true;
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
    Game.canvasContext.translate(player.pos.j * 30 + 15, player.pos.i * 26 + 13);   
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
    player.pos.i = 0;
    player.pos.j = 1;
    player.x = 30.5;
    player.y = 0;
    playerLife = 3;
    playAgain = false;
    playerAlive = true;
    for (var i = 0; i < answered.length; i++){
      answered[i] = false;
    }
    document.onkeydown = changeDirect; //键盘事件
    
    changeShowLife();
    setTimeout(Game.mainLoop, 500);
};

Game.gameOver = function(){
    //gameover
  $("#loser-button").trigger("click");
  console.log("I lost all my lives.");
}

Game.gameWin = function(){
   //game wind
  $("#winner-button").trigger("click");
}

Game.update = function(){
	//更新事件
    //踩到雷，播放音乐及爆炸特效
    if(playerAlive){
        if(Game.map[player.pos.i][player.pos.j] === 'b' && !boomsHavBo){
            boomsHavBo = true;
            playerLife--;
            changeShowLife();
        }
    }
};

Game.draw = function(){
    //画游戏地图dd
    drawMap();  
    //判断是否画爆炸效果
    if(boomsHavBo){
        boom.boomMusic.play();
        drawExplode();
        playerAlive = false;
        boomsHavBo = false;
        //如果tank还有命，2秒后复活
        if(playerLife){
            setTimeout(alivePlayer, 1000);
        }
        else{
            Game.gameOver();
        }
    }
    if(playerAlive){
        drawPlayer(player);
    }  
};

Game.clearCanvas = function(){
	Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.mainLoop = function(){
	Game.clearCanvas();
	Game.update();
	Game.draw();
     //胜利
    if(player.pos.i > 48){
       Game.gameWin();
     } 
     else{
     setTimeout(Game.mainLoop, 1000 / Game.ftps);
    }
};


document.addEventListener("DOMContentLoaded", Game.start);