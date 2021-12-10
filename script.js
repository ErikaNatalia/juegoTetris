//Size of the square
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;
const EMPTY = "#EFEFEF";
//Variable of board
let canvas;
//Variable of conext
let ctx;
//FPS
const FPS = 50;
 
//Draw the sq
function drawSq(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x*BLOCK_SIZE, y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
}

//Create the board
let board = [];
for(r = 0; r < ROWS; r++){
    board[r] = [];
    for(c = 0; c < COLS; c++){
        board[r][c] = EMPTY;
    }
}

//Draw the board
function drawBoard(){
    for(r = 0; r < ROWS; r++){
        for(c = 0; c < COLS; c++){
            drawSq(c,r,board[r][c])
        }
    } 
}

//Define the pieces
const I = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const O = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]
];

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];

//Array with pieces and their colors
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

//Generate random pieces
let p = function randomPiece(){
    let ranPiece = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[ranPiece][0], PIECES[ranPiece][1])
}

//The object piece
function Piece(figure,color){
    this.figure = figure;
    this.color = color;

    //We start from the first pattern
    this.figureN = 0;
    this.actFigure = this.figure[this.figureN];

    //We need to establish the piece position
    this.x = 3;
    this.y = -2; //This y hide the piece
}

//fill function
Piece.prototype.fill = function(color){
    for(r = 0; r < this.actFigure.length; r++){
        for(c = 0; c < this.actFigure.length; c++){
            //We draw only the occupied sq
            if(this.actFigure[r][c]){
                drawSq(this.x + c, this.y + r, color);
            }
        }
    }
}

//Draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color);
}

//Undraw a piece
Piece.prototype.unDraw = function(){
    this.fill(EMPTY);
}

//Move down the piece
Piece.prototype.moveDown = function(){
    if (!this.collision(0,1,this.actFigure)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        //We look the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}
//Move right the piece
Piece.prototype.moveRight = function(){
    if (!this.collision(1,0,this.actFigure)) {
        this.unDraw();
        this.y++;
        this.draw();
    }
}
//Move left the piece
Piece.prototype.moveLeft = function(){
    if (!this.collision(-1,0,this.actFigure)) {
        this.unDraw();
        this.y++;
        this.draw();
    }
}
//Rotate the piece
Piece.prototype.rotate = function(){
    let nextPat = this.figure[(this.figureN + 1)%this.figure.length];
    let kick = 0;

    if (this.collision(0,0,nextPat)) {
        
    } else {
        
    }
}









//The pieces and their

//This function start all
function start(){
    canvas = document.getElementById("canva")
    ctx = canvas.getContext('2d')
    drawBoard();
}

