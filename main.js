// i think my state checking practices are messy
// should probably switch to using NaN instead of 0
// but, for now, everything works as expected.

const memory = {
    first: 0,
    last: 0,
    operator: "",
    solution: "",
};

const signs = {
    add: "+",
    subtract: "-",
    multiply: "×",
    divide: "÷",
};

// html elements
const display = document.getElementById("display");
const displayPrev = document.getElementById("display-prev");
const numbers = document.querySelectorAll(".number");
const opers = document.querySelectorAll(".func");

const btnEquals = document.getElementById("equals");
const btnClear = document.getElementById("clear");
const btnBack = document.getElementById("backspace");
const btnNegative = document.getElementById("negative");
const btnDeci = document.getElementById("decimal");

function expo(x) {
    if (x.toString().length > 8) {
        return parseFloat(x).toExponential(4);
    }
    return x;
}

function getPropName(obj, value) {
    for (let prop in obj) {
        if (obj[prop] == value) return prop;
    }
}

function operate(num1, num2, oper) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    switch (oper) {
        case signs.add:
            return expo(num1 + num2).toString();
        case signs.subtract:
            return expo(num1 - num2).toString();
        case signs.multiply:
            return expo(num1 * num2).toString();
        case signs.divide:
            if (num2 === 0) return "ha haa.";
            return (num1 / num2).toString();
        default:
            return 0;
    }
}

function updateDisplay() {
    // return to blank slate first
    display.textContent = "";
    displayPrev.textContent = "";
    opers.forEach((op) => op.classList.remove("highlight"));

    // update based on current state in memory
    if (memory.solution !== "") {
        // solution set by equals operator, or chaining operators
        display.textContent = memory.solution;
        displayPrev.textContent = `${memory.first} ${memory.operator} ${memory.last}`;
        return;
    }
    if (memory.first && !memory.operator) {
        // during first number entry
        display.textContent = memory.first;
        return;
    }
    if (memory.operator) {
        // during second number entry
        displayPrev.innerHTML = `${memory.first} ${memory.operator}&nbsp;`;
        display.textContent = memory.last ? memory.last : "";

        document
            .getElementById(getPropName(signs, memory.operator))
            .classList.add("highlight");
        return;
    }
}

function getState() {
    // returns 'first' or 'last', to be used with memory.
    if (!memory.operator) {
        return "first";
    } else {
        return "last";
    }
}

const numPressed = (id) => {
    if (memory.solution !== "") {
        // reset solution
        memory.solution = "";
        memory.first = id;
        memory.last = 0;
        memory.operator = "";
        updateDisplay();
        return;
    }

    const state = getState();
    if (memory[state] === 0) {
        memory[state] = id;
    } else {
        memory[state] = memory[state] + id;
    }
    updateDisplay();
};

const opPressed = (id) => {
    // act based on state again
    if (memory.solution !== "") {
        // following last operation
        memory.first = memory.solution;
        memory.solution = "";
        memory.last = 0;
        memory.operator = signs[id];
        updateDisplay();
        return;
    }
    if (memory.first && !memory.last) {
        // moves state to last num
        memory.operator = signs[id];
        updateDisplay();
        return;
    }
    if (memory.first && memory.last) {
        // chaining operations
        memory.first = operate(memory.first, memory.last, memory.operator);
        memory.operator = signs[id];
        memory.last = 0;
        updateDisplay();
    }
};

numbers.forEach((num) => {
    num.onclick = () => {
        numPressed(num.id);
        num.classList.add("pressed");
    };
});

opers.forEach((op) => {
    op.textContent = signs[op.id];
    op.onclick = () => {
        opPressed(op.id);
        op.classList.add("pressed");
    };
});

btnEquals.onclick = (event) => {
    if (!memory.operator) return;
    //    first = (memory.first) ? memory.first : 0
    memory.last = memory.last ? memory.last : memory.first;
    memory.solution = operate(memory.first, memory.last, memory.operator);
    updateDisplay();
    btnEquals.classList.add("pressed");
};

btnClear.onclick = () => {
    memory.first = 0;
    memory.last = 0;
    memory.operator = "";
    memory.solution = "";
    updateDisplay();
    btnClear.classList.add("pressed");
};

btnBack.onclick = () => {
    const state = getState();
    if (memory[state]) {
        memory[state] = memory[state].slice(0, -1);
    }
    updateDisplay();
    btnBack.classList.add("pressed");
};

btnNegative.onclick = () => {
    const state = getState();
    if (memory[state]) {
        if (memory[state].startsWith("-")) {
            memory[state] = memory[state].slice(1);
        } else {
            memory[state] = "-" + memory[state];
        }
    }
    updateDisplay();
    btnNegative.classList.add("pressed");
};

btnDeci.onclick = () => {
    const state = getState();
    if (memory[state] && memory[state].indexOf(".") > -1) return;
    if (memory[state]) {
        memory[state] = memory[state] + ".";
    } else {
        memory[state] = "0.";
    }
    updateDisplay();
    btnDeci.classList.add("pressed");
};

document.querySelectorAll("#calc button").forEach((btn) => {
    btn.addEventListener("transitionend", () => {
        btn.classList.remove("pressed");
    });
});

window.addEventListener("keydown", (event) => {
    if (event.key.match(/[0-9]/)) {
        document.getElementById(event.key).click();
    } else if (event.key == "Enter") {
        btnEquals.click();
    } else if (event.key == "Backspace") {
        btnBack.click();
    } else if (event.key == "c") {
        btnClear.click();
    } else if (event.key == "/") {
        document.getElementById("divide").click();
    } else if (event.key == "*") {
        document.getElementById("multiply").click();
    } else if (event.key == "+") {
        document.getElementById("add").click();
    } else if (event.key == "-") {
        document.getElementById("subtract").click();
    } else if (event.key == ".") {
        btnDeci.click();
    }
});
