let section1;
let table;
const ROWS = 8;
const COLS = 8;

function createBord(areaObj) {
    if (!areaObj) {
        console.log("error in createBord function - areaObj not defined");
        return;
    }
    table = document.createElement('table');
    table.setAttribute('id', 'board');
    areaObj.appendChild(table);
    for (let i = 0; i < ROWS; i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (let j = 0; j < COLS; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
        }
    }
}
const init = () => {
    console.log("init");
    createBord(document.getElementById('section1'));
}

window.addEventListener('load', () => {
    console.log('loaded');
    init();
});

