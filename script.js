let section1;
let table;
const ROWS = 8;
const COLS = 8;
let matrix = Array(ROWS).fill().map(() => Array(COLS).fill())
let whiteGroup = {};
let blackGroup = {};

class Piece {
    constructor(color, role) {
        this.color = color;
        this.src = `./images/${color}_${role}.png`;
        this.el = document.createElement('img');
        this.el.setAttribute('src', this.src);
        this.r = 0;
        this.c = 0;
    }
    disyplay(table) {
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
    }
}
class Knight extends Piece {
    constructor(color) {
        super(color, 'knight')
    }
}
class Pawn extends Piece {
    constructor(color) {
        super(color, 'pawn')
    }
}

function cleanAllCells() {      // 
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
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

function placeSoldiers(group) { //in matrix & into HTML table
    for (let key in group) {
        group[key].disyplay(table);
        group[key].insertIntoMatrix(matrix);
    }
    console.log(matrix);
}

function createBoard(areaObj) {
    if (!areaObj) {
        console.log("error in createBord function - areaObj not defined");
        return;
    }
    table = document.createElement('table');
    table.setAttribute('id', 'board');
    areaObj.appendChild(table);
    for (let i = 0; i < ROWS; i++) {
        let tr = table.insertRow();
        for (let j = 0; j < COLS; j++) {
            let td = tr.insertCell();
            td.addEventListener('click', (e) => {
                e.stopPropagation();
                cleanAllCells();
                console.log("clicked");
                td.classList.add('checked');
            });
        }
    }
}
const init = () => {
    console.log("hello from init funcion ");
    createGroups();
    createBoard(document.getElementById('section1'));
    placeSoldiers(whiteGroup);
    placeSoldiers(blackGroup);
}

window.addEventListener('load', () => {
    console.log('page is fully loaded');
    init();
});

