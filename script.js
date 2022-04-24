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
    placeAllSoldiers() {
        this.placeSoldiers(this.whiteGroup); // place white pices on the board
        this.placeSoldiers(this.blackGroup);// place black pices on the board
    }
    placeSoldiers(group) { //in matrix & into HTML table
        for (let key in group) {
            if (group[key] !== undefined) {
                boardData.insertPiece(group[key]);// into matrix
                group[key].display(table);// into HTML table
            }
        }
    }
    displayStepsOf(currentPiece) {
        for (let step of currentPiece.optionalSteps) {
            table.rows[step[0]].cells[step[1]].classList.add("checked");
            table.rows[step[0]].cells[step[1]].addEventListener('click', this.validMovesHandler);
        }
        if (currentPiece !== undefined)
            table.rows[currentPiece.r].cells[currentPiece.c].classList.add('checked');
    }
    validMovesHandler(e) {
        e.stopPropagation();
        let cell = e.target;
        let new_c = cell.cellIndex, new_r = cell.parentNode.rowIndex; // get new indexes
        boardData.matrix[currentPiece.r][currentPiece.c] = undefined; // free the prev position
        boardData.matrix[new_r][new_c] = currentPiece; // set into the matrix new position
        boardData.table.rows[currentPiece.r].cells[currentPiece.c].classList.remove('checked'); // 
        boardData.table.rows[currentPiece.r].cells[currentPiece.c].innerHTML = ''; // remove piece from prev cell
        currentPiece.setLocation(new_r, new_c); // updet new indexes in the currentPiece
        boardData.table.rows[currentPiece.r].cells[currentPiece.c].appendChild(currentPiece.el);
        boardData.cleanValidSteps();
        boardData.switchTurn();
        if (currentPiece.constructor.name === 'Pawn') currentPiece.firstStep = false;
        currentPiece = undefined;
    }
    cleanValidSteps() { // clean step of prev piece from the board
        if (!currentPiece) return;
        for (let step of currentPiece.optionalSteps) {
            this.table.rows[step[0]].cells[step[1]].classList.remove('checked');
            this.table.rows[step[0]].cells[step[1]].removeEventListener('click', this.validMovesHandler);
        }
        this.table.rows[currentPiece.r].cells[currentPiece.c].classList.remove('checked');
    }
    switchTurn() {
        document.getElementById(`${this.turn}-flag`).classList.remove('turn');
        this.turn = (this.turn === 'white') ? 'black' : 'white';
        document.getElementById(`${this.turn}-flag`).classList.add('turn');

    }
}

class Piece {
    constructor(color, role) {
        this.color = color;
        this.src = `./images/${color}_${role}.png`;
        this.el = document.createElement('img');
        this.el.src = this.src;
        this.r = 0;
        this.c = 0;
        this.optionalSteps = []; // optional valid steps
        this.el.addEventListener('click', (e) => {
            if (boardData.turn !== this.color) { alert(`it is ${boardData.turn} turn to play`); return };
            e.stopPropagation();
            boardData.cleanValidSteps();
            currentPiece = this;
            this.calcOptionalSteps();
            boardData.displayStepsOf(this);
        })
        this.el.addEventListener("mouseover", (e) => {
            this.calcOptionalSteps();
            if (this.optionalSteps.length === 0)
                this.el.style.cursor = 'not-allowed';
            else
                this.el.style.cursor = 'pointer';
        })
    }
    display(table) {
        table.rows[this.r].cells[this.c].appendChild(this.el);
    }
    setLocation(r, c) {
        this.r = r;
        this.c = c;
    }
    checkPath(i, j) {
        let r = this.r + i, c = this.c + j;
        for (; r >= 0 && r < ROWS && c >= 0 && c < COLS; r += i, c += j) {
            let cellData = boardData.getCellData(r, c);
            if (cellData == undefined)
                this.optionalSteps.push([r, c]);
            else if (cellData.color === this.color)
                break;
            else if (cellData.color !== this.color) {
                this.optionalSteps.push([r, c]);
                break;
            }
        }
    }
}
class King extends Piece {
    constructor(color) {
        super(color, 'king');
        this.vector = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
    calcOptionalSteps(e) {
        this.optionalSteps = [];
        for (let step of this.vector) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c >= 0 && new_c < 8) {
                let cellData = boardData.getCellData(new_r, new_c);
                if (cellData == undefined)
                    this.optionalSteps.push([new_r, new_c]);
                else if (cellData.color !== this.color) {
                    this.optionalSteps.push([new_r, new_c]);
                }
            }
        }

    }
}
class Queen extends Piece {
    constructor(color) {
        super(color, 'queen')
        this.directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        for (let direction of this.directions) {
            this.checkPath(direction[0], direction[1]);
        }
    }
}
class Rook extends Piece {
    constructor(color) {
        super(color, 'rook')
        this.directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    }
    calcOptionalSteps(e) {
        this.optionalSteps = [];
        for (let direction of this.directions) {
            this.checkPath(direction[0], direction[1]);
        }
    }
}
class Bishop extends Piece {
    constructor(color) {
        super(color, 'bishop')
        this.directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    }
    calcOptionalSteps(e) {
        this.optionalSteps = [];
        for (let direction of this.directions) {
            this.checkPath(direction[0], direction[1]);
        }
    }
}
class Knight extends Piece {
    constructor(color) {
        super(color, 'knight')
        this.vector = [[-1, 2], [-1, -2], [1, 2], [1, - 2], [-2, 1], [-2, -1], [2, 1], [2, -1]];
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        for (let step of this.vector) {
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
    constructor(color) {
        super(color, 'pawn')
        this.d = (color === 'black') ? -1 : 1;
        this.firstStep = true;
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        let new_r = this.r + this.d;
        let cellData = boardData.getCellData(new_r, this.c);
        if (cellData == undefined) {
            this.optionalSteps.push([new_r, this.c]);
            let twoStepsCellData = boardData.getCellData(new_r + this.d, this.c)
            if (this.firstStep && (twoStepsCellData == undefined || twoStepsCellData.color !== this.color))
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

//270