class BoardData {
    constructor(rows, cols, tableElement) {
        this.matrix = Array(rows).fill().map(() => Array(cols).fill());
        this.table = tableElement;
        this.whiteGroup = new Group('white');
        this.blackGroup = new Group('black');
        this.turn = this.whiteGroup;
        this.whiteGroup.setInMatrix(this.matrix)
        this.blackGroup.setInMatrix(this.matrix)
        this.setEventsToCells();
    }
    getCellData(r, c) {
        return this.matrix[r][c];
    }
    insertPiece(pice) {
        this.matrix[pice.r][pice.c] = pice;
    }
    displayPosibalMoves(currentPiece) {
        currentPiece.calcOptionalSteps();
        for (let step of currentPiece.optionalSteps)
            table.rows[step[0]].cells[step[1]].classList.add("step");
        table.rows[currentPiece.r].cells[currentPiece.c].classList.add('selected');
    }
    cleanValidSteps() { // clean step of prev piece from the board
        if (!currentPiece) return;
        for (let step of currentPiece.optionalSteps)
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
        this.table.rows[currentPiece.r].cells[currentPiece.c].classList.remove('selected'); // 
    }
    switchTurn() {
        document.getElementById(`${this.turn.color}-flag`).classList.remove('turn');
        this.turn = (this.turn.color === 'white') ? this.blackGroup : this.whiteGroup;
        document.getElementById(`${this.turn.color}-flag`).classList.add('turn');
        if (this.isCheckMating())
            alert(`${this.blackGroup.getOpponentColor()} win !`);
        this.isKingInDanger(this.turn)
    }
    getOpponentColor() {
        if (this.turn.color === 'balck')
            return 'white';
        return 'black';
    }
    getOpponentOptionalMoves() {
        if (this.turn.color === 'balck')
            return this.whiteGroup.callcAllPosibaleMoves();
        return this.blackGroup.callcAllPosibaleMoves();
    }
    isCheckMating() {
        if (this.isKingInDanger(this.turn) && this.turn.piecesList['king'].calcOptionalSteps.length === 0)
            return true;
        return false;

    }
    isKingInDanger(group) {
        console.log(group.piecesList);
        const king = group.piecesList['king'];
        const opponentPosibaleMoves = this.getOpponentOptionalMoves();
        for (const cell of opponentPosibaleMoves)
            if (king.r === cell[0] && king.c === cell[1])
                return true;
        return false;

    }
    display() { // display all pieces on the table element
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                this.table.rows[i].cells[j].innerHTML = '';
                if (this.matrix[i][j] !== undefined)
                    this.matrix[i][j].display(this.table);
            }
        }
    }
    displayDangerCells() {
        this.whiteGroup.callcAllPosibaleMoves();
        for (const step of this.whiteGroup.allPosibleMoves)
            this.table.rows[step[0]].cells[step[1]].classList.add('step');
    }
    setEventsToCells() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++)
                this.table.rows[i].cells[j].addEventListener('click', () => { this.cellClickHandler(i, j) });
        }
    }
    cellClickHandler(i, j) {
        let cellData = this.matrix[i][j];
        this.cleanValidSteps();
        if (currentPiece) { // cellData is reference to any piece
            if (this.isValidMove(currentPiece, i, j)) {
                currentPiece.makeMove(i, j, this.table, this.matrix);
                this.switchTurn()
                cellData = undefined;
            }
            currentPiece = undefined;
        }
        if (cellData !== undefined) {
            if (cellData.color !== this.turn.color) return;
            currentPiece = cellData;
            this.displayPosibalMoves(currentPiece);
        }
    }
    isValidMove(pice, i, j) {
        for (const step of pice.optionalSteps)
            if (i === step[0] && j === step[1])
                return true;
        return false;
    }
}