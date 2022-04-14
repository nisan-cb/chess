let section1;
let table;

function createBord(areaObj) {
    table = document.createElement('table');
    areaObj.appendChild(table);
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (let j = 0; j < 8; j++) {
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

