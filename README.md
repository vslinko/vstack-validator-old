# vstack validator

> Validator for recursive JS structures

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/vslinko-vstack/vstack-validator?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Circle CI](https://circleci.com/gh/vslinko-vstack/vstack-validator/tree/master.svg?style=svg)](https://circleci.com/gh/vslinko-vstack/vstack-validator/tree/master)

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
