class Group {
    constructor(color) {
        this.piecesList = {};
        this.color = color;
        this.createGroup();
        this.allPosibleMoves = []; // list of all danger cells for opponent group
    }
    createGroup() {    // insert piece into group with starting positions
        let k = 0;
        if (this.color == 'black') k = 7;
        this.piecesList["king"] = new King(this, k, 4, "king");
        this.piecesList["queen"] = new Queen(this, k, 3, "queen");
        this.piecesList["rookL"] = new Rook(this, k, 0, "rookL");
        this.piecesList["rookR"] = new Rook(this, k, 7, "rookR");
        this.piecesList["bishopL"] = new Bishop(this, k, 2, "bishopL");
        this.piecesList["bishopR"] = new Bishop(this, k, 5, "bishopR");
        this.piecesList["knightL"] = new Knight(this, k, 1, "knightL");
        this.piecesList["knightR"] = new Knight(this, k, 6, "knightR");
        k = 1;
        if (this.color == 'black') k = 6;
        for (let i = 0; i < 8; i++)
            this.piecesList[`pawn${i}`] = new Pawn(this, k, i, `pawn${i}`);
    }
    test() {
        console.log('hello');
    }
    display(table) { // display al group pieces on HTML table
        for (const piece in this.piecesList)
            this.piecesList[piece].display(table);
    }
    callcAllPosibaleMoves() {
        this.allPosibleMoves = [];
        for (const key in this.piecesList) {
            const piece = this.piecesList[key];
            piece.calcOptionalSteps();
            this.allPosibleMoves.push(...piece.optionalSteps);
        }
        console.log(this.allPosibleMoves);
        return this.allPosibleMoves;
    }
    setInMatrix(matrix) {
        for (const piece of Object.values(this.piecesList))
            matrix[piece.r][piece.c] = piece;
    }


}
class Piece {
    constructor(group, role, r = 0, c = 0, id) {
        this.group = group;
        this.color = group.color;
        this.id = id
        this.el = document.createElement('img');
        this.el.src = `./images/${this.color}_${role}.png`;
        this.r = r;
        this.c = c;

        this.optionalSteps = []; // optional valid steps

        this.el.addEventListener("mouseover", (e) => {
            this.calcOptionalSteps();
            if (this.optionalSteps.length === 0)
                this.el.style.cursor = 'not-allowed'
            else
                this.el.style.cursor = 'pointer';
            if (this.isInDanger())
                this.el.style.cursor = 'grab';
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
        table.rows[this.r].cells[this.c].innerHTML = '';
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
    remove(matrix, table) {
        matrix[this.r][this.c] = undefined;
        table.rows[this.r].cells[this.c].innerHTML = '';
        delete this.group.piecesList[`${this.id}`];
    }
    replace(new_r, new_c, table, matrix) {
        matrix[this.r][this.c] = undefined;
        table.rows[this.r].cells[this.c].innerHTML = '';
        this.setLocation(new_r, new_c);
        matrix[new_r][new_c] = this;
        this.display(table);
    }
    makeMove(i, j, table, matrix) {
        console.log('moved!');
        if (matrix[i][j]) matrix[i][j].remove(matrix, table);
        this.replace(i, j, table, matrix);
        if (currentPiece.constructor.name === 'Pawn') currentPiece.firstStep = false;
        currentPiece = undefined;
    }
}
class King extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'king', r, c, id);
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
        // this.filterKingMoves();
    }
    // filterKingMoves() {
    //     const opponentPosibaleMoves = boardData.getOpponentOptionalMoves();
    //     for (const step of this.optionalSteps)
    //         for (const dangerCell of opponentPosibaleMoves)
    //         if(step[0]===dangerCell[0] && step[1]===dangerCell)
    // }
}
class Queen extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'queen', r, c, id)
        this.directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
}
class Rook extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'rook', r, c, id)
        this.directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    }
}
class Bishop extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'bishop', r, c, id)
        this.directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    }
}
class Knight extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'knight', r, c, id)
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
    constructor(group, r = 0, c = 0, id) {
        super(group, 'pawn', r, c, id)
        this.d = (group.color === 'black') ? -1 : 1;
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