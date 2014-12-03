/**
 * vstack by @vslinko
 */

var createConstraint = require('./createConstraint');
var utilities = require('./utilities');

var notNull = createConstraint({
  name: 'notNull',
  message: 'Value should not be null',
  validator: function(value, spec) {
    return !utilities.isNull(value);
  }
});

var notEmpty = createConstraint({
  name: 'notEmpty',
  message: 'Value should not be empty',
  validator: function(value, spec) {
    return !utilities.isEmpty(value);
  }
});

var isTrue = createConstraint({
  name: 'isTrue',
  message: 'Value should be true',
  validator: function(value, spec) {
    return value === true;
  }
});

var isFalse = createConstraint({
  name: 'isTrue',
  message: 'Value should be false',
  validator: function(value, spec) {
    return value === false;
  }
});

var isNumber = createConstraint({
  name: 'isNumber',
  message: 'Value should be a number',
  validator: function(value, spec) {
    return utilities.isNull(value) || typeof value === 'number';
  }
});

var isString = createConstraint({
  name: 'isString',
  message: 'Value should be a string',
  validator: function(value, spec) {
    return utilities.isNull(value) || typeof value === 'string';
  }
});

var isBoolean = createConstraint({
  name: 'isBoolean',
  message: 'Value should be a boolean',
  validator: function(value, spec) {
    return utilities.isNull(value) || typeof value === 'boolean';
  }
});

var isObject = createConstraint({
  name: 'isObject',
  message: 'Value should be a object',
  validator: function(value, spec) {
    return utilities.isNull(value) || typeof value === 'object';
  }
});

var isArray = createConstraint({
  name: 'isArray',
  message: 'Value should be an array',
  validator: function(value, spec) {
    return utilities.isNull(value) || Array.isArray(value);
  }
});

var isRegexp = createConstraint({
  name: 'isRegexp',
  message: 'Value should be a regular expression',
  validator: function(value, spec) {
    return utilities.isNull(value) || value instanceof RegExp;
  }
});

var isDate = createConstraint({
  name: 'isDate',
  message: 'Value should be a date',
  validator: function(value, spec) {
    return utilities.isNull(value) || value instanceof Date;
  }
});

var isMoment = createConstraint({
  name: 'isMoment',
  message: 'Value should be a moment object',
  validator: function(value, spec) {
    return utilities.isNull(value) ||
      (value._isAMomentObject && value.isValid ? value.isValid() : false);
  }
});

var regexp = createConstraint({
  name: 'regexp',
  message: 'Value is not valid',
  regexp: /./,
  validator: function(value, spec) {
    return utilities.isEmpty(value) || spec.regexp.test(value);
  }
});

var email = createConstraint({
  name: 'email',
  message: 'Value should be a valid email',
  validator: function(value, spec) {
    return utilities.isEmpty(value) || /^.+@.+\..{2,}$/.test(value);
  }
});

var uppercase = createConstraint({
  name: 'uppercase',
  message: 'Value should be upper-cased',
  validator: function(value, spec) {
    return utilities.isEmpty(value) || value.toUpperCase() === value;
  }
});

var lowercase = createConstraint({
  name: 'lowercase',
  message: 'Value should be lower-cased',
  validator: function(value, spec) {
    return utilities.isEmpty(value) || value.toLowerCase() === value;
  }
});

var minLength = createConstraint({
  name: 'minLength',
  message: 'Value length should be greather than {{minLength}}',
  minLength: 1,
  validator: function(value, spec) {
    return utilities.isNull(value) || value.length >= spec.minLength;
  }
});

var maxLength = createConstraint({
  name: 'maxLength',
  message: 'Value length should be lower than {{maxLength}}',
  maxLength: 255,
  validator: function(value, spec) {
    return utilities.isNull(value) || value.length <= spec.maxLength;
  }
});

var all = createConstraint({
  name: 'all',
  joinMessages: true,
  validators: {},
  validator: function(value, spec, root) {
    var validators = spec.validators;
    var messages = [];

    var validity = Object.keys(validators).reduce(function(validity, key) {
      var validator = validators[key];
      validity[key] = validator(value, root);

      if (validity[key].invalid) {
        messages.push(validity[key].message);
      }

      return validity;
    }, {});

    validity.valid = messages.length === 0;

    if (spec.message) {
      validity.message = spec.message;
    } else if (messages.length > 0) {
      if (spec.joinMessages) {
        validity.message = messages.join('; ');
      } else {
        validity.message = messages[0];
      }
    }

    return validity;
  }
});

var object = createConstraint({
  name: 'object',
  joinMessages: true,
  overrideRoot: false,
  validator: function(value, spec, root) {
    if (utilities.isNull(value)) {
      return {valid: true};
    }
    if (typeof value !== 'object' || Array.isArray(value)) {
      return {valid: false};
    }

    var validatorsMapping = spec.mapping;
    var messages = [];
    root = spec.overrideRoot ? value : root;

    var validity = Object.keys(validatorsMapping).reduce(function(validity, key) {
      validity[key] = validatorsMapping[key](value[key], root);

      if (validity[key].invalid) {
        messages.push(validity[key].message);
      }

      return validity;
    }, {});

    validity.valid = messages.length === 0;

    if (spec.message) {
      validity.message = spec.message;
    } else if (messages.length > 0) {
      if (spec.joinMessages) {
        validity.message = messages.join('; ');
      } else {
        validity.message = messages[0];
      }
    }

    return validity;
  }
});

var array = createConstraint({
  name: 'array',
  itemValidator: notNull(),
  validator: function(value, spec, root) {
    if (utilities.isNull(value)) {
      return {valid: true};
    }
    if (!Array.isArray(value)) {
      return {valid: false};
    }

    var validator = spec.itemValidator;
    var messages = [];

    var validity = value.reduce(function(validity, item, index) {
      validity[index] = validator(item, root);

      if (validity[index].invalid) {
        messages.push(validity[index].message);
      }

      return validity;
    }, {});

    validity.length = value.length;
    validity.valid = messages.length === 0;

    if (spec.message) {
      validity.message = spec.message;
    } else if (messages.length > 0) {
      if (spec.joinMessages) {
        validity.message = messages.join('; ');
      } else {
        validity.message = messages[0];
      }
    }

    return validity;
  }
});

module.exports = {
  notNull: notNull,
  notEmpty: notEmpty,
  isTrue: isTrue,
  isFalse: isFalse,
  isNumber: isNumber,
  isString: isString,
  isBoolean: isBoolean,
  isObject: isObject,
  isArray: isArray,
  isRegexp: isRegexp,
  isDate: isDate,
  isMoment: isMoment,
  regexp: regexp,
  email: email,
  uppercase: uppercase,
  lowercase: lowercase,
  minLength: minLength,
  maxLength: maxLength,
  all: all,
  object: object,
  array: array
};
