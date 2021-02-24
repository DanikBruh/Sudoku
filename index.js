
//  Когда загрузилась вся страница, включая стили и другие ресурсы.
window.onload = function () {

    let body = document.getElementsByTagName('body')[0];
    let button = document.getElementById('button');

    button.onclick = function () {

        let size = document.getElementById('input').value;
        if (size > 0 && Math.sqrt(size)**2 == size) {
            //  Удаление таблицы, если она уже существует.
            deleteAllTables();

            //  Создание двумерного массива (шаблона таблицы).
            let array = createTwoDimensionalArrayWithRandomValues(size);

            //  Создание таблицы по заданному размеру.
            createTable(body, size);

            let tbody = document.getElementsByTagName('tbody')[0].children;

            //  Заполнение ячеек таблицы значениями из двумерного массива.
            fillTableCells(tbody, array, size);

            //  Функция, добавляющая классы клеткам таблицы, в которых уже содержится значение.
            addActiveClassNames(tbody, size);
        }
        else 
            alert('Возможные размеры таблицы судоку: 1, 4, 9, 16, 25, 36, ...');
    }
}

//  Функция, генерирующая случайное число
function random(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

//  Функция, создающая двумерный массив (шаблон таблицы) заполненый случайными значениями.
function createTwoDimensionalArrayWithRandomValues(size) {
    let arr = new Array(size);
    for (i = 0; i < size; i++) {
        arr[i] = new Array(size);
    }
    //  Заполнение двумерного массива рандомными неповторяющимися значениями.
    initialArrayFilling(arr, size);
    return arr;
}

//  Заполнение двумерного массива рандомными неповторяющимися значениями.
function initialArrayFilling(arr, size) {
    for (j = 0; j < size; j++) {
        let rand = random(size-1) + 1
        if (arr[0].includes(rand) == false) {
            arr[0][j] = rand;
        } else {
            while (arr[0].includes(rand) == true) {
                rand = random(size-1) + 1
            }
            arr[0][j] = rand;
        }
    }
    for (i = 1; i < size; i++) {
        let temp = [...arr[i - 1]]
        if (i % Math.sqrt(size) == 0) {
            arr[i] = temp.concat(temp.splice(0, 1));
        } else {
            arr[i] = temp.concat(temp.splice(0, Math.sqrt(size)));
        }
    }
}

//  Удаление таблицы, если она уже существует.
function deleteAllTables() {
    let node = document.getElementsByTagName("table")[0];
    if (node) {
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        node.remove();
    }
}

//  Функция, создающая таблицу заданных размеров.
function createTable(body, size) {
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    for (i = 0; i < size; i++) {
        let tr = document.createElement('tr');
        for (j = 0; j < size; j++) {
            let td = document.createElement('td');
            tr.appendChild(td)
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    body.appendChild(table);
    //  Изменение стилей ячеек таблицы.
    setTableStyle(table, size);
    //  Добавление функции, срабатывающей при нажатии на таблицу.
    table.onclick = function() { tableClick(event, tbody, size); }
    document.onkeydown = tableKeyDown;
}

//  Функция, изменяющая стили ячеек таблицы.
function setTableStyle(table, size) {
    table.classList.add('game-table');
    for (i = 0; i < size; i++) {
        let tr = document.getElementsByTagName('tr')[i];
        for (j = 0; j < size ** 2; j++) {
            let td = document.getElementsByTagName('td')[j];
            td.classList.add('game-cell');
            if(j % Math.sqrt(size) == 0)
                td.style.borderLeft = '2px solid black';
            td.style.height = `${100 / size}%`;
            td.style.width = `${100 / size}%`;
        }
        tr.classList.add('game-row');
        if(i % Math.sqrt(size) == 0)
            tr.style.borderTop = '2px solid black';
    }
}

//  Функция, срабатывающая при нажатии на клетки таблицы.
function tableClick(event, tbody, size) {
    let target = event.target;
    if (target.nodeName == "TD" && !target.classList.contains('game-value')) {
        let rowIndex = target.parentElement.rowIndex;
        let cellIndex = target.cellIndex;
        // target.innerHTML = random(size-1) + 1;
        target.classList.add('chosen');

        if (target.innerHTML != " " && containsHorizontally(tbody, rowIndex, cellIndex, target.innerHTML) || containsVertically(tbody, rowIndex, cellIndex, target.innerHTML)) {
            target.classList.remove('correct');
            target.classList.add('mistake');
            console.log('Mistake');
        } else {
            target.classList.remove('mistake');
            target.classList.add('correct');
            console.log('Correct');
        }
        // target.style.background = `rgb(${random(255)}, ${random(255)}, ${random(255)})`
    }   
}

//  
function tableKeyDown(event) {
    console.log(event.key)

    // if (target.nodeName == "TD" && !target.classList.contains('game-value')) {
    //     console.log(event.key);
    // }
}

//  Заполнение ячеек таблицы значениями из двумерного массива.
function fillTableCells(tbdy, arr, size) {
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            //  Оставление некоторых ячеек пустыми.
            if(random(100) > 30) {
                tbdy[i].children[j].innerHTML = arr[i][j];
            }
        }
    }
}

//  Функция, добавляющая классы клеткам таблицы, в которых уже содержится значение.
function addActiveClassNames(tbody, size) {
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (tbody[i].children[j].innerHTML != '') {
                tbody[i].children[j].classList.add("game-value");
            }
        }
    }
}

//  Функция, проверяющая содержится ли введенное значение в других ячейках ряда (вертикального).
function containsVertically(tbody, rowIndex, cellIndex, value) {
    for (i = 0; i < tbody.childElementCount; i++)
        if (i != rowIndex && tbody.children[i].children[cellIndex].innerHTML == value) return true;
    return false;
}

//  Функция, проверяющая содержится ли введенное значение в других ячейках ряда (горизонтального).
function containsHorizontally(tbody, rowIndex, cellIndex, value) {
    for (j = 0; j < tbody.childElementCount; j++)
        if (j != cellIndex && tbody.children[rowIndex].children[j].innerHTML == value) return true;
    return false;
}