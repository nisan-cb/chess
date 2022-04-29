class BoardData {
    constructor(rows, cols, tableElement) {
        this.matrix = Array(rows).fill().map(() => Array(cols).fill());
        this.copyMatrix = Array(rows).fill().map(() => Array(cols).fill());
        this.table = tableElement;
        this.checkMode = false;
        this.checkmateMode = false;
        this.whiteGroup = new Group('white', this.matrix);
        this.blackGroup = new Group('black', this.matrix);
        this.currentGroup = this.whiteGroup;
        this.currentPiece = undefined;
        this.opponentPosibaleMoves = undefined;
        this.lastMove = { 'piece': undefined, 'source': undefined, 'destination': undefined, 'cellContent': undefined };
    }

    start() {
        this.insertGroup(this.whiteGroup); //insert into matrix board
        this.insertGroup(this.blackGroup); //insert into matrix board
        this.display() // display matrix on table HTML element
        this.callCurrentGroupPossibleSteps();
        this.addClickEventToCells();
        const dangerCells = this.getOpponentStepsMap();
        this.filterCurrentKingSteps(dangerCells);
    }
    insertGroup(group) { //insert into matrix board
        for (const piece of Object.values(group.piecesList))
            this.matrix[piece.r][piece.c] = piece;
    }

    display() { // display matrix on table HTML element
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.table.rows[i].cells[j].innerHTML = '';
                if (this.matrix[i][j])
                    this.table.rows[i].cells[j].append(this.matrix[i][j].el);
            }
        }
    }

    callCurrentGroupPossibleSteps() {
        console.log(this.currentGroup)
        for (const piece of Object.values(this.currentGroup.piecesList)) {
            if (!piece) continue;
            piece.calcOptionalSteps(this.matrix);
        }
    }

    addClickEventToCells() {
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++)
                this.table.rows[i].cells[j].addEventListener('click', () => { this.clickOnCellHandler(i, j) });
    }

    clickOnCellHandler(i, j) {
        const piece = this.matrix[i][j];
        if (this.isValidMove(i, j)) {
            this.movePiece(this.currentPiece, i, j);
            this.display();
            this.switch();
        } else if (piece) {
            this.cleanSteps();
            if (piece.color !== this.currentGroup.color) return;
            this.currentPiece = piece;
            this.displayMoves(piece);
        }
    }

    movePiece(piece, i, j) {
        this.cleanSteps()
        this.lastMove = {
            'piece': piece,
            'source': [piece.r, piece.c],
            'destination': [i, j],
            'cellContent': this.matrix[i][j]
        };
        let cellData = this.matrix[i][j];
        if (cellData) {
            cellData.group.piecesList[`${cellData.id}`] = undefined;
        }
        this.matrix[piece.r][piece.c] = undefined;
        this.matrix[i][j] = piece;
        piece.r = i; piece.c = j;
        if (piece.constructor.name === 'Pawn') piece.firstStep = false;
    }

    switch() {
        this.displayTurn();
        this.currentPiece = undefined;
        this.callCurrentGroupPossibleSteps();
        const dangerCells = this.getOpponentStepsMap();
        this.filterCurrentKingSteps(dangerCells);
        this.checkMode = this.isCheckMode(this.currentGroup)
        if (this.checkMode) console.log('protect on your king !!');
        if (this.isCheckmateMode())
            this.createWinnerMessage(`${this.getOpponentGroup().color} wins!`);
    }

    isValidMove(i, j) {
        if (!this.currentPiece) return false;
        let flag = 0;
        for (const step of this.currentPiece.optionalSteps)
            if (step[0] === i && step[1] === j)
                flag = 1;
        if (flag === 0) return false;
        this.movePiece(this.currentPiece, i, j);
        if (this.isCheckMode()) {
            this.undoMove();
            return false;
        }
        this.undoMove();
        return true;
    }

    displayMoves(piece) {
        for (const step of piece.optionalSteps)
            this.table.rows[step[0]].cells[step[1]].classList.add('step');
    }

    cleanSteps() {
        if (!this.currentPiece) return;
        for (const step of this.currentPiece.optionalSteps)
            this.table.rows[step[0]].cells[step[1]].classList.remove('step');
    }

    getOpponentStepsMap() {
        const opponentGroup = this.getOpponentGroup();
        return opponentGroup.callcAllPosibaleMoves(this.matrix);
    }

    getOpponentGroup() {
        if (this.currentGroup.color === 'black')
            return this.whiteGroup;
        return this.blackGroup;
    }

    filterCurrentKingSteps(dangerCells) {
        const currentKing = this.currentGroup.piecesList.king;
        let newStepsList = [];
        for (const step of currentKing.optionalSteps)
            if (dangerCells[step[0]][step[1]] === 0)
                newStepsList.push(step);
        currentKing.optionalSteps = newStepsList;
    }

    isCheckMode(group) { // checking if check on group
        const opponentStepsMap = this.getOpponentStepsMap()
        const king = this.currentGroup.piecesList.king;
        if (opponentStepsMap[king.r][king.c] !== 0)
            return true;
        return false;
    }

    isCheckmateMode() {
        if (!this.isCheckMode())
            return false;

        for (const piece of Object.values(this.currentGroup.piecesList)) {
            if (!piece) continue;
            for (const step of piece.optionalSteps) {
                this.movePiece(piece, step[0], step[1]);
                // this.display();
                let result = this.isCheckMode();
                this.undoMove();
                if (!result)
                    return false;
            }
        }
        return true;
    }

    undoMove() {
        const [piece, source, destination, cellContent] = Object.values(this.lastMove);
        this.matrix[source[0]][source[1]] = piece;
        this.matrix[destination[0]][destination[1]] = cellContent;
        piece.r = source[0];
        piece.c = source[1];
        if (cellContent)
            cellContent.group.piecesList[`${cellContent.id}`] = cellContent;
        this.display();
    }

    displayTurn() {
        document.getElementById(`${this.currentGroup.color}-flag`).classList.remove('turn');
        this.currentGroup = this.getOpponentGroup();
        document.getElementById(`${this.currentGroup.color}-flag`).classList.add('turn');
    }

    createWinnerMessage(message) {
        console.log('wins');
        let div = document.createElement('div');
        div.classList.add('message-box');
        div.innerHTML = message;
        this.table.append(div);
    }
}
//196