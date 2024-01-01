// <--------------- MATRIX FUNCTION --------------->
// Pengurangan otomatis
function subst(ma, mb) {
    let a = ma;
    let b = mb;
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.map((value, index) => value - (b[index] || 0));
    } else if (Array.isArray(a) || Array.isArray(b)) {
        if (Array.isArray(a)) {
            let res = [...a];
            res[0] -= b;
            return res;
        } else {
            let res = [...b];
            res = sMultiplication(-1, res);
            res[0] = a - b[0];
            return res;
        }
    } else {
        return (a - b);
    }
}

//  Pengurangan matriks A dengan matriks B
function substM(ma, mb) {
    let a = ma;
    let b = mb;
    let res = [];
    for (let row = 0; row < a.length; row++) {
        let resRow = [];
        for (let col = 0; col < a[1].length; col++) {
            resRow.push(subst(a[row][col], b[row][col]));
        }
        res.push(resRow);
    }
    return res;
}

// Penjumlahan otomatis
function add(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        let res = (a.length >= b.length) ? [...a] : [...b];
        let ref = (a.length >= b.length) ? [...b] : [...a];
        for (let index = 0; index < res.length; index++) {
            if (ref[index] !== undefined) res[index] = res[index] + ref[index];
        }
        return res;
    } else if (Array.isArray(a) || Array.isArray(b)) {
        if (Array.isArray(a)) {
            let res = [...a];
            res[0] += b;
            return res;
        } else {
            let res = [...b];
            res[0] += a;
            return res;
        }
    } else {
        return (a + b);
    }
}

// Mendapatkan koefisien variabel
function extractCoefficient(scalar) {
    const match = scalar.match(/^(\d+)/);

    if (match) {
        return parseInt(match[1], 10);
    } else {
        throw new Error('Invalid scalar format');
    }
}

// Perkalian matriks dengan skalar
function sMultiplication(skalarRef, matrixRef) {
    let matrix = [...matrixRef];
    let skalar = skalarRef;
    if (typeof skalar === 'string') {
        const coefficient = extractCoefficient(skalar);

        return (Array.isArray(matrix[0])) ? matrix.map(row => row.map(colValue => (colValue === 0) ? colValue : [colValue, coefficient])) : matrix.map(value => value * coefficient);
    } else {
        return (Array.isArray(matrix[0])) ? matrix.map(row => row.map(colValue => colValue * skalar)) : matrix.map(value => value * skalar);
    }
}

// Perkalian dua fungsi F(x)
function fxMultiplication(a, b) {
    let res = [];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            (res[i + j] === undefined) ? res[i + j] = a[i] * b[j] : res[i + j] += a[i] * b[j];
        }
    }
    return res.map((value) => (value === undefined) ? 0 : value);
}

// Perkalian otomatis
function qMulti(ma, mb) {
    let a = ma;
    let b = mb;
    if (Array.isArray(a) && Array.isArray(b)) {
        return fxMultiplication(a, b);
    } else if (Array.isArray(a) || Array.isArray(b)) {
        let skalar = (Array.isArray(a)) ? b : a;
        let matrix = (Array.isArray(a)) ? a : b;
        return sMultiplication(skalar, matrix);
    } else {
        return a * b;
    }
}

// Determinan matrix 2x2
function det2(matrixRef) {
    let matrix = matrixRef;
    let d1 = qMulti(matrix[0][0], matrix[1][1]);
    let d2 = qMulti(matrix[0][1], matrix[1][0]);
    let res = subst(d1, d2);

    return res;
}

// Determinan untuk matriks lebih dari 2x2
function det(matrixRef) {
    let matrix = [...matrixRef];
    if (matrix.length === 0) return 0;
    else if (matrix.length === 1) return matrix[0];
    else if (matrix.length === 2) return det2(matrix);


    let result = [];
    let sign = 1;

    for (let i = 0; i < matrix.length; i++) {
        let elem = matrix[i][0];

        let minor = matrix.slice(0, i).concat(matrix.slice(i + 1)).map(row => row.slice(1));

        let deter = det(minor);
        if (result.length === 0) {
            result = qMulti(qMulti(elem, sign), deter);
        } else {
            let temp = qMulti(qMulti(elem, sign), deter);
            result = add(result, temp);
        }

        sign = -sign;
    }
    return result;
}

// Membuat matriks identitas dengan ukuran (size x size)
function I(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        let baris = [];
        for (let j = 0; j < size; j++) {
            baris.push((i === j) ? 1 : 0);
        }
        matrix.push(baris);
    }
    return matrix;
}

// Membuat matriks skalar
function sI(size, coeff) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push((i === j) ? [0, coeff] : 0);
        }
        matrix.push(row);
    }
    return matrix;
}

// Menghitung nilai trace dari sebuah matrix
function trace(matrixEquation) {
    let matrix = matrixEquation;
    let result = 0;
    for (let baris = 0; baris < matrix.length; baris++) {
        for (let kolom = 0; kolom < matrix.length; kolom++) {
            if (baris === kolom) {
                result += matrix[baris][kolom];
            }
        }
    }
    return result;
}

// Membuat characteristic polynomial
function makeCharPoly(matrixEquation, char) {
    let matrix = matrixEquation;
    let poly = '';

    for (let index = matrix.length - 1; index >= 0; index--) {
        let prefix = (matrix[index] > 0) ? ' + ' : ' - ';
        let coeff = (Math.abs(matrix[index]) === 1) ? '' : Math.abs(matrix[index]);
        let suffix = (index === 1) ? `${char}` : `${char}<sup>${index}</sup>`;

        if (matrix[index] === 0) continue;
        else if (index === 0) poly += prefix + coeff;
        else if (index === matrix.length - 1) poly += coeff + suffix;
        else poly += prefix + coeff + suffix;
    }
    return poly;
}

// <--------------- DOCUMENT FUNCTION --------------->
// Deklarasi elemen input matriks
const matrixInput = document.getElementById("matrix-input");
const msRow = document.getElementById("ms-row");
const msCol = document.getElementById("ms-col");
const accuration = 5;

// Fungsi untuk menghitung seluruh hasil yang diperlukan
function calculateResult() {
    let matrix = saveInputMatrix();
    showTrace(matrix);
    showCharPoly(matrix);
    let eigenValues = math.eigs(matrix).values;
    prototype = [...matrix];

    let eigenValuesText = '';
    for (let index = 0; index < eigenValues.length; index++) {
        if (typeof (eigenValues[index]) === 'object') {
            const imValue = parseFloat(eigenValues[index].im.toFixed(accuration));
            const reValue = parseFloat(eigenValues[index].re.toFixed(accuration));
            eigenValuesText += (imValue === 0)
                ? `<li>λ<sub>${index + 1}</sub> : <span>${reValue}</span></li>`
                : `<li>λ<sub>${index + 1}</sub> : <span>${reValue}</span> ${(imValue >= 0) ? '+' : '-'} <span>${Math.abs(imValue)}i</span></li>`
        } else {
            eigenValuesText += `<li>λ<sub>${index + 1}</sub> : ${parseFloat(eigenValues[index].toFixed(accuration))}</li>`;
        }
    }
    eigenValuesContainer.innerHTML = eigenValuesText;
}

// Membuat kolom input matriks
function createMatrixInput() {
    matrixInput.innerHTML = '';
    let rowSize = parseInt(msRow.value);
    let colSize = parseInt(msCol.value);

    for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.name = `matrix[${i}][${j}]`;
            input.id = `matrix-${i}-${j}`;
            input.placeholder = '0';

            matrixInput.appendChild(input);
        }
        matrixInput.appendChild(document.createElement('br'));
    }
}

// Mengupdate ukuran matriks
function updateMatrixSize() {
    msCol.value = msRow.value;
    createMatrixInput();
}

// Event listener untuk mengatur kontrol pointer pada input matrix
document.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;

    if (activeElement.tagName === 'INPUT' && activeElement.type === 'number') {
        activeElement.addEventListener('focus', () => {
            activeElement.select();
        });

        const row = parseInt(activeElement.name.match(/\[(\d+)\]/)[1]);
        const col = parseInt(activeElement.name.match(/\[(\d+)\]\[(\d+)\]/)[2]);

        switch (event.key) {
            case 'ArrowRight':
                if (col < parseInt(msCol.value) - 1) {
                    const nextInput = document.getElementById(`matrix-${row}-${col + 1}`);
                    if (nextInput) {
                        nextInput.focus();
                        event.preventDefault();
                    }
                }
                break;
            case 'ArrowLeft':
                if (col > 0) {
                    const prevInput = document.getElementById(`matrix-${row}-${col - 1}`);
                    if (prevInput) {
                        prevInput.focus();
                        event.preventDefault();
                    }
                }
                break;
            case 'ArrowDown':
                if (row < parseInt(msRow.value) - 1) {
                    const downInput = document.getElementById(`matrix-${row + 1}-${col}`);
                    if (downInput) {
                        downInput.focus();
                        event.preventDefault();
                    }
                }
                break;
            case 'ArrowUp':
                if (row > 0) {
                    const upInput = document.getElementById(`matrix-${row - 1}-${col}`);
                    if (upInput) {
                        upInput.focus();
                        event.preventDefault();
                    }
                }
                break;
            case ' ':
                const nextRow = (col === parseInt(msCol.value) - 1) ? row + 1 : row;
                const nextCol = (col === parseInt(msCol.value) - 1) ? 0 : col + 1;

                const nextInput = document.getElementById(`matrix-${nextRow}-${nextCol}`);
                if (nextInput) {
                    nextInput.focus();
                    event.preventDefault();
                }
                break;
            case 'Enter':
                calculateResult();
                break;

            default:
                break;
        }
    }
});

// Fungsi untuk menyimpan input matriks
function saveInputMatrix() {
    matrix = [];

    let rowSize = parseInt(msRow.value);
    let colSize = parseInt(msCol.value);

    for (let i = 0; i < rowSize; i++) {
        let row = [];
        for (let j = 0; j < colSize; j++) {
            let inputValue = parseFloat(document.getElementById(`matrix-${i}-${j}`).value);
            row.push(isNaN(inputValue) ? 0 : inputValue);
        }
        matrix.push(row);
    }

    return matrix;
}

// Fungsi untuk menampilkan nilai trace matriks
function showTrace(matrixRef) {
    traceValue.innerHTML = trace(matrixRef);
}

// Fungsi untuk menampilkan characteristic polynomial
function showCharPoly(matrixRef) {
    let a = [...matrixRef]
    let b = sI(a.length, 1);
    let a_b = substM(a, b);
    let eq = det(a_b);
    charPoly.innerHTML = makeCharPoly(eq, 'λ');
}

// Membuat prototype input matriks sebagai backup
let prototype = [];

// Fungsi untuk cek nilai eksponen atau bukan
function isExponen(value) {
    const exponenRegex = /e|E/;
    return exponenRegex.test(value) ? true : false;
}

// Memanggil fungsi createMatrixInput
createMatrixInput();

// Mengupdate ukuran matriks dengan event listener
msRow.addEventListener('input', updateMatrixSize);
msCol.addEventListener('input', updateMatrixSize);

// DOM selection untk manipulasi document
const traceValue = document.getElementById("trace-value");
const charPoly = document.getElementById("char-poly");
const eigenValuesContainer = document.getElementById("eigen-values");

const calculateBtn = document.getElementById("calculate-result");

// Event listener ketika tombol calculate ditekan
calculateBtn.addEventListener('click', calculateResult);

