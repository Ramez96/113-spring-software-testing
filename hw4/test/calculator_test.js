const assert = require('assert');
const { test } = require('node:test');
const Calculator = require('../src/calculator');

function shouldThrow(input, msg) {
   test(`throws: ${msg}`, () => {
       assert.throws(() => Calculator.main(...input), new RegExp(msg));
   });
}

function shouldPass(input, label) {
   test(`ok: ${label}`, () => {
       assert.doesNotThrow(() => Calculator.main(...input));
   });
}

function checkDays(input, expected, label) {
   test(`days ${label}`, () => {
       assert.strictEqual(Calculator.main(...input), expected);
   });
}

[
   [[0, 10, 3, 10, 2020], 'invalid month1'],
   [[13, 10, 3, 10, 2020], 'invalid month1'],
   [[3, 10, 0, 10, 2020], 'invalid month2'],
   [[3, 10, 13, 10, 2020], 'invalid month2'],
   [[3, 0, 4, 10, 2020], 'invalid day1'],
   [[3, 32, 4, 10, 2020], 'invalid day1'],
   [[3, 10, 4, 0, 2020], 'invalid day2'],
   [[3, 10, 4, 32, 2020], 'invalid day2'],
   [[3, 10, 4, 10, 0], 'invalid year'],
   [[3, 10, 4, 10, 10001], 'invalid year'],
].forEach(([args, msg]) => shouldThrow(args, msg));

shouldThrow([3, 20, 3, 10, 2020], 'day1 must be less than day2');
shouldThrow([4, 10, 3, 20, 2020], 'month1 must be less than month2');

shouldPass([3, 10, 3, 10, 2020], 'same m & d');
shouldPass([1, 10, 2, 10, 2020], 'diff m, same d');

checkDays([3, 10, 3, 15, 2020], 5, '(same m)');
checkDays([1, 31, 3, 1, 2021], 29, '(non-leap)');
checkDays([2, 1, 3, 1, 2020], 29, '(leap)');
checkDays([5, 15, 8, 5, 2020], 82, '(multi-month)');

checkDays([2, 1, 3, 1, 1900], 28, '1900 not leap');
checkDays([2, 1, 3, 1, 2000], 29, '2000 leap');

shouldPass([12, 1, 12, 2, 2022], 'm1 = 12');
shouldPass([11, 1, 12, 2, 2003], 'm2 = 12');
shouldPass([1, 1, 1, 31, 2023], 'd2 = 31');
shouldPass([1, 1, 1, 2, 1], 'y = 1');
shouldPass([1, 1, 1, 2, 10000], 'y = 10000');
