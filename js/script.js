"use strict";
// state
var accounts = [
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
            "2025-07-09T13:04:00.000Z", // 7 днів тому
            "2025-07-13T13:04:00.000Z", // 3 дні тому
            "2025-07-15T13:04:00.000Z", // вчора
            "2025-07-16T13:04:00.000Z", // сьогодні
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
        locale: "ua-UK",
    },
];
var currentUser = null;
var isSortOn = true;
var currencies = new Map([
    ["USD", "United States dollar"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"],
]);
var timer;
// Elements
var labelWelcome = document.querySelector(".welcome");
var labelDate = document.querySelector(".date");
var labelBalance = document.querySelector(".balance__value");
var labelSumIn = document.querySelector(".summary__value--in");
var labelSumOut = document.querySelector(".summary__value--out");
var labelSumInterest = document.querySelector(".summary__value--interest");
var labelTimer = document.querySelector(".timer");
var containerApp = document.querySelector(".app");
var containerMovements = document.querySelector(".movements");
var btnLogin = document.querySelector(".login__btn");
var btnTransfer = document.querySelector(".form__btn--transfer");
var btnLoan = document.querySelector(".form__btn--loan");
var btnClose = document.querySelector(".form__btn--close");
var btnSort = document.querySelector(".btn--sort");
var inputLoginUsername = document.querySelector(".login__input--user");
var inputLoginPin = document.querySelector(".login__input--pin");
var inputTransferTo = document.querySelector(".form__input--to");
var inputTransferAmount = document.querySelector(".form__input--amount");
var inputLoanAmount = document.querySelector(".form__input--loan-amount");
var inputCloseUsername = document.querySelector(".form__input--user");
var inputClosePin = document.querySelector(".form__input--pin");
var dateOnScrean = document.querySelector(".date");
var timerOnScrean = document.querySelector(".timer");
//====================display===========================
var displayMovements = function (currentUser, isNeedToBeSort) {
    if (currentUser === void 0) { currentUser = {}; }
    if (isNeedToBeSort === void 0) { isNeedToBeSort = false; }
    var moneyTransfers = currentUser.movements.map(function (mov, i) {
        return { movAmong: mov, movDate: new Date(currentUser.movementsDates[i]) };
    });
    if (isNeedToBeSort) {
        moneyTransfers.sort(function (a, b) { return a.movAmong - b.movAmong; });
    }
    containerMovements.innerHTML = "";
    moneyTransfers.forEach(function (_a, i) {
        var movAmong = _a.movAmong, movDate = _a.movDate;
        var movType = movAmong > 0 ? "deposit" : "withdrawal";
        var whenWasMovDate = formatMovmentDate(movDate);
        containerMovements.insertAdjacentHTML("afterbegin", "<div class=\"movements__row\">\n            <div class=\"movements__type movements__type--".concat(movType, "\">").concat(i + 1, " ").concat(movType, "</div>\n            <div class=\"movements__date\">").concat(whenWasMovDate, "</div>\n            <div class=\"movements__value\">").concat(movAmong, " $</div>\n         </div>"));
    });
};
var displayAndCalculateBalance = function (acc) {
    acc.balance = acc.movements.reduce(function (a, v) { return a + v; }, 0);
    labelBalance.textContent = "".concat(acc.balance, " $");
};
var displayUserName = function (name) {
    if (name === void 0) { name = ""; }
    if (name.length && typeof name === "string") {
        var userFristName = name.split(" ")[0];
        return (userFristName[0].toUpperCase() + userFristName.slice(1).toLowerCase());
    }
    return "Invalid name";
};
//===============================================
//======================total-analitisc-and-sorting==================================================
var displayTotalIn = function (movements) {
    if (movements === void 0) { movements = []; }
    labelSumIn.textContent = movements
        .filter(function (num) { return num > 0; })
        .reduce(function (a, v) { return a + v; });
};
var displayTotalOut = function (movements) {
    if (movements === void 0) { movements = []; }
    labelSumOut.textContent = Math.abs(movements.filter(function (num) { return num < 0; }).reduce(function (a, v) { return a + v; }));
};
var displayTotalInterest = function (movements, prosent) {
    if (movements === void 0) { movements = []; }
    if (prosent === void 0) { prosent = 0; }
    labelSumInterest.textContent = movements
        .filter(function (num) { return num > 0; })
        .map(function (mov) { return (mov * prosent) / 100; })
        .reduce(function (a, v) { return a + v; })
        .toFixed(2);
};
//sortMovmentsHandler
var sortMovments = function (e) {
    e.preventDefault();
    displayMovements(currentUser, isSortOn);
    isSortOn = !isSortOn;
};
var formatDateAsDayMonthYear = function (date) {
    return "".concat(date.getDate(), "/").concat(date.getMonth() + 1, "/").concat(date.getFullYear());
};
var formatMovmentDate = function (date) {
    var currentDate = new Date();
    var dayDifference = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    if (dayDifference < 1) {
        return "Today";
    }
    if (dayDifference < 2) {
        return "Yesterday";
    }
    if (dayDifference < 7) {
        return "".concat(Math.floor(dayDifference), " days ago");
    }
    return formatDateAsDayMonthYear(date);
};
//=======================================================================
//clear fields and remove coursor from field
var clearFields = function () {
    var fields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i];
    }
    fields.forEach(function (field) {
        field.value = "";
        field.blur();
    });
};
//===================UI-changes=================================
//show ui after login
var displayUI = function (_a) {
    var owner = _a.owner;
    containerApp.style.opacity = 1;
    containerApp.style.visibility = "visible";
    //show welcome to person
    var name = displayUserName(owner);
    labelWelcome.textContent = "Welcome, ".concat(name);
    clearFields(inputLoginUsername, inputLoginPin);
};
//hide ui after login
var hideUI = function () {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log or sign up";
    containerApp.style.visibility = "hidden";
    currentUser = null;
    if (timer) {
        clearInterval(timer);
    }
};
//update ui after some action of current user
var updateUI = function (currentUser) {
    displayUI(currentUser);
    displayMovements(currentUser);
    displayAndCalculateBalance(currentUser);
    displayTotalIn(currentUser.movements);
    displayTotalOut(currentUser.movements);
    displayTotalInterest(currentUser.movements, currentUser.interestRate);
    if (!timer) {
        startTimer();
    }
    else {
        clearInterval(timer);
        startTimer();
    }
};
var startTimer = function () {
    var secondsBeforeLogOut = 5 * 60;
    function tick() {
        var min = String(Math.floor(secondsBeforeLogOut / 60)).padStart(2, "0");
        var sec = String(secondsBeforeLogOut % 60).padStart(2, "0");
        timerOnScrean.textContent = "".concat(min, ":").concat(sec);
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
var MoneyTransfering = function (e) {
    e.preventDefault();
    //get values for transaction
    var sendTo = accounts.find(function (acc) { return acc.userName === inputTransferTo.value; });
    var sendAmong = Number(inputTransferAmount.value);
    if (currentUser.balance >= sendAmong &&
        sendTo &&
        sendAmong > 0 &&
        currentUser !== sendTo) {
        currentUser.movements.push(-sendAmong);
        currentUser.movementsDates.push(new Date().toISOString());
        sendTo.movements.push(sendAmong);
        sendTo.movementsDates.push(new Date().toISOString());
        updateUI(currentUser);
        clearFields(inputTransferTo, inputTransferAmount);
    }
};
//requestLoanHandler
var requestLoan = function (e) {
    e.preventDefault();
    var among = Number(inputLoanAmount.value);
    if (among > 0 && currentUser.movements.some(function (mov) { return mov >= among * 0.1; })) {
        currentUser.movements.push(among);
        currentUser.movementsDates.push(new Date().toISOString());
        updateUI(currentUser);
        clearFields(inputLoanAmount);
    }
};
//deleteAccountHandler
var deleteAccount = function (e) {
    e.preventDefault();
    if (inputCloseUsername.value === currentUser.userName &&
        Number(inputClosePin.value) === currentUser.pin) {
        var delIndex = accounts.findIndex(function (acc) {
            return acc.userName === inputCloseUsername.value &&
                acc.pin === Number(inputClosePin.value);
        });
        accounts.splice(delIndex, 1);
        clearFields(inputCloseUsername, inputClosePin);
        hideUI();
    }
};
//=========================================================================
var login = function (e) {
    e.preventDefault();
    currentUser = accounts.find(function (acc) {
        return acc.userName === inputLoginUsername.value &&
            acc.pin === Number(inputLoginPin.value);
    });
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
    }
    else {
        hideUI();
    }
};
/////////////////////////////////////////////////
//Loginisation
btnLogin.addEventListener("click", login);
