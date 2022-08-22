"use strict";

const MIN_AMOUNT_NUM = 3;
const MAX_AMOUNT_NUM = 6;

const COMPUTER_NUMBER_STR = getRandomNumStr();

console.log(`number of ${COMPUTER_NUMBER_STR.length} characters\n`);

// console.log(`this number is ${COMPUTER_NUMBER_STR}`);

const readlineSync = require('readline-sync');

let tries = readlineSync.question('how many tries do you need: ');
if (parseInt(tries) > 0) {
    console.log(`you have ${tries} tries left\n`);
} else {
    // Если получаем некорректный ввод, дадим игроку 4 попытки
    console.log("Let's assume it's 4\n");
    tries = 4;
}

let win = false;

while (!win && tries) {
    let userInput = readlineSync.question('your number: ');
    let correctInput = validateUserInput(userInput);
    if (correctInput) {
        compareNumbers(userInput);
        if (!win) {console.log(`${--tries} tries left\n`);}
    }
}

if (tries === 0) {console.log('the tries are over');}

// Получение случайного количества цифр от MIN_AMOUNT_NUM до MAX_AMOUNT_NUM
function getRandomAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Получение случайного числа по количеству знаков (возврат - строка)
function getRandomNumStr() {
    let amountNum = getRandomAmount(MIN_AMOUNT_NUM, MAX_AMOUNT_NUM);
    let numberStr = '';
    // ( + !number.length) - чтобы первый символ строки не был 0
    while (amountNum > 0) {
        let digit = (Math.floor(Math.random() * 10) + !numberStr.length);
        if (numberStr.indexOf(digit) === -1) {
            numberStr += digit;
            // Первый digit может получиться равным 10 (2 знака)
            amountNum -= digit.toString().length;
        }
    }
    return numberStr;
}

function validateUserInput(userInput) {
    if (parseInt(userInput) > 0) {
        if (userInput.length === COMPUTER_NUMBER_STR.length) {
            for (let i = 0; i < userInput.length; i++) {
                if ((userInput.split(userInput[i]).length - 1) > 1){
                    console.log('digits in a number cannot be repeated');
                    return false;
                }
            }
            return true;
        } else {
            console.log(`must be ${COMPUTER_NUMBER_STR.length} characters`);
            return false;
        }
    } else {
        console.log('invalid format');
        return false;
    }
}

function compareNumbers(userInput) {
    if (COMPUTER_NUMBER_STR === userInput) {
        console.log(`you're goddamn right
                    © Walter White`);
        win = true;
    } else {
        let amountCorrectPos = 0;
        let amountIncorrectPos = 0;

        for (let i = 0; i < userInput.length; i++) {
            let symbolIndex = COMPUTER_NUMBER_STR.indexOf(userInput[i]);
            if (symbolIndex !== -1) {
                if (symbolIndex === i) {
                    amountCorrectPos++;
                } else {
                    amountIncorrectPos++;
                }
            }
        }
        console.log(`digits in incorrect positions: ${amountIncorrectPos}`);
        console.log(`digits in correct positions: ${amountCorrectPos}`);
    }
}
