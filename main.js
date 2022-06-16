// DISABLE ERASER BUTTON ON LOAD AND CHECK IF THE EXPRESSION IS EMPTY TO ENABLE THE BUTTON
window.addEventListener("load", eraserBtnDisableToggleClass);
window.addEventListener("click", eraserBtnDisableToggleClass);

// GLOBAL VARIABLES
let operators = [],
  closingCount = 0,
  hasNumberBetween;

// MANIPULATING ALL BUTTONS
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

// REGEX NUMBER
const regExNumber = /[0-9]/;

// BUTTON CLICKED
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
      par();
      break;
    }
    case "eraser": {
      eraser();
      break;
    }
    default: {
      expression(btn);
      break;
    }
  }
}

// EFFECT ON BUTTON CLICKED
function clickedEffect(btn) {
  btn.classList.add("clicked");
  setTimeout(() => {
    btn.classList.remove("clicked");
  }, 120);
}

// SHOW A WARNING FOR A FEW SECONDS
function warning() {
  document.body.classList.add("alert");

  setTimeout(() => {
    document.body.classList.remove("alert");
  }, 3000);
}

// RETURNS THE SEQUENCES OF NUMBERS OF THE MATH EXPRESSION
function sequenceArray() {
  return sentence.innerHTML.split(regExOperators);
}

// CLEAR ALL
function clear() {
  sentence.innerHTML = "";
  result.innerHTML = "";
  closingCount = 0;
}

// ERASE THE LAST ELEMENT
function eraser() {
  let erasedElement = sentence.innerHTML[sentence.innerHTML.length - 1];
  let tempSentence = sentence.innerHTML.slice(0, -1);
  let lastElement = tempSentence[tempSentence.length - 1];

  if (regExOperators.test(lastElement)) {
    result.innerHTML = "";
  }

  if (erasedElement == "(") {
    closingCount--;
  }

  if (erasedElement == ")") {
    closingCount++;
  }

  sentence.innerHTML = tempSentence;
}

// ENABLE OR DISABLE ERASER BUTTON WHEN NOTHING IS WRITTEN
function eraserBtnDisableToggleClass() {
  if (sentence.innerHTML == "") {
    eraserBtn.classList.add("disable");
    eraserBtn.setAttribute("disabled", true);
  } else {
    eraserBtn.classList.remove("disable");
    eraserBtn.removeAttribute("disabled");
  }
}

// ADDS BRACKETS
function par() {
  let expressionTemp = sentence.innerHTML;

  let parLCount = expressionTemp.split("").filter((e) => e == "(").length;

  const lastElement = expressionTemp[expressionTemp.length - 1];
  const itsNumber = regExNumber.test(lastElement);

  if (closingCount > 0 && itsNumber) {
    hasNumberBetween = true;
  }
  if (closingCount == 0) {
    hasNumberBetween = false;
  }

  if (parLCount == 0 || !hasNumberBetween) {
    parL();
    return;
  }

  if (hasNumberBetween && closingCount > 0) {
    parR();
    calculate(sentence.innerHTML);
    return;
  }
}

// ADD LEFT BRACKET
function parL() {
  closingCount++;
  sentence.innerHTML += "(";
}

// ADD RIGHT BRACKET
function parR() {
  sentence.innerHTML += ")";
  closingCount--;
}

// DISPLAY THE FINAL RESULT
function equals() {
  const numberSequenceArray = sequenceArray();

  if (
    numberSequenceArray.length > 1 &&
    numberSequenceArray[numberSequenceArray.length - 1] != ""
  ) {
    sentence.innerHTML = decimalAdjust("round", result.innerHTML, -1);
    sentence.style.color = "green";
    sentence.style.transition = "color 200ms";
    setTimeout(() => {
      sentence.style.color = "black";
    }, 400);
    result.innerHTML = "";
  }
}

// FUNCTION RESPONSIBLE FOR ALL THE OPERATORS
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
    expression = expression.slice(0, -1).concat(btn.value);
    // .replace(btn.value, (s) => `<span>${s}</span>`);
    sentence.innerHTML = expression;
    return;
  }

  // VERIFY IF BUTTON CLICKED IS AN OPERATOR AND ITS NOT FOLLOWED BY A NUMBER
  if (operatorBtn && lastElement != ")") {
    if (operatorBtn && !itsNumber) {
      return;
    }
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
    calculate(expression);
  }
}

// CLOSES ALL BRACKETS
function closeAllPar() {
  let closeAllPar;

  if (closingCount > 0) {
    closeAllPar = ")".repeat(closingCount);
  } else {
    closeAllPar = "";
  }

  return closeAllPar;
}

// CHANGE THE OPERATORS SIGNS TO MATH OPERATORS
function changingSigns(expressionTemp) {
  return expressionTemp.replaceAll(/÷|×|−/g, (s) => {
    switch (s) {
      case "÷":
        return "/";
      case "×":
        return "*";
      case "−":
        return "-";
    }
  });
}

// MATH DECIMAL ROUND
function decimalAdjust(type, value, exp) {
  // TRANSFORMING TO STRING
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // TRANSFORMING BACK
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

// CALCULATE
function calculate(expressionTemp) {
  result.innerHTML = eval(changingSigns(expressionTemp.concat(closeAllPar())));
}
