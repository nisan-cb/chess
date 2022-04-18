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
    }
}
class Rook extends Piece {
    constructor(color) {
        super(color, 'rook')
    }
}
class Bishop extends Piece {
    constructor(color) {
        super(color, 'bishop')
        this.el.addEventListener('click', (e) => { this.displayValidSteps(e) })
    }
    displayValidSteps(e) {
        e.stopPropagation();
        cleanValidStepsMatrix();
        currentPiece = this;
        let new_r = this.r, new_c = this.c;
        for (let i = 1; i + this.r < ROWS && i + this.c < COLS; i++) {
            validStepsMatrix[this.r + i][this.c + i] = 1;
        }
        for (let i = 1; this.r - i >= 0 && this.c - i >= 0; i++) {
            validStepsMatrix[this.r - i][this.c - i] = 1;
        }
        for (let i = 1; this.r - i >= 0 && this.c + i < COLS; i++) {
            validStepsMatrix[this.r - i][this.c + i] = 1;
        }
        for (let i = 1; this.r + i < ROWS && this.c - i >= 0; i++) {
            validStepsMatrix[this.r + i][this.c - i] = 1;
        }
        displayMatrix();
    }
}
class Knight extends Piece {
    constructor(color) {
        super(color, 'knight')
        this.vector = [[-1, 2], [-1, -2], [1, 2], [1, - 2], [-2, 1], [-2, -1], [2, 1], [2, -1]];
        // this.vector = [1, 2, 3];
        this.el.addEventListener('click', (e) => { this.displayValidSteps(e) });
    }
    displayValidSteps(e) {
        e.stopPropagation();
        cleanValidStepsMatrix();
        currentPiece = this;
        console.log(this.vector[0]);
        for (let step of this.vector) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c >= 0 && new_c < 8)
                validStepsMatrix[new_r][new_c] = 1;
        }
        displayMatrix();

    }
}
class Pawn extends Piece {
    constructor(color) {
        super(color, 'pawn')
        this.d = (color === 'black') ? -1 : 1;
        this.validSteps = [[]];
        this.el.addEventListener('click', (e) => { this.displayValidSteps(e); });
    }
    displayValidSteps(e) {
        e.stopPropagation();
        cleanValidStepsMatrix();
        currentPiece = this;
        let new_r = this.r + this.d;
        if (new_r >= 0 && new_r < 8) {
            validStepsMatrix[new_r][this.c] = 1;
            console.log("hh");
        }
        displayMatrix();
    }
}
function displayMatrix() {
    let i, j;
    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            table.rows[i].cells[j].classList.remove('checked');
            table.rows[i].cells[j].innerHTML = "";
            if (validStepsMatrix[i][j] === 1) {
                table.rows[i].cells[j].classList.add("checked");
                table.rows[i].cells[j].addEventListener('click', validMoveHandler);
            }
            try {
                matrix[i][j].display(table);
            } catch (error) {
            }
        }
    }
    if (currentPiece !== undefined)
        table.rows[currentPiece.r].cells[currentPiece.c].classList.add('checked');
}

function validMoveHandler(e) {
    let cell = e.target;
    let new_c = cell.cellIndex, new_r = cell.parentNode.rowIndex; // get new indexes
    console.log(currentPiece);
    matrix[currentPiece.r][currentPiece.c] = undefined; // free the prev position
    console.log(currentPiece);
    console.log("valid steps matrix", validStepsMatrix);
    matrix[new_r][new_c] = currentPiece; // set into the matrix new position
    currentPiece.setLocation(new_r, new_c); // updet new indexes in the OBJ

    console.log(matrix);
    currentPiece = undefined;
    cleanValidStepsMatrix();
    displayMatrix();


}

function cleanValidStepsMatrix() {      // 
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            validStepsMatrix[i][j] = undefined;
            // if (currentPiece) {
            console.log("test");
            table.rows[i].cells[j].removeEventListener('click', validMoveHandler);
            // table.rows[i].cells[j].innerHTML = "111";
            // }
        }
    }
}
function cleanTheBoard() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            table.rows[i].cells[j].innerHTML = "";
            table.rows[i].cells[j].classList.remove('checked');
        }
    }
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
    cleanTheBoard(); // clean the board befor
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
    console.log(matrix);
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