# vstack validator

> Validator for recursive JS structures

[![circleci build](http://img.shields.io/badge/build-passed-brightgreen.svg)](https://circleci.com/gh/vslinko-vstack/vstack-validator/tree/master)
[![codacy code quality](https://img.shields.io/codacy/3a0e8e4d759547dea776e5952dc7abb3.svg)](https://www.codacy.com/public/vslinko/vstack-validator/dashboard)
[![code climate](https://img.shields.io/codeclimate/github/vslinko-vstack/vstack-validator.svg)](https://codeclimate.com/github/vslinko-vstack/vstack-validator/code)
[![github issues](https://img.shields.io/github/issues/vslinko-vstack/vstack-validator.svg)](https://github.com/vslinko-vstack/vstack-validator/issues)

[![npm license](https://img.shields.io/npm/l/vstack-validator.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)
[![david dependencies](https://img.shields.io/david/vslinko-vstack/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)
[![david dev dependencies](https://img.shields.io/david/dev/vslinko-vstack/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)
[![npm downloads](https://img.shields.io/npm/dm/vstack-validator.svg)](https://www.npmjs.org/package/vstack-validator)

[![gitter chat](http://img.shields.io/badge/gitter%20chat-vslinko--vstack-brightgreen.svg)](https://gitter.im/vslinko-vstack?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![gratipay](https://img.shields.io/gratipay/vslinko.svg)](https://gratipay.com/vslinko/)
[![bountysource](https://img.shields.io/bountysource/team/vstack/activity.svg)](https://www.bountysource.com/teams/vstack)

## Usage

```js
var validator = require('vstack-validator');
var constraints = validator.constraints;

var authorValidator = constraints.object({
  mapping: {
    name: constraints.all({
      validators: {
        notEmpty: constraints.notEmpty({
          message: 'Name should not be empty'
        }),
        minLength: constraints.minLength({
          minLength: 3,
          message: 'Name is too short'
        })
      }
    })
  }
});

var authorsValidator = constraints.array({
  validator: authorValidator
});

var postValidator = constraints.object({
  mapping: {
    name: constraints.notEmpty(),
    authors: constraints.all({
      validators: {
        minLength: constraints.minLength({
          minLength: 1,
          message: 'Post should have authors'
        }),
        authors: authorsValidator
      }
    })
  }
});

var validity = postValidator({
  name: '',
  authors: []
});

console.log(validity);
/*
{
  name: {
    valid: true,
    constraint: 'notEmpty',
    invalid: false,
    message: null
  },
  authors: {
    minLength: {
      valid: true,
      constraint: 'minLength',
      invalid: false,
      message: null
    },
    authors: {
      0: {
        name: {
          notEmpty: {
            valid: true,
            constraint: 'notEmpty',
            invalid: false,
            message: null
          },
          minLength: {
            valid: true,
            constraint: 'minLength',
            invalid: false,
            message: null
          },
          valid: true,
          constraint: 'all',
          invalid: false,
          message: null
        },
        valid: true,
        constraint: 'object',
        invalid: false,
        message: null
      },
      1: {
        name: {
          notEmpty: {
            valid: true,
            constraint: 'notEmpty',
            invalid: false,
            message: null
          },
          minLength: {
            valid: false,
            constraint: 'minLength',
            invalid: true,
            message: 'Name is too short'
          },
          valid: false,
          constraint: 'all',
          invalid: true,
          message: 'Name is too short'
        },
        valid: false,
        constraint: 'object',
        invalid: true,
        message: 'Object is invalid'
      },
      length: 2,
      valid: false,
      constraint: 'array',
      invalid: true,
      message: 'Some items are invalid'
    },
    valid: false,
    constraint: 'all',
    invalid: true,
    message: 'Some items are invalid'
  },
  valid: false,
  constraint: 'object',
  invalid: true,
  message: 'Object is invalid'
}
*/
```

## Constraint example

```js
// Constraint is validator factory with configurable specification.
var minLength = validator.createConstraint({
  // Each constraint should have name.
  name: 'minLength',

  // Error message could contain properties from specification.
  message: 'Value length should be greather than {{minLength}}',

  // Specification are extendable.
  minLength: 1,

  // First argument is value.
  // Second argument is specification.
  // Third argument is value proxied from top called validator.
  validator: function(value, spec, root) {
    return validator.utilities.isNull(value) || value.length >= spec.minLength;
  }
});
```

## Built-in constraints

```js
validator.constraits.notNull();
validator.constraits.notEmpty();
validator.constraits.isTrue();
validator.constraits.isFalse();
validator.constraits.isNumber();
validator.constraits.isString();
validator.constraits.isBoolean();
validator.constraits.isObject();
validator.constraits.isArray();
validator.constraits.isRegexp();
validator.constraits.isDate();
validator.constraits.isMoment();
validator.constraits.regexp({
  regexp: /./
});
validator.constraits.email();
validator.constraits.uppercase();
validator.constraits.lowercase();
validator.constraits.minLength({
  minLength: 1
});
validator.constraits.maxLength({
  maxLength: 255
});
validator.constraits.all({
  validators: [],
  joinMessages: true
});
validator.constraits.object({
  mapping: {},
  joinMessages: true,
  overrideRoot: false
});
validator.constraits.array({
  itemValidator: validator.constraits.notNull()
});
```
