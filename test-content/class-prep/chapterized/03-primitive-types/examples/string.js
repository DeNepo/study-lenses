'use strict';

// strs are anything between quotations

const str1 = '';
console.log(typeof str1, str1);

const str2 = '0';
console.log(typeof str2, str2);

const str3 = 'false';
console.log(typeof str3, str3);

const str4 = 'undefined';
console.log(typeof str4, str4);

const str5 = 'null';
console.log(typeof str5, str5);

const str6 = 'boolean';
console.log(typeof str6, str6);

const str7 = 'number';
console.log(typeof str7, str7);


// you can concatenate strings with +
const abc = 'a' + 'b' + 'c';
console.log(typeof abc, abc);

const cba = "c" + "b" + "a";
console.log(typeof cba, cba);


// if you use ``, strings can be built using ${}
// this is called "template literals"
const allOfThem = `${str1}, ${str2}, ${str3}, ${str4}, ${str5}`;
console.log(typeof allOfThem, allOfThem);

