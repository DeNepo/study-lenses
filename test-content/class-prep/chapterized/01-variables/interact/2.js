'use strict';

// fill in the blank to pass the assertion

const inputValue = _('asdf');

console.log('inputValue:', typeof inputValue, inputValue);

const inputAssertion = typeof inputValue === 'object'
  || typeof inputValue === 'string';

console.assert(inputAssertion, 'inputValue should be a string or an object');
