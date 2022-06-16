let operators = [];

document.querySelectorAll("button").forEach((btn) => {
  // GET ALL OPERATORS SIGN AND PUT INTO AN ARRAY
  if (btn.classList.contains("operator")) {
    operators.push(btn.value);
  }

  // EVERY BUTTON TRIGGERS FUNCTION CLICKED
  btn.addEventListener("click", (event) => {
    clicked(event.target);
  });
});

// REGEX THAT CHECK OPERATORS
let operatorsCheck = `[${operators.join("|")}]`.replace("-", `\\\-`);
const regExOperators = new RegExp(operatorsCheck);

function clicked(btn) {
  clickedEffect(btn);

  switch (btn.id) {
    case "cancel": {
      clear();
      break;
    }
    case "bequals": {
      equals();
      break;
    }
    case "pm": {
      console.log("pm");
      break;
    }
    case "par": {
      console.log("par");
      break;
    }
    default: {
      expression(btn);
    }
  }
}

function clickedEffect(btn) {
  btn.classList.add("clicked");
  setTimeout(() => {
    btn.classList.remove("clicked");
  }, 120);
}

function warning() {
  document.body.classList.add("alert");

  setTimeout(() => {
    document.body.classList.remove("alert");
  }, 3000);
}

function sequenceArray() {
  return sentence.innerHTML.split(regExOperators);
}

function clear() {
  sentence.innerHTML = "";
  result.innerHTML = "";
}

function equals() {
  const numberSequenceArray = sequenceArray();

  if (
    numberSequenceArray.length > 1 &&
    numberSequenceArray[numberSequenceArray.length - 1] != ""
  ) {
    sentence.innerHTML = decimalAdjust("round", result.innerHTML, -1);
    result.innerHTML = "";
  }
}

function expression(btn) {
  // GET MATH EXPRESSION
  let expression = sentence.innerHTML;
  const operatorBtn = btn.classList.contains("operator");

  // GET LAST ELEMENT OF THE EXPRESSION
  const lastElement = expression[expression.length - 1];

  // GET LAST NUMBER SEQUENCE OF THE EXPRESSION
  const numberSequenceArray = sequenceArray();
  const lastNumberSequence =
    numberSequenceArray[numberSequenceArray.length - 1];

  // REGEX THAT CHECKS IF THE LAST NUMBER SEQUENCE HAS A DOT
  const regExDot = /\./;
  const hasDot = regExDot.test(lastNumberSequence);

  // REGEX THAT CHECKS IF THE LAST ELEMENT IS A NUMBER
  const regExNumber = /[0-9]/;
  const itsNumber = regExNumber.test(lastElement);

  // IF ITS AN OPERATOR, RESULT IS CLEANED
  if (operatorBtn) {
    result.innerHTML = "";
  }

  // IF THE SEQUENCE OF NUMBER IS BIGGER THAN 15, IT SHOWS AN WARNING THAT ITS NOT POSSIBLE TO TYPE MORE DIGITS
  if (lastNumberSequence.length >= 15 && !operatorBtn) {
    warning();
    return;
  }

  // VERIFY IF THE BUTTON CLICKED AND THE LAST ELEMENT ARE OPERATORS AND CHANGE IT IF ITS DIFFERENT
  if (operatorBtn && regExOperators.test(lastElement)) {
    sentence.innerHTML = expression.slice(0, -1).concat(btn.value);
  }

  // VERIFY IF BUTTON CLICKED IS AN OPERATOR AND ITS NOT FOLLOWED BY A NUMBER
  if (operatorBtn && !itsNumber) {
    return;
  }

  // VERIFY IF BUTTON CLICKED IS A DOT AND IST NOT FOLLOWED BY A NUMBER AND THE NUMBER SEQUENCE ALREADY HAS A DOT
  if (btn.id == "dot" && (!itsNumber || hasDot)) {
    return;
  }

  // UPDATE EXPRESSION VALUE
  expression += btn.value;
  sentence.innerHTML = expression;

  // SHOWS A PREVIEW OF THE RESULT
  if (regExOperators.test(expression) && !operatorBtn) {
    result.innerHTML = eval(expression);
  }
}

function decimalAdjust(type, value, exp) {
  // TRANSFORMING TO STRING
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // TRANSFORMING BACK
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}
