class Group {
    constructor(color, matrix) {
        this.piecesList = {};
        this.color = color;
        this.createGroup();
        this.allPosibleMoves = Array(8).fill().map(() => Array(8).fill(0));; // matrix of all danger cells for opponent group
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

    callcAllPosibaleMoves(matrix, flag = true) {
        this.allPosibleMoves.map((array) => array.fill(0));
        for (const key in this.piecesList) {
            const piece = this.piecesList[key];
            if (!piece) continue;
            piece.calcOptionalSteps(matrix, flag);
            for (const step of piece.optionalSteps)
                this.allPosibleMoves[step[0]][step[1]]++;
        }
        return this.allPosibleMoves;
    }
    displayAllPosibleMoves() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.allPosibleMoves[i][j])
                    table.rows[i].cells[j].classList.add('step');
            }
        }
    }
    addPiece(piece) {
        this.piecesList[`${piece.id}`] = piece;
        this.matrix[piece.r][piece.c] = piece;
    }
    removePiece(piece) {
        delete this.piecesList[`${piece.id}`]; // remove from Group
    }
}//46