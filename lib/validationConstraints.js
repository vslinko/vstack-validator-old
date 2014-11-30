/**
 * vstack by @vslinko
 */

var utilities = require('./utilities');

function notNull() {
  return function(value) {
    return !utilities.isNull(value);
  };
}

function notEmpty() {
  return function(value) {
    return !utilities.isEmpty(value);
  };
}

function moment() {
  return function(value) {
    return utilities.isNull(value) ||
      (value._isAMomentObject && value.isValid ? value.isValid() : false);
  };
}

function email() {
  return function(value) {
    return utilities.isEmpty(value) || /^.+@.+\..{2,}$/.test(value);
  };
}

function isTrue() {
  return function(value) {
    return value === true;
  };
}

function isFalse() {
  return function(value) {
    return value === false;
  };
}

function minLength(min) {
  return function(value) {
    return utilities.isNull(value) || value.length >= min;
  };
}

function maxLength(max) {
  return function(value) {
    return utilities.isNull(value) || value.length <= max;
  };
}

function regexp(re) {
  return function(value) {
    return utilities.isEmpty(value) || re.test(value);
  };
}

function uppercase() {
  return function(value) {
    return utilities.isEmpty(value) || value.toUpperCase() === value;
  };
}

function lowercase() {
  return function(value) {
    return utilities.isEmpty(value) || value.toLowerCase() === value;
  };
}

module.exports = {
  notNull: notNull,
  notEmpty: notEmpty,
  moment: moment,
  email: email,
  isTrue: isTrue,
  isFalse: isFalse,
  minLength: minLength,
  maxLength: maxLength,
  regexp: regexp,
  uppercase: uppercase,
  lowercase: lowercase
};
