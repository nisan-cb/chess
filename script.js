//please start from init function
let table;
let boardData;
const ROWS = 8;
const COLS = 8;
let currentPiece;

class BoardData {
    constructor(rows, cols, tableElement) {
        this.matrix = Array(rows).fill().map(() => Array(cols).fill());
        this.table = tableElement;
        this.whiteGroup = {};
        this.blackGroup = {};
        this.createGroup('white', this.whiteGroup); // create white group
        this.createGroup('black', this.blackGroup); // create black group
        this.turn = 'white';
    }
    getCellData(r, c) {
        return this.matrix[r][c];
    }
    insertPiece(pice) {
        this.matrix[pice.r][pice.c] = pice;
    }
    createGroup(color, group) {    // insert piece into group with starting positions
        let k = 0;
        if (color == 'black') k = 7;
        group["king"] = new King(color, k, 4);
        group["queen"] = new Queen(color, k, 3);
        group["rookL"] = new Rook(color, k, 0);
        group["rookR"] = new Rook(color, k, 7);
        group["bishopL"] = new Bishop(color, k, 2);
        group["bishopR"] = new Bishop(color, k, 5);
        group["knightL"] = new Knight(color, k, 1);
        group["knightR"] = new Knight(color, k, 6);
        k = 1;
        if (color == 'black') k = 6;
        for (let i = 0; i < 8; i++)
            group[`pawn${i}`] = new Pawn(color, k, i);
    }
    placeAllSoldiers() {
        this.placeSoldiers(this.whiteGroup); // place white pices on the board
        this.placeSoldiers(this.blackGroup);// place black pices on the board
    }
    placeSoldiers(group) { //in matrix & into HTML table
        for (let key in group) {
            boardData.insertPiece(group[key]);// into matrix
            group[key].display(table);// into HTML table
        }
    }
    displayPosibalMoves(currentPiece) {
        for (let step of currentPiece.optionalSteps) {
            table.rows[step[0]].cells[step[1]].classList.add("step");
            table.rows[step[0]].cells[step[1]].addEventListener('click', this.validMovesHandler);
        }
        table.rows[currentPiece.r].cells[currentPiece.c].classList.add('selected');
    }
    validMovesHandler(e) {
        e.stopPropagation();
        let cell = e.target;
        let new_c = cell.cellIndex, new_r = cell.parentNode.rowIndex; // get new indexes
        boardData.cleanValidSteps();
        boardData.freePosition(currentPiece); // in matrix and in table element
        boardData.matrix[new_r][new_c] = currentPiece; // set into the matrix new position
        currentPiece.setLocation(new_r, new_c); // updet new indexes in the currentPiece
        boardData.table.rows[currentPiece.r].cells[currentPiece.c].appendChild(currentPiece.el);
        boardData.switchTurn();
        if (currentPiece.constructor.name === 'Pawn') currentPiece.firstStep = false;
        currentPiece = undefined;
    }
    cleanValidSteps() { // clean step of prev piece from the board
        if (!currentPiece) return;
        for (let step of currentPiece.optionalSteps) {
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
            this.table.rows[step[0]].cells[step[1]].removeEventListener('click', this.validMovesHandler);
        }
        this.table.rows[currentPiece.r].cells[currentPiece.c].classList.remove('selected'); // 
    }
    switchTurn() {
        document.getElementById(`${this.turn}-flag`).classList.remove('turn');
        this.turn = (this.turn === 'white') ? 'black' : 'white';
        document.getElementById(`${this.turn}-flag`).classList.add('turn');
    }
    kill(piece) {
        this.freePosition(currentPiece);
        this.freePosition(piece);
        boardData.cleanValidSteps();
        currentPiece.setLocation(piece.r, piece.c);
        currentPiece.display(this.table);
        currentPiece = undefined;
    }
    freePosition(piece) {
        this.matrix[piece.r][piece.c] = undefined; //remove from matrix
        this.table.rows[piece.r].cells[piece.c].innerHTML = ''; //remove from table element
    }
}

class Piece {
    constructor(color, role, r = 0, c = 0) {
        this.color = color;
        this.src = `./images/${color}_${role}.png`;
        this.el = document.createElement('img');
        this.el.src = this.src;
        this.r = r;
        this.c = c;
        this.optionalSteps = []; // optional valid steps
        this.el.addEventListener('click', (e) => {
            // if (boardData.turn !== this.color) { alert(`it is ${boardData.turn} turn to play`); return };
            if (this.isInDanger()) {
                boardData.kill(this);
            } else {
                boardData.cleanValidSteps();
                currentPiece = this;
                this.calcOptionalSteps();
                boardData.displayPosibalMoves(this);
            }
        })
        this.el.addEventListener("mouseover", (e) => {
            this.calcOptionalSteps();
            if (this.optionalSteps.length === 0)
                this.el.style.cursor = 'not-allowed';
            else if (this.isInDanger()) {
                this.el.style.cursor = 'grab';
            } else
                this.el.style.cursor = 'pointer';
        })
    }
    isInDanger() {
        if (!currentPiece) return false;
        for (const cell of currentPiece.optionalSteps)
            if (this.r === cell[0] && this.c === cell[1])
                return true;
        return false;
    }
    display(table) {
        table.rows[this.r].cells[this.c].appendChild(this.el);
    }
    setLocation(r, c) {
        this.r = r;
        this.c = c;
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        for (let direction of this.directions)
            this.checkPath(direction[0], direction[1]);
    }
    checkPath(i, j) { // i and j indicate direction as up/down/left/right/diagonal...
        let r = this.r + i, c = this.c + j;
        for (; r >= 0 && r < ROWS && c >= 0 && c < COLS; r += i, c += j) {
            let cellData = boardData.getCellData(r, c);
            if (cellData == undefined)
                this.optionalSteps.push([r, c]);
            else { // if cell not empty
                if (cellData.color !== this.color)
                    this.optionalSteps.push([r, c]);
                break;
            }
        }
    }
}
class King extends Piece {
    constructor(color, r = 0, c = 0) {
        super(color, 'king', r, c);
        this.vector = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
    calcOptionalSteps(e) {
        this.optionalSteps = [];
        for (let step of this.vector) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c >= 0 && new_c < 8) {
                let cellData = boardData.getCellData(new_r, new_c);
                if (cellData == undefined || cellData.color !== this.color)
                    this.optionalSteps.push([new_r, new_c]);
            }
        }
    }
}
class Queen extends Piece {
    constructor(color, r = 0, c = 0) {
        super(color, 'queen', r, c)
        this.directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
}
class Rook extends Piece {
    constructor(color, r = 0, c = 0) {
        super(color, 'rook', r, c)
        this.directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    }
}
class Bishop extends Piece {
    constructor(color, r = 0, c = 0) {
        super(color, 'bishop', r, c)
        this.directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    }
}
class Knight extends Piece {
    constructor(color, r = 0, c = 0) {
        super(color, 'knight', r, c)
        this.moves = [[-1, 2], [-1, -2], [1, 2], [1, - 2], [-2, 1], [-2, -1], [2, 1], [2, -1]];
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        for (let step of this.moves) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c >= 0 && new_c < 8) {
                let cellData = boardData.getCellData(new_r, new_c);
                if (cellData === undefined || cellData.color !== this.color)
                    this.optionalSteps.push([new_r, new_c]);
            }
        }
    }
}
class Pawn extends Piece {
    constructor(color, r = 0, c = 0) {
        super(color, 'pawn', r, c)
        this.d = (color === 'black') ? -1 : 1;
        this.firstStep = true;
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        let new_r = this.r + this.d;
        if (new_r >= ROWS || new_r < 0) return;
        let cellData = boardData.getCellData(new_r, this.c);
        if (cellData == undefined) {
            this.optionalSteps.push([new_r, this.c]);
            let twoStepsCellData = boardData.getCellData(new_r + this.d, this.c)
            if (this.firstStep && twoStepsCellData === undefined)
                this.optionalSteps.push([new_r + this.d, this.c]);
        }
        let upLeftCell = boardData.getCellData(new_r, this.c - 1);
        let upRightCell = boardData.getCellData(new_r, this.c + 1);
        if (upLeftCell !== undefined && upLeftCell.color !== this.color)
            this.optionalSteps.push([new_r, this.c - 1]);
        if (upRightCell !== undefined && upRightCell.color !== this.color)
            this.optionalSteps.push([new_r, this.c + 1]);
    }
}

function createBoard() {
    let areaObj = document.getElementById('board-box');
    if (!areaObj) {
        console.log("error in createBord function - areaObj not defined");
        return;
    }
    areaObj.innerHTML = "";
    let table = document.createElement('table');
    table.setAttribute('id', 'board');
    areaObj.appendChild(table);
    for (let i = 0; i < ROWS; i++) {
        let tr = table.insertRow();
        for (let j = 0; j < COLS; j++) {
            let td = tr.insertCell();
        }
    }
    return table;
}

const init = () => {
    console.log("hello from init funcion ");
    table = createBoard(); // create board and return table HTML elemnt
    boardData = new BoardData(ROWS, COLS, table);
    boardData.placeAllSoldiers();// place all pieces on the board
}

window.addEventListener('load', () => {
    console.log('page is fully loaded');
    init();
});

//269