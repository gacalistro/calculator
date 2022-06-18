// DISABLE ERASER BUTTON ON LOAD AND CHECK IF THE EXPRESSION IS EMPTY TO ENABLE THE BUTTON
window.addEventListener("load", eraserBtnDisableToggleClass);
window.addEventListener("click", eraserBtnDisableToggleClass);

// GLOBAL VARIABLES
let operators = [],
  closingCount = 0,
  hasNumberBetween,
  equalsClicked;

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
      equalsClicked = false;
      break;
    }
    case "bequals": {
      equals();
      equalsClicked = true;
      break;
    }
    case "pm": {
      pm();
      equalsClicked = false;
      break;
    }
    case "par": {
      par();
      equalsClicked = false;
      break;
    }
    case "eraser": {
      eraser();
      equalsClicked = false;
      break;
    }
    default: {
      expression(btn);
      break;
    }
  }

  // AUTO SCROLL TO RIGTH
  sentence.scrollLeft += sentence.scrollWidth;
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
  let expressionTemp = sentence.innerHTML.replaceAll(/\(|\)/g, "");
  return expressionTemp.split(regExOperators);
}

function lastNumberSequenceOfArray() {
  const numberSequenceArray = sequenceArray();
  return numberSequenceArray[numberSequenceArray.length - 1];
}

// CLEAR ALL
function clear() {
  sentence.innerHTML = "";
  result.innerHTML = "";
  closingCount = 0;
}

// DISPLAY THE FINAL RESULT
function equals() {
  const numberSequenceArray = sequenceArray();

  closingCount = 0;

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

function pm() {
  let expressionTemp = sentence.innerHTML;
  let lastElement = expressionTemp[expressionTemp.length - 1];
  const lastNumberSequence = lastNumberSequenceOfArray();

  // TURNS NEGATIVE THE FIRST SEQUENCE
  if (expressionTemp.length == lastNumberSequence.length) {
    expressionTemp = `(−${expressionTemp}`;
    sentence.innerHTML = expressionTemp;
    closingCount++;
    if (expressionTemp.length > 2) {
      calculate(expressionTemp);
    }
    return;
  }

  // LOGIC CONDITIONS TO IDENTIFY IF ITS NEGATIVE
  const elementBeforeLastNumberSequence =
    expressionTemp.length - lastNumberSequence.length;
  const itsNegative =
    expressionTemp.slice(
      elementBeforeLastNumberSequence - 2,
      elementBeforeLastNumberSequence
    ) == "(−";

  // TURNS NEGATIVE AFTER OPERATOR
  if (regExOperators.test(lastElement) && !itsNegative) {
    sentence.innerHTML = expressionTemp.concat("(−");
    closingCount++;
    calculate(sentence.innerHTML);
    return;
  }

  // TURNS NEGATIVE ANY SEQUENCE NUMBER AFTER THE FIRST ONE
  if (!itsNegative && (regExNumber.test(lastElement) || lastElement == "(")) {
    expressionTemp = expressionTemp.split("");
    expressionTemp.splice(elementBeforeLastNumberSequence, 0, "(−");
    sentence.innerHTML = expressionTemp.join("");
    closingCount++;
    calculate(sentence.innerHTML);
    return;
  }

  // VERIFY IF LAST NUMBER SEQUENCE IF NEGATIVE AND TRANFORM IN POSITIVE
  if (itsNegative) {
    let beforeNegative = expressionTemp.slice(
      0,
      elementBeforeLastNumberSequence - 2
    );
    let afterNegative = expressionTemp.slice(
      elementBeforeLastNumberSequence,
      expressionTemp.length
    );

    expressionTemp = sentence.innerHTML = `${beforeNegative}${afterNegative}`;
    closingCount--;
    if (expressionTemp != "" && regExNumber.test(lastElement)) {
      if (lastNumberSequenceOfArray().length == expressionTemp.length) {
        result.innerHTML = "";
        return;
      }
      calculate(expressionTemp);
    }
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
    parL(itsNumber, lastElement);
    return;
  }

  if (hasNumberBetween && closingCount > 0) {
    parR();
    calculate(sentence.innerHTML);
    return;
  }
}

// ADD LEFT BRACKET
function parL(itsNumber, lastElement) {
  if (lastElement == ".") {
    sentence.innerHTML += "0×";
  }
  closingCount++;
  sentence.innerHTML += itsNumber || lastElement == ")" ? "×(" : "(";
}

// ADD RIGHT BRACKET
function parR() {
  sentence.innerHTML += ")";
  closingCount--;
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

  if (sequenceArray().length == 1) {
    result.innerHTML = "";
    return;
  }

  if (regExNumber.test(lastElement)) {
    calculate(sentence.innerHTML);
  }

  if (sentence.innerHTML.length == 0) {
    result.innerHTML = "";
  }
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

// FUNCTION RESPONSIBLE FOR ALL THE OPERATORS
function expression(btn) {
  // GET MATH EXPRESSION
  let expression = sentence.innerHTML;
  const operatorBtn = btn.classList.contains("operator");
  const dotBtn = btn.id == "dot";

  // GET LAST ELEMENT OF THE EXPRESSION
  let lastElement = expression[expression.length - 1];

  // VERIFY IF ANY BUTTON THAN A NUMBER IS CLICKED AND LAST ELEMENT IS A DOT TO ADD A ZERO
  if (lastElement == "." && !regExNumber.test(btn.value)) {
    expression += "0";
    lastElement = "0";
  }

  // VERIFY IF ITS A DOT BUTTON CLICKED AND ITS THE FIRST ELEMENT OF THE EXPRESSION
  if (dotBtn && expression.length == 0) {
    expression = "0.";
    sentence.innerHTML = expression;
    return;
  }

  // ADDS A ZERO AFTER ANY DOT TO START ANY OPERATION
  if (dotBtn && regExOperators.test(lastElement)) {
    expression += "0";
    lastElement = "0";
  }

  // GET LAST NUMBER SEQUENCE OF THE EXPRESSION
  let lastNumberSequence = lastNumberSequenceOfArray();

  // REGEX THAT CHECKS IF THE LAST NUMBER SEQUENCE HAS A DOT
  const regExDot = /\./;
  const hasDot = regExDot.test(lastNumberSequence);

  // REGEX THAT CHECKS IF THE LAST ELEMENT IS A NUMBER
  const itsNumber = regExNumber.test(lastElement);

  // VERIFY IF THE EXPRESSION IS BEING MADE AFTER EQUALS CLICK
  if (equalsClicked && regExNumber.test(btn.value)) {
    expression = "";
    closingCount = 0;
  }

  equalsClicked = false;

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
    if (expression[expression.length - 2] == "(" && !/−|\+/.test(btn.value)) {
      return;
    }
    expression = expression.slice(0, -1).concat(btn.value);
    sentence.innerHTML = expression;
    return;
  }

  // VERIFY IF BUTTON CLICKED IS AN OPERATOR AND ITS NOT FOLLOWED BY A NUMBER
  if (operatorBtn && lastElement != ")") {
    if (operatorBtn && !itsNumber) {
      // IF THE LAST VALUE ITS A LEFT BRACKET AND THE BTN VALUE ITS A MINUS OR PLUS SIGN, IT WILL PASS, OTHERWISE, IT WILL RETURN
      if (!(/−|\+/.test(btn.value) && lastElement == "(")) {
        return;
      }
    }
  }

  // VERIFY IF BUTTON CLICKED IS A DOT AND IST NOT FOLLOWED BY A NUMBER AND THE NUMBER SEQUENCE ALREADY HAS A DOT
  if (btn.id == "dot" && (!itsNumber || hasDot)) {
    return;
  }

  // VERIFY IF LAST ELEMENT IS A CLOSING BRACKET AND ITS NOT AN OPERATOR, THEN ADDS A MULTIPLICATION SIGN
  if (lastElement == ")" && !operatorBtn) {
    expression += "×";
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
