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
    multiply: "*",
    divide: "/",
};

// html elements
const display = document.getElementById("display");
const displayPrev = document.getElementById("display-prev");
const numbers = document.querySelectorAll(".number");
const opers = document.querySelectorAll(".func");

function operate(num1, num2, oper) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    switch (oper) {
        case "+":
            return (num1 + num2).toString();
        case "-":
            return (num1 - num2).toString();
        case "*":
            return (num1 * num2).toString();
        case "/":
            if (num2 === 0) return "ha haa."
            return (num1 / num2).toString();
        default:
            return (0);
    }
}

function updateDisplay() {
    // return to blank slate first
    display.textContent = "";
    displayPrev.textContent = "";

    // update based on current state in memory
    if (memory.solution !== '') {
        console.log("ok")
        // solution set by equals operator, or chaining operators
        display.textContent = memory.solution;
        displayPrev.textContent = `${memory.first} ${memory.operator} ${memory.last}`;
        return
    }
    if (memory.first && !memory.operator) {
        // during first number entry
        display.textContent = memory.first;
        return;
    }
    if (memory.operator) {
        // during second number entry
        displayPrev.textContent = `${memory.first} ${memory.operator}`;
        display.textContent = memory.last ? memory.last : "";
        return;
    }
}

numbers.forEach(
    (num) =>
        (num.onclick = () => {
            if (memory.solution !== '') {
                // reset solution
                memory.solution = "";
                memory.first = num.id
                memory.last = 0
                memory.operator = ''
                updateDisplay()
                return
            }

            if (!memory.operator) {
                // current state is first number
                if (memory.first === 0) {
                    memory.first = num.id;
                } else {
                    memory.first = memory.first + num.id;
                }
            } else {
                // current state is last number
                if (memory.last === 0) {
                    memory.last = num.id;
                } else {
                    memory.last = memory.last + num.id;
                }
            }
            updateDisplay();
        })
);

opers.forEach(
    (op) =>
        (op.onclick = () => {
            // act based on state again
            if (memory.solution !== '') {
                // following last operation
                memory.first = memory.solution;
                memory.solution = ""
                memory.last = 0
                memory.operator = signs[op.id];
                updateDisplay();
                return;
            }
            if (memory.first && !memory.last) {
                // moves state to last num
                memory.operator = signs[op.id];
                updateDisplay();
                return;
            }
            if (memory.first && memory.last) {
                // chaining operations
                memory.first = operate(
                    memory.first,
                    memory.last,
                    memory.operator
                );
                memory.operator = signs[op.id];
                memory.last = 0
                updateDisplay();
            }
        })
);

document.getElementById("equals").onclick = (event) => {
    if (!memory.operator) return
    console.log('equals')
//    first = (memory.first) ? memory.first : 0
    memory.last = (memory.last) ? memory.last : memory.first
    memory.solution = operate(memory.first, memory.last, memory.operator)
    console.log(memory)
    updateDisplay()
}

document.getElementById("clear").onclick = (event) => {
    memory.first = 0
    memory.last = 0
    memory.operator = ''
    memory.solution = ''
    updateDisplay()
}