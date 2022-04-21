//please start from init function
let section1;
let table;
let boardData;
const ROWS = 8;
const COLS = 8;
// let matrix = Array(ROWS).fill().map(() => Array(COLS).fill());
let validStepsMatrix = Array(ROWS).fill().map(() => Array(COLS).fill());
let whiteGroup = {};
let blackGroup = {};
let currentPiece;

class BoardData {
    constructor(rows, cols, tableElement) {
        this.matrix = Array(rows).fill().map(() => Array(cols).fill());
        this.table = tableElement;
    }
    getCellData(r, c) {
        return this.matrix[r][c];
    }
    insertPiece(pice) {
        this.matrix[pice.r][pice.c] = pice;
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
        currentPiece.setLocation(new_r, new_c); // updet new indexes in the OBJ
        boardData.table.rows[currentPiece.r].cells[currentPiece.c].appendChild(currentPiece.el);
        boardData.cleanValidSteps();
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


}
class Piece {
    constructor(color, role) {
        this.color = color;
        this.src = `./images/${color}_${role}.png`;
        this.el = document.createElement('img');
        this.el.src = this.src;
        this.r = 0;
        this.c = 0;
        this.optionalSteps = [];
        this.el.addEventListener('click', (e) => {
            e.stopPropagation();
            boardData.cleanValidSteps();
            currentPiece = this;
            this.calcOptionalSteps();
            boardData.displayStepsOf(this);
        })
        this.el.addEventListener("mouseover", (e) => {
            this.calcOptionalSteps();
            console.log(this.optionalSteps.length);
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
    checkStep(r, c) {
        let cellData = boardData.getCellData(r, c);
        if (cellData == undefined)
            return [r, c];
        else if (cellData.color === this.color)
            return undefined;
        else if (cellData.color !== this.color) {
            return [r, c];
        }
    }
    checkDownLeft() {
        let steps = [];
        for (let i = 1; this.r + i < ROWS && this.c - i >= 0; i++) {
            let result = this.checkStep(this.r + i, this.c - i);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkDownRight() {
        let steps = [];
        for (let i = 1; this.r + i < ROWS && this.c + i < COLS; i++) {
            let result = this.checkStep(this.r + i, this.c + i);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkUpRight() {
        let steps = [];
        for (let i = 1; this.r - i >= 0 && this.c + i < COLS; i++) {
            let result = this.checkStep(this.r - i, this.c + i);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkUpLeft() {
        let steps = [];
        for (let i = 1; this.r - i >= 0 && this.c - i >= 0; i++) {
            let result = this.checkStep(this.r - i, this.c - i);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkLeft() {
        let steps = [];
        for (let i = this.c - 1; i >= 0; i--) {
            let result = this.checkStep(this.r, i);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkRight() {
        let steps = [];
        for (let i = this.c + 1; i < COLS; i++) {
            let result = this.checkStep(this.r, i);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkUp() {
        let steps = [];
        for (let i = this.r - 1; i >= 0; i--) {
            let result = this.checkStep(i, this.c);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
    }
    checkDown() {
        let steps = [];
        for (let i = this.r + 1; i < ROWS; i++) {
            let result = this.checkStep(i, this.c);
            if (result === undefined)
                break;
            steps.push(result);
        }
        return steps;
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
    }
    calcOptionalSteps() {
        this.optionalSteps = [];
        this.optionalSteps.push(...this.checkLeft());
        this.optionalSteps.push(...this.checkRight());
        this.optionalSteps.push(...this.checkUp());
        this.optionalSteps.push(...this.checkDown());
        this.optionalSteps.push(...this.checkDownLeft());
        this.optionalSteps.push(...this.checkDownRight());
        this.optionalSteps.push(...this.checkUpRight());
        this.optionalSteps.push(...this.checkUpLeft());
    }
}
class Rook extends Piece {
    constructor(color) {
        super(color, 'rook')
    }
    calcOptionalSteps(e) {
        this.optionalSteps = [];
        this.optionalSteps.push(...this.checkLeft());
        this.optionalSteps.push(...this.checkRight());
        this.optionalSteps.push(...this.checkUp());
        this.optionalSteps.push(...this.checkDown());
    }
}
class Bishop extends Piece {
    constructor(color) {
        super(color, 'bishop')
    }
    calcOptionalSteps(e) {
        this.optionalSteps = [];
        this.optionalSteps.push(...this.checkDownLeft());
        this.optionalSteps.push(...this.checkDownRight());
        this.optionalSteps.push(...this.checkUpRight());
        this.optionalSteps.push(...this.checkUpLeft());
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
    whiteGroup["queen"]
    placeSoldiers(whiteGroup); // place white pices on the board
    placeSoldiers(blackGroup);// place black pices on the board
}
function placeSoldiers(group) { //in matrix & into HTML table
    for (let key in group) {
        if (group[key] !== undefined) {
            boardData.insertPiece(group[key]);
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
    boardData = new BoardData(ROWS, COLS, table);
}

const init = () => {
    console.log("hello from init funcion ");
    createBoard(); // create board
    createGroups(); // creating black group and white group
    placeAllSoldiers();
}

window.addEventListener('load', () => {
    console.log('page is fully loaded');
    init();
});


//380