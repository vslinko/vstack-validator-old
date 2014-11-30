# vstack validator

> Validator for recursive JS structures

[![circleci build](http://img.shields.io/badge/build-passed-green.svg)](https://circleci.com/gh/vslinko-vstack/vstack-validator/tree/master)
[![codacy code quality](https://img.shields.io/codacy/3a0e8e4d759547dea776e5952dc7abb3.svg)](https://www.codacy.com/public/vslinko/vstack-validator/dashboard)
![code climate](https://img.shields.io/codeclimate/github/vslinko-vstack/vstack-validator.svg)
[![github issues](https://img.shields.io/github/issues/vslinko-vstack/vstack-validator.svg)](https://github.com/vslinko-vstack/vstack-validator/issues)

[![npm license](https://img.shields.io/npm/l/vstack-validator.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)
[![david dependencies](https://img.shields.io/david/vslinko-vstack/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)
[![david dev dependencies](https://img.shields.io/david/dev/vslinko-vstack/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)
[![npm downloads](https://img.shields.io/npm/dm/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)

[![gitter chat](http://img.shields.io/badge/gitter%20chat-vslinko--vstack-green.svg)](https://gitter.im/vslinko-vstack?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![gratipay](https://img.shields.io/gratipay/vslinko.svg)](https://gratipay.com/vslinko/)

## Usage

```js
var validator = require('vstack-validator');

var result = validator.validate({
  childs: [
    {test: null}
  ]
}, {
  childs: {
    minLength: validator.constraints.minLength(2),
    $iterate: {
      test: {
        notNull: validator.constraints.notNull()
      }
    }
  }
});

console.log(result);
/*
{
  invalid: true,
  valid: false,
  childs: {
    invalid: true,
    valid: false,
    length: 1,
    minLength: {
      invalid: true,
      valid: false
    },
    0: {
      invalid: true,
      valid: false,
      test: {
        invalid: true,
        valid: false,
        notNull: {
          invalid: true,
          valid: false
        }
      }
    }
  }
}
*/
```

## Constraint example

```js
// Constraint is validator factory configurable via arguments.
var minLength = function(min) {
  // First argument is value.
  // Second argument is original object when validate() and validateObject() are used.
  return function(value) {
    // Validator should return true if value is null or empty.
    return validator.utilities.isNull(value) || value.length >= min;
  };
};
```

## Built-in constraints

```js
validator.constraints.notNull(); // Check value isn't null or undefined
validator.constraints.notEmpty(); // Check value has length
validator.constraints.moment(); // Check value is valid momentjs date
validator.constraints.email();
validator.constraints.isTrue();
validator.constraints.isFalse();
validator.constraints.minLength(min);
validator.constraints.maxLength(max);
validator.constraints.regex(re);
validator.constraints.uppercase();
validator.constraints.lowercase();
```
