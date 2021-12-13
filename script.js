let canvas = document.getElementById("canva")
let ctx = canvas.getContext('2d')

//Size of the square
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;
const EMPTY = "#EFEFEF";
//Variable of Score
const scoreElement = document.getElementById("score");
//Variable of board
//let canvas;
//Variable of conext
//let ctx;
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
drawBoard();

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
function randomPiece(){
    let ranPiece = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[ranPiece][0], PIECES[ranPiece][1])
}

let p = randomPiece();

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
        this.x++;
        this.draw();
    }
}
//Move left the piece
Piece.prototype.moveLeft = function(){
    if (!this.collision(-1,0,this.actFigure)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}
//Rotate the piece
Piece.prototype.rotate = function(){
    let nextPat = this.figure[(this.figureN + 1)%this.figure.length];
    let kick = 0;

    if (this.collision(0,0,nextPat)) {
		if (this.x < COLS/2) {
			kick = -1; //We need to move the piece to the left
		} else {
			kick = 1; //We need to move the piece to the right
		}
	}

	if(!this.collision(kick, 0, nextPat)){
		this.unDraw();
		this.x += kick;
		this.figureN = (this.figureN + 1)%this.figure.length;
		this.actFigure = this.figure[this.figureN];
		this.draw();
	}
}

let score = 0;

Piece.prototype.lock = function(){
	for(r = 0; r < this.actFigure.length; r++){
		for(c = 0; c < this.actFigure.length; c++){
			//We skip the empty sq
			if (!this.actFigure[r][c]) {
				continue;
			}
			// pieces to lock on top = game over
			if (this.y + r < 0) {
				alert("Game Over");
				//Stop request animation frame
				gameOver = true;
				break;		
			}

			//We lock the piece
			board[this.y + r][this.x + c] = this.color;
		}
	}

	//Remove full rows
	for(r = 0; r < ROWS; r++){
		let isRowFull = true;
		for(c = 0; c < COLS; c++){
			isRowFull = isRowFull && (board[r][c] != EMPTY); 
		}
		if (isRowFull) {
			// if the row is full
            // we move down all the rows above it
			for (y  = r; y > 1; y--) {
				for( c = 0; c < COLS; c++){
                    board[y][c] = board[y-1][c];
                }
			}
			 // the top row board[0][..] has no row above it
			for(c = 0; c < COLS; c++){
                board[0][c] = EMPTY;
            }
            // increment the score
            score += 10;
		}
	}
	// update the board
    drawBoard();
    
    // update the score
    scoreElement.innerHTML = score;
}

// collision function
Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= COLS || newY >= ROWS) {
                return true;
            }
            // skip newY < 0; board -1 will crush our game
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece alrady in place
            if (board[newY][newX] != EMPTY) {
                return true;
            }
        }
    }
    return false;
}

// Control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.key == "ArrowLeft") {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.key == "ArrowUp") {
        p.rotate();
        dropStart = Date.now();
    } else if (event.key == "ArrowRight") {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.key == "ArrowDown") {
        p.moveDown();
    }
}

//Drop the piece every 1sec
let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}
drop();
//The pieces and their

//This function start all
/*function start(){
    canvas = document.getElementById("canva")
    ctx = canvas.getContext('2d')
    drawBoard();
	drop();
}*/

