'use strict';

// Data
const account1 = {
   owner: 'KOTFAN',
   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
   interestRate: 1.2, // %
   pin: 1111,
};

const account2 = {
   owner: 'Scrooge mak dak',
   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
   interestRate: 1.5,
   pin: 2222,
};

const account3 = {
   owner: 'Nami',
   movements: [200, -200, 340, -300, -20, 50, 400, -460],
   interestRate: 0.7,
   pin: 3333,
};

const account4 = {
   owner: 'Montgomery Burns',
   movements: [430, 1000, 700, 50, 90],
   interestRate: 1,
   pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const currencies = new Map([
   ['USD', 'United States dollar'],
   ['EUR', 'Euro'],
   ['GBP', 'Pound sterling'],
]);

const displayMovements = function (movmentsArr) {

   movmentsArr.forEach((mov, i) => {
      let movType = mov > 0 ? 'deposit' : 'withdrawal'


      containerMovements.insertAdjacentHTML("afterbegin",
         `<div class="movements__row">
            <div class="movements__type movements__type--${movType}">${i + 1} deposit</div>
            <div class="movements__value">${mov} $</div>
         </div>`)
   })
}


const displayBalance = function (movements = []) {
   const sum = movements.reduce((a, v) => a + v, 0)
   labelBalance.textContent = `${sum} $`
}

const displayUserName = function (name = '') {
   if (name.length && typeof name === 'string') {
      return name[0].toUpperCase() + name.slice(1, name.length).toLowerCase()
   }
   return 'Invalid name'

}

const displayTotalIn = function (movements = []) {
   labelSumIn.textContent = movements.filter((num) => num > 0).reduce((a, v) => a + v)
}

const displayTotalOut = function (movements = []) {
   labelSumOut.textContent = Math.abs(movements.filter((num) => num < 0).reduce((a, v) => a + v))
}

const displayTotalInterest = function (movements = [], prosent = 100) {
   labelSumInterest.textContent = movements.filter((num) => num > 0).map((mov) => mov * prosent / 100).reduce((a, v) => a + v)
}

/////////////////////////////////////////////////

displayMovements(account1.movements)
displayBalance(account1.movements)
displayTotalIn(account1.movements)
displayTotalOut(account1.movements)
displayTotalInterest(account1.movements, account1.interestRate)