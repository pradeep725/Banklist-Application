"use strict";

//BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDate: [
    "2019-11-18T21:31:17.1782",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-05-27T17:01:17.194Z",
    "2021-12-11T23:15:17.929Z",
    "2021-12-15T10:15:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDate: [
    "2019-11-01T13:15:33.035Z",
    "2019-12-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "today";
  if (daysPassed === 1) return "yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  //.textContent=0

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDate[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row"> 
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
              <div class="movements__date">${displayDate}</div>
           <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
//displayMovements(account1.movements);

// Display  total balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  //console.log(incomes);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //console.log(out);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
//calcDisplaySummary(account1.movements);

//calcDisplayBalance(account1.movements);
//const user = "steven Thomas Williams";
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min} :${sec}`;

    //When 0 seconds ,stop timer and log out user
    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = "Log in to get started";

      containerApp.style.opacity = 0;
    }
    //Decrease 1s
    time--;
  };
  //Set time to 5 minutes
  let time = 120;

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// Event handler

let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);

// containerApp.style.opacity = 100;

//Experimenting API

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log("LOGIN");
    //Display UI and message
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year} , ${hour}:${minutes}`;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //updateUI

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  //console.log(amount, receiverAcc);

  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log("Transfer valid");
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // creating dates
    currentAccount.movementsDate.push(new Date().toISOString());
    receiverAcc.movementsDate.push(new Date().toISOString());

    //update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movements
      currentAccount.movements.push(amount);

      //creating dates
      currentAccount.movementsDate.push(new Date().toISOString());

      //updateUI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    //console.log(index);
    //Delete account

    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

//console.log(accounts);
//for (const [i, x] of user.entries()) console.log(x[0]);

// console.log(containerMovements.innerHTML);

//const euroToUsd = 1.1;
// const movementsUSD = movements.map(function (euro) {
//   return euro * euroToUsd;
// });

// const movementsUSD = movements.map((euro) => euro * euroToUsd);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUsd = [];
// for (const move of movements) movementsUsd.push(move * euroToUsd);
// console.log(movementsUSD);

// const movementsDescription = movements.map((mov, i) => {
//   return `Movements ${i + 1}: you ${
//     mov > 0 ? "deposit" : "withdraw"
//   } ${Math.abs(mov)}`;
// });
// console.log(movementsDescription);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

// const withdrawalsFor = [];
// for (const mov of movements) if (mov < 0) withdrawalsFor.push(mov);
// console.log(withdrawalsFor);
// console.log(...movements);
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(acc);
//   return acc + cur;
// }, 0);
// console.log(balance);

// let sum = 0;
// for (const mov of movements) sum += mov;
// console.log(sum);

// let max = 0;
// const abc = [1, 2, 3, 4, 10, 5, 6, 7, 8, 9];
// for (let i = 0; i < abc.length; i++) {
//   if (abc[i] > max) {
//     max = abc[i];
//   }
// }
// console.log(max);

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// //find method
// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account);

// btnLogin.addEventListener("click", function (e) {
//   e.preventDefault();
//   console.log("LOGIN");
// });

// some method

// console.log(movements);
// console.log(movements.includes(-130));
// const anyDeposit = movements.some((mov) => mov > 0);
// console.log(anyDeposit);

// flat and flatMap methods
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8, 9];
// console.log(arr.flat());
// const deepArr = [[[[1, 2, 3]]], [[4, 5, 6]], 7, 8, 9];
// console.log(deepArr.flat(3));

// const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov);
// console.log(overalBalance);

// flat
// const accountMovements = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);
// console.log(accountMovements);

// //flatMap
// const accountMovements2 = accounts
//   .flatMap((acc) => acc.movements)

//   .reduce((acc, mov) => acc + mov);
// console.log(accountMovements2);

// const owner = ["Jonas", "Adam", "Micheal", "Martha"];
// console.log(owner.sort());

//console.log(movements.sort());

//return <0 a, b keep order
//return >0 b, a  switch order

// movements.sort((a, b) => {
//   if (a > b) {
//     return 1;
//   } else if (a < b) {
//     return -1;
//   }
// });

// movements.sort((a, b) => a - b);

// console.log(movements);
// movements.sort((a, b) => b - a);
// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// //Empty arrays + fill method
// const x = new Array(7);
// console.log(x);

// console.log(x.fill(1, 2, 4));
// console.log(arr.fill(25, 4, 6));

// //Array.from
// const y = Array.from({ length: 7 }, () => 5);
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const a = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
// console.log(a);

// labelBalance.addEventListener("click", function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value"),
//     (el) => Number(el.textContent.replace("€", ""))
//   );
//   console.log(movementsUI);

//# coding challenge 4
//Test Data:
// const dogs = [
//   {
//     weight: 22,
//     curfood: 250,
//     owners: ["Alice", "Bob"],
//   },

//   {
//     weight: 8,
//     curfood: 200,
//     owners: ["Matilda"],
//   },
//   {
//     weight: 13,
//     curfood: 275,
//     owners: ["Sarah", "John"],
//   },
//   {
//     weight: 32,
//     curfood: 340,
//     owners: ["Michael"],
//   },
// ];

// 1.
// dogs.forEach((dog) => {
//   return (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28));
// });
// console.log(dogs);

//2.

// const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog eating ${
//     dogSarah.curfood > dogSarah.recFood ? "much" : "little"
//   } `
// );

//3.
// const ownerEatTooMuch = dogs
//   .filter((ele, i, arr) => ele.curfood > ele.recFood)
//   .map((ele) => ele.owners)
//   .flat();
// console.log(ownerEatTooMuch);

// const ownerEatTooLittle = dogs
//   .filter((ele) => ele.curfood < ele.recFood)
//   .flatMap((ele) => ele.owners);
// // .flat();
// console.log(ownerEatTooLittle);

// //4.
// console.log(`${ownerEatTooMuch.join(" and ")}'s dogs eat too much`);
// console.log(`${ownerEatTooLittle.join(" and ")}'s dogs eat too little`);

//5.
// console.log(dogs.some((ele) => ele.curfood === ele.recFood));

//6.
// const checkEatingOkay = (ele) =>
//   ele.curfood > ele.recFood * 0.9 && ele.curfood < ele.recFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

//7.
// console.log(dogs.filter(checkEatingOkay));

//8.
// console.log(dogs.slice().sort((a, b) => a.recFood - b.recFood));
// here a and b are the objects
// slice is used to make a copy

//1.
// dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);

// //2.
// const owner = dogs.find((dog) => dog.owners.includes("Sarah"));
// console.log(owner);
// console.log(
//   `Sarah's dog eating too ${owner.curfood > owner.recFood ? "much" : "little"}`
// );

// //3.
// const ownerEatTooMuch = dogs
//   .filter((dog) => dog.curfood > dog.recFood)
//   .flatMap((dog) => dog.owners);
// console.log(ownerEatTooMuch);

// const ownerEatTooLittle = dogs
//   .filter((dog) => dog.curfood < dog.recFood)
//   .flatMap((dog) => dog.owners);
// console.log(ownerEatTooLittle);

// //4.
// console.log(`${ownerEatTooMuch.join(" and ")}'s dogs eat too much`);
// console.log(`${ownerEatTooLittle.join(" and ")}'s dogs eat too little`);

// //5.
// console.log(dogs.some((dog) => dog.curfood === dog.recFood));

// //6.

// const checkEatingOkay = (dog) =>
//   dog.curfood > dog.recFood * 0.9 && dog.curfood < dog.recFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

// //7.

// console.log(dogs.filter(checkEatingOkay));

// //8.
// console.log(dogs.slice().sort((a, b) => a.recFood - b.recFood));

//converting and checking Numbers

// console.log(23 === 23.0);

// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

//conversion
// console.log(Number("23"));
// console.log(+"23");

//parsing
// console.log(Number.parseInt("30px"));
// console.log(Number.parseFloat("30.5px"));

// console.log(Number.isNaN(Number(23)));
// console.log(isNaN(23));
// console.log(Number.isNaN(+"20X"));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 2, 8, 24));
// console.log(Math.max(5, 2, 8, "24"));
// console.log(Math.max(5, 2, 8, "24px"));
// console.log(Math.min(5, 2, 8, "24px"));

// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));
//0...1-> 0...(max-min)-> min...max;

//Rounding integers
// console.log(Math.round(23.3));
// console.log(Math.round(-23.3));
// console.log(Math.ceil(23.3));
// console.log(Math.floor(23.3));
// console.log(Math.floor(-23.3));
// console.log(Math.trunc(-23.3));
// console.log(Math.round(23.3));

//Rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.725).toFixed(2));
// console.log(typeof +(2.725).toFixed(2));

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       return (row.style.backgroundColor = "blue");
//     }
//   });
// });

//BigInt
// console.log(2 ** 53 - 1);
// console.log(2 ** 53 + 0);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(45668774112333699998877n);
// console.log(BigInt(45668774112333699998877));

//Operations
// console.log(10000n + 10000n);

// const huge = 2021346789985546687266621456n;
// const num = 23;
// console.log(huge * BigInt(num));

//Exceptions
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(20n == 20);
// console.log(typeof 20n);
// console.log(20n == "20");

// console.log(typeof (huge + "is really a big number "));

// const future = new Date(2037, 10, 21, 15, 23, 6);
// console.log(future);
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(2142409986000));
// future.setFullYear(2040);
// console.log(future);
// console.log(Date.now());

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future));

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const check = calcDaysPassed(new Date(2020, 10, 14), new Date(2020, 10, 24));
// console.log(check);

// const num = 3884765.24;

// const options = {
//   style: "currency",
//   unit: "mile-per-hour",
//   currency: "EUR",
//   useGrouping: false,
// };
// console.log("US: ", new Intl.NumberFormat("en-US", options).format(num));
// console.log("Germany: ", new Intl.NumberFormat("de-DE", options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

//setTimeout
// const ingredients = ["olive"];
// const PizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );

// if (ingredients.includes("spinach")) clearTimeout(PizzaTimer);

//setInterval

// setInterval(function () {
//   const now = new Date();
//   const hour = now.getHours();
//   const minutes = now.getMinutes();
//   const seconds = now.getSeconds();
//   console.log(`${hour}: ${minutes}: ${seconds}`);
// }, 1000);
