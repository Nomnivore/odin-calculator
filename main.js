const memory = {
    first: 0,
    last: 0,
    operator: ''
}

function operate(num1, num2, oper) {
    switch (oper) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        default:
            return 0;
    }
}

