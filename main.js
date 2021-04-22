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

const btnEquals = document.getElementById("equals")
const btnClear = document.getElementById("clear")
const btnBack = document.getElementById("backspace")
const btnNegative = document.getElementById("negative")

function operate(num1, num2, oper) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    switch (oper) {
        case signs.add:
            return (num1 + num2).toString();
        case signs.subtract:
            return (num1 - num2).toString();
        case signs.multiply:
            return (num1 * num2).toString();
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
    };
});

opers.forEach((op) => {
    op.textContent = signs[op.id];
    op.onclick = () => {
        opPressed(op.id);
    };
});

btnEquals.onclick = (event) => {
    if (!memory.operator) return;
    //    first = (memory.first) ? memory.first : 0
    memory.last = memory.last ? memory.last : memory.first;
    memory.solution = operate(memory.first, memory.last, memory.operator);
    console.log(memory);
    updateDisplay();
};

btnClear.onclick = (event) => {
    memory.first = 0;
    memory.last = 0;
    memory.operator = "";
    memory.solution = "";
    updateDisplay();
};

btnBack.onclick = (event) => {
    const state = getState();
    if (memory[state]) {
        memory[state] = memory[state].slice(0, -1);
    }
    updateDisplay();
};

btnNegative.onclick = (event) => {
    const state = getState();
    if (memory[state]) {
        if (memory[state].startsWith("-")) {
            memory[state] = memory[state].slice(1);
        } else {
            memory[state] = "-" + memory[state];
        }
    }
    updateDisplay();
};

window.addEventListener("keydown", (event) => {
    if (event.key.match(/[0-9]/)) {
        document.getElementById(event.key).click()
    } else if (event.key == "Enter") {
        btnEquals.click()
    } else if (event.key == "Backspace") {
        btnBack.click()
    } else if (event.key == "c") {
        btnClear.click()
    } else if (event.key == "/") {
        document.getElementById("divide").click()
    } else if (event.key == "*") {
        document.getElementById("multiply").click()
    } else if (event.key == "+") {
        document.getElementById("add").click()
    } else if (event.key == "-") {
        document.getElementById("subtract").click()
    }
});
