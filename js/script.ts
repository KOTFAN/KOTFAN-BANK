"use strict";
//types

type Сurrency = "UAH" | "GBP" | "EUR" | "USD";
type Locale = "ua-Uk" | "pt-PT" | "de-DE" | "en-US";
type ISO8601DateString =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

interface Account {
  owner: string;
  movements: number[];
  interestRate: number;
  pin: number;
  userName: string;
  movementsDates: ISO8601DateString[];
  currency: Сurrency;
  balance?: number;
  locale: Locale;
}

interface MoneyTransfer {
  movAmong: number;
  movDate: Date;
}

// state
const accounts: Account[] = [
  {
    owner: "KOTFAN",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    userName: "kotfan",
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2025-07-09T13:04:00.000Z",
      "2025-07-13T13:04:00.000Z",
      "2025-07-15T13:04:00.000Z",
      "2025-07-16T13:04:00.000Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Scrooge mak dak",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    userName: "smd",
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-05-27T17:01:17.194Z",
      "2020-07-11T23:36:17.929Z",
      "2020-07-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT",
  },
  {
    owner: "Nami",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    userName: "moneyLover",
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-05-27T17:01:17.194Z",
      "2020-07-11T23:36:17.929Z",
      "2020-07-12T10:51:36.790Z",
    ],
    currency: "GBP",
    locale: "de-DE",
  },
  {
    owner: "Montgomery Burns",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    userName: "springfild228",
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
    ],
    currency: "UAH",
    locale: "ua-Uk",
  },
];

let currentUser: null | Account = null;
let isSortOn: boolean = true;
let timer: undefined | number;

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
const dateOnScrean = document.querySelector(".date");
const timerOnScrean = document.querySelector(".timer");

//====================display===========================
const displayMovements = function (
  currentUser: Account,
  isNeedToBeSort = false
) {
  if (currentUser === null) {
    throw new Error("No User");
  }
  const moneyTransfers: MoneyTransfer[] = currentUser.movements.map(
    (mov, i) => {
      return {
        movAmong: mov,
        movDate: new Date(currentUser.movementsDates[i]),
      };
    }
  );

  if (isNeedToBeSort) {
    moneyTransfers.sort((a, b) => a.movAmong - b.movAmong);
  }

  containerMovements.innerHTML = "";
  moneyTransfers.forEach(({ movAmong, movDate }, i) => {
    const movType = movAmong > 0 ? "deposit" : "withdrawal";

    const whenWasMovDate = formatMovmentDate(movDate);
    containerMovements.insertAdjacentHTML(
      "afterbegin",
      `<div class="movements__row">
            <div class="movements__type movements__type--${movType}">${
        i + 1
      } ${movType}</div>
            <div class="movements__date">${whenWasMovDate}</div>
            <div class="movements__value">${movAmong} $</div>
         </div>`
    );
  });
};

const displayAndCalculateBalance = function (acc: Account): void {
  acc.balance = acc.movements.reduce((a, v) => a + v, 0);
  if (labelBalance) {
    labelBalance.textContent = `${acc.balance} $`;
  }
};

const displayUserName = function (name: string): string {
  if (name.length) {
    const userFristName = name.split(" ")[0]; //wtf its can't be undefined
    if (userFristName) {
      return (
        userFristName[0]?.toUpperCase() + userFristName.slice(1).toLowerCase()
      );
    }
  }
  return "Invalid name";
};

//===============================================

//======================total-analitisc-and-sorting==================================================
const displayTotalIn = function (movements: number[]): void {
  if (labelSumIn) {
    const totalIn = movements.filter((num) => num > 0).reduce((a, v) => a + v);
    labelSumIn.textContent = String(totalIn);
  }
};

const displayTotalOut = function (movements: number[]): void {
  if (labelSumOut) {
    const totalOut = Math.abs(
      movements.filter((num) => num < 0).reduce((a, v) => a + v)
    );
    labelSumOut.textContent = String(totalOut);
  }
};

const displayTotalInterest = function (
  movements: number[],
  prosent: number
): void {
  if (labelSumInterest) {
    const totlaInterest = movements
      .filter((num) => num > 0)
      .map((mov) => (mov * prosent) / 100)
      .reduce((a, v) => a + v)
      .toFixed(2);

    labelSumInterest.textContent = String(totlaInterest);
  }
};

//sortMovmentsHandler
const sortMovments = (e) => {
  e.preventDefault();

  displayMovements(currentUser, isSortOn);
  isSortOn = !isSortOn;
};

const formatDateAsDayMonthYear = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatMovmentDate = (date) => {
  const currentDate = new Date();
  const dayDifference =
    (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (dayDifference < 1) {
    return "Today";
  }
  if (dayDifference < 2) {
    return "Yesterday";
  }
  if (dayDifference < 7) {
    return `${Math.floor(dayDifference)} days ago`;
  }
  return formatDateAsDayMonthYear(date);
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
  currentUser = null;
  if (timer) {
    clearInterval(timer);
  }
};
//update ui after some action of current user
const updateUI = (currentUser) => {
  displayUI(currentUser);
  displayMovements(currentUser);

  displayAndCalculateBalance(currentUser);

  displayTotalIn(currentUser.movements);
  displayTotalOut(currentUser.movements);
  displayTotalInterest(currentUser.movements, currentUser.interestRate);

  if (!timer) {
    startTimer();
  } else {
    clearInterval(timer);
    startTimer();
  }
};

const startTimer = () => {
  let secondsBeforeLogOut = 5 * 60;
  function tick() {
    const min = String(Math.floor(secondsBeforeLogOut / 60)).padStart(2, "0");
    const sec = String(secondsBeforeLogOut % 60).padStart(2, "0");
    timerOnScrean.textContent = `${min}:${sec}`;

    if (secondsBeforeLogOut === 0) {
      clearInterval(timer);
      hideUI();
    }

    secondsBeforeLogOut = secondsBeforeLogOut - 1;
  }

  tick();
  timer = setInterval(tick, 1000);
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
    currentUser.movementsDates.push(new Date().toISOString());
    sendTo.movements.push(sendAmong);
    sendTo.movementsDates.push(new Date().toISOString());

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
    currentUser.movementsDates.push(new Date().toISOString());

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

  //clear all eventListeners exept login
  btnTransfer.removeEventListener("click", MoneyTransfering);
  btnClose.removeEventListener("click", deleteAccount);
  btnLoan.removeEventListener("click", requestLoan);
  btnSort.removeEventListener("click", sortMovments);

  //display date
  dateOnScrean.textContent = formatDateAsDayMonthYear(new Date());

  if (currentUser) {
    //user is logined so do...
    updateUI(currentUser);

    //add event Listeners
    btnTransfer.addEventListener("click", MoneyTransfering);
    btnClose.addEventListener("click", deleteAccount);
    btnLoan.addEventListener("click", requestLoan);
    btnSort.addEventListener("click", sortMovments);
  } else {
    hideUI();
  }
};

/////////////////////////////////////////////////
//Loginisation
btnLogin.addEventListener("click", login);
