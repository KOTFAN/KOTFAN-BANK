"use strict";

// state
const accounts = [
  {
    owner: "KOTFAN",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    userName: "kotfan",
  },
  {
    owner: "Scrooge mak dak",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    userName: "smd",
  },
  {
    owner: "Nami",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    userName: "moneyLover",
  },
  {
    owner: "Montgomery Burns",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    userName: "springfild228",
  },
];
let currentUser = null;
let isSortOn = true;
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//====================display===========================
const displayMovements = function (movmentsArr, isNeedToBeSort = false) {
  const movements = isNeedToBeSort
    ? movmentsArr.slice().sort((a, b) => a - b)
    : movmentsArr;

  containerMovements.innerHTML = "";
  movements.forEach((mov, i) => {
    const movType = mov > 0 ? "deposit" : "withdrawal";
    containerMovements.insertAdjacentHTML(
      "afterbegin",
      `<div class="movements__row">
            <div class="movements__type movements__type--${movType}">${
        i + 1
      } ${movType}</div>
            <div class="movements__value">${mov} $</div>
         </div>`
    );
  });
};

const displayAndCalculateBalance = function (acc) {
  acc.balance = acc.movements.reduce((a, v) => a + v, 0);
  labelBalance.textContent = `${acc.balance} $`;
};

const displayUserName = function (name = "") {
  if (name.length && typeof name === "string") {
    const userFristName = name.split(" ")[0];
    return (
      userFristName[0].toUpperCase() + userFristName.slice(1).toLowerCase()
    );
  }
  return "Invalid name";
};
//===============================================

//======================total-analitisc-and-sorting==================================================
const displayTotalIn = function (movements = []) {
  labelSumIn.textContent = movements
    .filter((num) => num > 0)
    .reduce((a, v) => a + v);
};

const displayTotalOut = function (movements = []) {
  labelSumOut.textContent = Math.abs(
    movements.filter((num) => num < 0).reduce((a, v) => a + v)
  );
};

const displayTotalInterest = function (movements = [], prosent = 0) {
  labelSumInterest.textContent = movements
    .filter((num) => num > 0)
    .map((mov) => (mov * prosent) / 100)
    .reduce((a, v) => a + v)
    .toFixed(2);
};

//sortMovmentsHandler
const sortMovments = (e) => {
  e.preventDefault();

  displayMovements(currentUser.movements, isSortOn);
  isSortOn = !isSortOn;
};
//=======================================================================

//clear fields and remove coursor from field
const clearFields = (...fields) => {
  fields.forEach((field) => {
    field.value = "";
    field.blur();
  });
};

//===================UI-changes=================================
//show ui after login
const displayUI = ({ owner }) => {
  containerApp.style.opacity = 1;
  containerApp.style.visibility = "visible";

  //show welcome to person
  const name = displayUserName(owner);
  labelWelcome.textContent = `Welcome, ${name}`;

  clearFields(inputLoginUsername, inputLoginPin);
};
//hide ui after login
const hideUI = () => {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Log or sign up";
  containerApp.style.visibility = "hidden";
};
//update ui after some action of current user
const updateUI = (currentUser) => {
  displayUI(currentUser);
  displayMovements(currentUser.movements);

  displayAndCalculateBalance(currentUser);

  displayTotalIn(currentUser.movements);
  displayTotalOut(currentUser.movements);
  displayTotalInterest(currentUser.movements, currentUser.interestRate);
};
//=============================================================

//=====================left-3-fields============================
//MoneyTransferingHendler
const MoneyTransfering = (e) => {
  e.preventDefault();

  //get values for transaction
  const sendTo = accounts.find((acc) => acc.userName === inputTransferTo.value);
  const sendAmong = Number(inputTransferAmount.value);

  if (
    currentUser.balance >= sendAmong &&
    sendTo &&
    sendAmong > 0 &&
    currentUser !== sendTo
  ) {
    currentUser.movements.push(-sendAmong);
    sendTo.movements.push(sendAmong);

    updateUI(currentUser);
    clearFields(inputTransferTo, inputTransferAmount);
  }
};

//requestLoanHandler
const requestLoan = (e) => {
  e.preventDefault();
  const among = Number(inputLoanAmount.value);

  if (among > 0 && currentUser.movements.some((mov) => mov >= among * 0.1)) {
    currentUser.movements.push(among);

    updateUI(currentUser);
    clearFields(inputLoanAmount);
  }
};

//deleteAccountHandler
const deleteAccount = (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.userName &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const delIndex = accounts.findIndex(
      (acc) =>
        acc.userName === inputCloseUsername.value &&
        acc.pin === Number(inputClosePin.value)
    );
    accounts.splice(delIndex, 1);

    clearFields(inputCloseUsername, inputClosePin);
    hideUI();
  }
};
//=========================================================================

const login = (e) => {
  e.preventDefault();
  currentUser = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  hideUI();

  //clear all eventListeners exept login
  btnTransfer.removeEventListener("click", MoneyTransfering);
  btnClose.removeEventListener("click", deleteAccount);
  btnLoan.removeEventListener("click", requestLoan);
  btnSort.removeEventListener("click", sortMovments);

  if (currentUser) {
    //user is logined so do...
    updateUI(currentUser);

    //add event Listeners
    btnTransfer.addEventListener("click", MoneyTransfering);
    btnClose.addEventListener("click", deleteAccount);
    btnLoan.addEventListener("click", requestLoan);
    btnSort.addEventListener("click", sortMovments);
  }
};

/////////////////////////////////////////////////
//Loginisation
btnLogin.addEventListener("click", login);
