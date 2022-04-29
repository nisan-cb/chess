//please start from init function
let table;
let boardData;
const ROWS = 8;
const COLS = 8;

function createBoard() {
    let areaObj = document.getElementById('board-box');
    if (!areaObj) {
        console.log("error in createBord function - areaObj not defined");
        return undefined;
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
    boardData.start();// place all pieces on the board
}

window.addEventListener('load', () => {
    console.log('page is fully loaded');
    init();
});