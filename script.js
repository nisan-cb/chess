//please start from init function
let section1;
let table;
const ROWS = 8;
const COLS = 8;
let matrix = Array(ROWS).fill().map(() => Array(COLS).fill());
let validStepsMatrix = Array(ROWS).fill().map(() => Array(COLS).fill());
let whiteGroup = {};
let blackGroup = {};
let currentPiece;

class Piece {
    constructor(color, role) {
        this.color = color;
        this.src = `./images/${color}_${role}.png`;
        this.el = document.createElement('img');
        // this.el.setAttribute('src', this.src);
        this.el.src = this.src;
        this.r = 0;
        this.c = 0;
        this.validSteps = [];
    }
    display(table) {
        table.rows[this.r].cells[this.c].appendChild(this.el);
    }
    insertIntoMatrix(matrix) {
        matrix[this.r][this.c] = this;
    }
    setLocation(r, c) {
        this.r = r;
        this.c = c;
    }
}
class King extends Piece {
    constructor(color) {
        super(color, 'king');
    }
}
class Queen extends Piece {
    constructor(color) {
        super(color, 'queen')
        this.el.addEventListener('click', (e) => { this.calcValidSteps(e) });
    }
    calcValidSteps(e) {
        this.validSteps = [];
        e.stopPropagation();
        cleanValidSteps();
        currentPiece = this;
        // for(i=1;i<ROWS;i++)
        // this.validSteps.push()
    }
}
class Rook extends Piece {
    constructor(color) {
        super(color, 'rook')
        this.el.addEventListener('click', (e) => { this.calcValidSteps(e) });
    }
    calcValidSteps(e) {
        this.validSteps = [];
        e.stopPropagation();
        cleanValidSteps();
        currentPiece = this;
        for (let i = 0; i < ROWS; i++)
            this.validSteps.push([i, this.c]);
        for (let j = 0; j < ROWS; j++)
            this.validSteps.push([this.r, j]);
        displayValidSteps();
    }
}
class Bishop extends Piece {
    constructor(color) {
        super(color, 'bishop')
        this.el.addEventListener('click', (e) => { this.calcValidSteps(e) })
    }
    calcValidSteps(e) {
        this.validSteps = [];
        e.stopPropagation();
        cleanValidSteps();
        currentPiece = this;
        for (let i = 1; i + this.r < ROWS && i + this.c < COLS; i++) {
            this.validSteps.push([this.r + i, this.c + i]);
        }
        for (let i = 1; this.r - i >= 0 && this.c - i >= 0; i++) {
            this.validSteps.push([this.r - i, this.c - i]);
        }
        for (let i = 1; this.r - i >= 0 && this.c + i < COLS; i++) {
            this.validSteps.push([this.r - i, this.c + i]);
        }
        for (let i = 1; this.r + i < ROWS && this.c - i >= 0; i++) {
            this.validSteps.push([this.r + i, this.c - i]);
        }
        displayValidSteps();
    }
}
class Knight extends Piece {
    constructor(color) {
        super(color, 'knight')
        this.vector = [[-1, 2], [-1, -2], [1, 2], [1, - 2], [-2, 1], [-2, -1], [2, 1], [2, -1]];
        this.el.addEventListener('click', (e) => { this.calcValidSteps(e) });
    }
    calcValidSteps(e) {
        this.validSteps = [];
        e.stopPropagation();
        cleanValidSteps();
        currentPiece = this;
        for (let step of this.vector) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c >= 0 && new_c < 8)
                this.validSteps.push([new_r, new_c]);
        }
        console.log(this.calcValidSteps);
        displayValidSteps();
    }
}
function validStepsFunc() {

}
class Pawn extends Piece {
    constructor(color) {
        super(color, 'pawn')
        this.d = (color === 'black') ? -1 : 1;
        this.el.addEventListener('click', (e) => { this.calcValidSteps(e); });
    }
    calcValidSteps(e) {
        this.validSteps = [];
        e.stopPropagation();
        cleanValidSteps();
        currentPiece = this;
        let new_r = this.r + this.d;
        if (new_r >= 0 && new_r < 8) {
            this.validSteps.push([new_r, this.c]);
        }
        displayValidSteps();
    }
}
function displayValidSteps() {
    for (let step of currentPiece.validSteps) {
        table.rows[step[0]].cells[step[1]].classList.add("checked");
        table.rows[step[0]].cells[step[1]].addEventListener('click', validMoveHandler);
    }
    if (currentPiece !== undefined)
        table.rows[currentPiece.r].cells[currentPiece.c].classList.add('checked');
}

function validMoveHandler(e) {
    let cell = e.target;
    let new_c = cell.cellIndex, new_r = cell.parentNode.rowIndex; // get new indexes
    matrix[currentPiece.r][currentPiece.c] = undefined; // free the prev position
    table.rows[currentPiece.r].cells[currentPiece.c].innerHTML = ''; // remove piece from prev cell
    table.rows[currentPiece.r].cells[currentPiece.c].classList.remove('checked'); // 
    matrix[new_r][new_c] = currentPiece; // set into the matrix new position
    currentPiece.setLocation(new_r, new_c); // updet new indexes in the OBJ
    table.rows[currentPiece.r].cells[currentPiece.c].appendChild(currentPiece.el);
    cleanValidSteps();
}

function cleanValidSteps() { // clean step of prev piece from the board
    if (!currentPiece) return;
    for (let step of currentPiece.validSteps) {
        table.rows[step[0]].cells[step[1]].classList.remove('checked');
        table.rows[step[0]].cells[step[1]].removeEventListener('click', validMoveHandler);
    }
    table.rows[currentPiece.r].cells[currentPiece.c].classList.remove('checked');
}

function createGroups() {
    createGroup('white', whiteGroup);
    createGroup('black', blackGroup);
}
function createGroup(color, group) {    // insert to group all the soldiers
    let k = 0;
    if (color == 'black') k = 7;
    group["king"] = new King(color); group["king"].setLocation(k, 4);
    group["queen"] = new Queen(color); group["queen"].setLocation(k, 3);
    group["rookL"] = new Rook(color); group["rookL"].setLocation(k, 0);
    group["rookR"] = new Rook(color); group["rookR"].setLocation(k, 7);
    group["bishopL"] = new Bishop(color); group["bishopL"].setLocation(k, 2);
    group["bishopR"] = new Bishop(color); group["bishopR"].setLocation(k, 5);
    group["knightL"] = new Knight(color); group["knightL"].setLocation(k, 1);
    group["knightR"] = new Knight(color); group["knightR"].setLocation(k, 6);
    k = 1;
    if (color == 'black') k = 6;
    for (let i = 0; i < 8; i++) {
        group[`pawn${i}`] = new Pawn(color);
        group[`pawn${i}`].setLocation(k, i);
    }
}
function placeAllSoldiers() {
    placeSoldiers(whiteGroup); // place white pices on the board
    placeSoldiers(blackGroup);// place black pices on the board
}
function placeSoldiers(group) { //in matrix & into HTML table
    for (let key in group) {
        if (group[key] !== undefined) {
            group[key].insertIntoMatrix(matrix);
            group[key].display(table);
        }
    }
}
function createBoard() {
    let areaObj = document.getElementById('board-box');
    if (!areaObj) {
        console.log("error in createBord function - areaObj not defined");
        return;
    }
    areaObj.innerHTML = "";
    table = document.createElement('table');
    table.setAttribute('id', 'board');
    areaObj.appendChild(table);
    for (let i = 0; i < ROWS; i++) {
        let tr = table.insertRow();
        for (let j = 0; j < COLS; j++) {
            let td = tr.insertCell();
        }
    }
}

const init = () => {
    console.log("hello from init funcion ");
    createGroups(); // creating black group and white group
    createBoard(); // create board
    placeAllSoldiers();
}

window.addEventListener('load', () => {
    console.log('page is fully loaded');
    init();
});