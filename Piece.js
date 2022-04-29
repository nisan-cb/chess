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
    }
    calcOptionalStepsBydirections(matrix) {
        this.optionalSteps = [];
        for (const direction of this.directions) {
            let i = this.r + direction[0], j = this.c + direction[1];
            for (; i >= 0 && i < 8 && j >= 0 && j < 8; i += direction[0], j += direction[1])
                if (!matrix[i][j])
                    this.optionalSteps.push([i, j]);
                else if (matrix[i][j].color !== this.color) {
                    this.optionalSteps.push([i, j]);
                    break;
                } else
                    break;
        }
    }
    calcOptionalStepsByMoves(matrix) {
        this.optionalSteps = [];
        for (const step of this.moves) {
            let new_r = this.r + step[0], new_c = this.c + step[1];
            if (new_r >= 0 && new_r < 8 && new_c >= 0 && new_c < 8)
                if (!matrix[new_r][new_c] || matrix[new_r][new_c].color !== this.color)
                    this.optionalSteps.push([new_r, new_c]);
        }
    }
}

class King extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'king', r, c, id);
        this.moves = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
    calcOptionalSteps(matrix) {
        this.calcOptionalStepsByMoves(matrix);
    }
}
class Queen extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'queen', r, c, id)
        this.directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    }
    calcOptionalSteps(matrix) {
        this.calcOptionalStepsBydirections(matrix);
    }

}
class Rook extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'rook', r, c, id)
        this.directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    }
    calcOptionalSteps(matrix) {
        this.calcOptionalStepsBydirections(matrix);
    }
}
class Bishop extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'bishop', r, c, id)
        this.directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    }
    calcOptionalSteps(matrix) {
        this.calcOptionalStepsBydirections(matrix);
    }
}
class Knight extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'knight', r, c, id)
        this.moves = [[-1, 2], [-1, -2], [1, 2], [1, - 2], [-2, 1], [-2, -1], [2, 1], [2, -1]];
    }
    calcOptionalSteps(matrix) {
        this.calcOptionalStepsByMoves(matrix);
    }
}
class Pawn extends Piece {
    constructor(group, r = 0, c = 0, id) {
        super(group, 'pawn', r, c, id)
        this.d = (group.color === 'black') ? -1 : 1;
        this.firstStep = true;
        this.moves = [];
    }
    calcOptionalSteps(matrix) {
        this.optionalSteps = [];
        this.moves = [];
        let new_r = this.r + this.d;
        if (new_r >= ROWS || new_r < 0) return;
        if (matrix[new_r][this.c] === undefined) this.moves.push([this.d, 0]);
        if (this.firstStep && !matrix[new_r + this.d][this.c]) this.moves.push([this.d * 2, 0]);
        if (matrix[new_r][this.c - 1] !== undefined)
            this.moves.push([this.d, -1])
        if (matrix[new_r][this.c + 1] !== undefined)
            this.moves.push([this.d, 1])
        this.calcOptionalStepsByMoves(matrix);
    }
}//103