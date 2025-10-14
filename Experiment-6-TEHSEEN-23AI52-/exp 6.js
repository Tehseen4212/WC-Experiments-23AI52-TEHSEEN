// calculator.js

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function startCalculator() {
  const firstInput = await ask("Enter first number: ");
  const operator = await ask("Enter operator (+, -, *, /): ");
  const secondInput = await ask("Enter second number: ");

  const num1 = Number(firstInput);
  const num2 = Number(secondInput);
  let output;

  if (isNaN(num1) || isNaN(num2)) {
    output = "❌ Invalid number input!";
  } else {
    switch (operator) {
      case "+":
        output = num1 + num2;
        break;
      case "-":
        output = num1 - num2;
        break;
      case "*":
        output = num1 * num2;
        break;
      case "/":
        output = num2 !== 0 ? num1 / num2 : "❌ Cannot divide by zero!";
        break;
      default:
        output = "❌ Invalid operator!";
    }
  }

  console.log(`\nResult ➜ ${output}`);
  rl.close();
}

startCalculator();
