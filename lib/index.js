/**
 * vstack by @vslinko
 */

var validationConstraints = require('./validationConstraints');
var validator = require('./validator');
var utilities = require('./utilities');

module.exports = {
  constraints: validationConstraints,
  validate: validator.validate,
  validateObject: validator.validateObject,
  validateValue: validator.validateValue,
  utilities: utilities
};
