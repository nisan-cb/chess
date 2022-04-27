class BoardData {
    constructor(rows, cols, tableElement) {
        this.matrix = Array(rows).fill().map(() => Array(cols).fill());
        this.table = tableElement;
        this.shahMode = false;
        this.whiteGroup = new Group('white');
        this.blackGroup = new Group('black');
        this.turn = this.whiteGroup;
        this.whiteGroup.setInMatrix(this.matrix)
        this.blackGroup.setInMatrix(this.matrix)
        this.setEventsToCells();
    }
    display() { // display all pieces on the table element
        this.whiteGroup.display(this.table);
        this.blackGroup.display(this.table);
    }
    getCellData(r, c) { // get data from [r][c] cell
        return this.matrix[r][c];
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
            // currentPiece = undefined;
        }
        if (cellData !== undefined) {
            if (cellData.color !== this.turn.color) return;
            currentPiece = cellData;
            if (this.shahMode && currentPiece.id !== 'king') return;
            this.displayPosibalMoves(currentPiece);
        }
    }
    isValidMove(pice, i, j) {
        for (const step of pice.optionalSteps)
            if (i === step[0] && j === step[1])
                return true;
        return false;
    }
    switchTurn() {
        document.getElementById(`${this.turn.color}-flag`).classList.remove('turn');
        this.turn = (this.turn.color === 'white') ? this.blackGroup : this.whiteGroup;
        document.getElementById(`${this.turn.color}-flag`).classList.add('turn');
        const king = this.turn.piecesList['king'];
        king.calcOptionalSteps();
        this.shahMode = false;
        if (this.isKingInDanger(king)) {
            this.shahMode = true;
            currentPiece = king;
            this.displayPosibalMoves(king);
        }
        if (this.shahMode && king.optionalSteps.length === 0)
            this.createWinnerMessage(`${king.getOpponentColor()} wins !!`);
    }
    getOpponentOptionalMoves(groupColor) {
        if (groupColor === 'black')
            return this.blackGroup.callcAllPosibaleMoves();
        return this.whiteGroup.callcAllPosibaleMoves();
    }
    isKingInDanger(king) {
        const opponentPosibaleMoves = this.getOpponentOptionalMoves(king.getOpponentColor());
        if (opponentPosibaleMoves[king.r][king.c] > 0)
            return true;
        return false;
    }

    createWinnerMessage(message) {
        let div = document.createElement('div');
        div.classList.add('message-box');
        div.innerHTML = message;
        this.table.append(div);
    }
}
//106