'use strict';

const log = labeledLogger('exercise 5');

// use setTimeout and .charCodeAt() to sort an array of strings
//  read items from the unsorted array to the sorted array
//  you can control the order of the sorted array by using different delays in a setTimeout
const sortArray = (unsorted, sorted) => {
};


// can you figure out why the tests pass in the order they do?
// is it possible for a test never to finish?
const testSortAsync = (actual, expected, testId) => {
  if (actual.length === expected.length) {
    log(testId, 'actual:', actual, "expected:", expected);
    const test1 = actual.toString() === expected.toString();
    console.assert(test1, testId);
  } else {
    // sorting is not finished, check again later
    setTimeout(testSortAsync, 50, actual, expected, testId);
  }
};

const toSort1 = ['ÿ', '!', 'ÿ', '!', 'ÿ'];
const actual1 = [];
const expected1 = ['!', '!', 'ÿ', 'ÿ', 'ÿ'];
sortArray(toSort1, actual1);
testSortAsync(actual1, expected1, 'Test 1');

const toSort2 = ['!', '', '!', '', '!'];
const actual2 = [];
const expected2 = ['', '', '!', '!', '!'];
sortArray(toSort2, actual2);
testSortAsync(actual2, expected2, 'Test 2');

const toSort3 = [];
const actual3 = [];
const expected3 = [];
sortArray(toSort3, actual3);
testSortAsync(actual3, expected3, 'Test 3');

const toSort4 = ['a', 'A', 'Z', 'z'];
const actual4 = [];
const expected4 = ['A', 'Z', 'a', 'z'];
sortArray(toSort4, actual4);
testSortAsync(actual4, expected4, 'Test 4');

const toSort5 = [';', '}', '+', '{'];
const actual5 = [];
const expected5 = ['+', ';', '{', '}'];
sortArray(toSort5, actual5);
testSortAsync(actual5, expected5, 'Test 5');

