class Piece {
    constructor(group, role, r, c, id) {
        this.group = group;
        this.color = group.color;
        this.id = id
        this.el = document.createElement('img');
        this.el.src = `./images/${this.color}_${role}.png`;
        this.r = r; // row index
        this.c = c; // col index
        this.optionalSteps = []; // optional valid steps
        this.moves = [];
    }
    calcOptionalSteps(matrix, flag = true) {
        this.optionalSteps = [];
        this.calcOptionalStepsBydirections(matrix, flag = true);
    }
    calcOptionalStepsBydirections(matrix, flag = true) {
        this.optionalSteps = [];
        for (const direction of this.directions) {
            let i = this.r + direction[0], j = this.c + direction[1];
            do {
                const [toPush, toContinue] = this.isValidStep(matrix, i, j, flag);
                if (toPush) this.optionalSteps.push([i, j]);
                i += direction[0]; j += direction[1];
                if (!toContinue) break;
            } while (1);
        }
    }
    calcOptionalStepsByMoves(matrix, flag = true) {
        this.optionalSteps = [];
        for (const step of this.moves) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (this.isValidStep(matrix, new_r, new_c, flag)[0])
                this.optionalSteps.push([new_r, new_c]);
        }
    }
    isValidStep(matrix, i, j, flag = true) {
        if (i < 0 || j < 0 || i >= 8 || j >= 8) return [false, false];
        const cellData = matrix[i][j];
        if (!cellData)
            return [true, true];
        if (cellData.color !== this.color)
            return [true, false];
        if (cellData.color === this.color)
            return [!flag, false];
    }
}

class King extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'king', r, c, id);
        this.moves = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
    calcOptionalSteps(matrix, flag = true) {
        this.calcOptionalStepsByMoves(matrix, flag);
    }
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
    calcOptionalSteps(matrix, flag = true) {
        this.calcOptionalStepsByMoves(matrix, flag);
    }
}
class Pawn extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'pawn', r, c, id)
        this.d = (group.color === 'black') ? -1 : 1;
        this.firstStep = true;
    }
    calcOptionalSteps(matrix, flag = true) {
        this.optionalSteps = [];
        this.moves = [];
        let new_r = this.r + this.d;
        if (new_r >= ROWS || new_r < 0) return;
        if (this.c - 1 >= 0 && this.c - 1 < 8)
            if (matrix[new_r][this.c - 1] && matrix[new_r][this.c - 1].color !== this.color || !flag)
                this.optionalSteps.push([new_r, this.c - 1])
        if (this.c + 1 >= 0 && this.c + 1 < 8)
            if (matrix[new_r][this.c + 1] && matrix[new_r][this.c + 1].color !== this.color || !flag)
                this.optionalSteps.push([new_r, this.c + 1])
        if (!matrix[new_r][this.c] && flag) this.optionalSteps.push([new_r, this.c]);
        if (this.firstStep && !matrix[new_r + this.d][this.c] && flag) this.optionalSteps.push([new_r + this.d, this.c]);
    }
}//103