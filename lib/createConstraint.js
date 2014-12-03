/**
 * vstack by @vslinko
 */

var assign = require('object-assign');
var formatMessage = require('./utilities').formatMessage;

function createConstraint(defaultSpec) {
  if (!defaultSpec || !defaultSpec.validator) {
    throw new Error('Constraint should have validator');
  }
  if (!defaultSpec.name) {
    throw new Error('Constraint should have name');
  }

  return function constraint(specChanges) {
    specChanges = specChanges || {};

    var specValidators = defaultSpec.spec || {};
    if (typeof specValidators === 'function') {
      specValidators = specValidators();
    }

    Object.keys(specValidators || {}).forEach(function(key) {
      var validity = specValidators[key](specChanges[key]);
      if (validity.invalid) {
        throw new Error('Constraint "' + defaultSpec.name +
          '" spec property "' + key + '" is invalid: ' + validity.message);
      }
    });

    var spec = {};
    assign(spec, defaultSpec);
    assign(spec, specChanges);

    return function validator(value, root) {
      var validity = defaultSpec.validator(value, spec, root || value);

      if (typeof validity === 'boolean') {
        validity = {valid: validity};
      }

      validity.constraint = defaultSpec.name;
      validity.invalid = !validity.valid;

      if (validity.valid) {
        validity.message = null;
        return validity;
      }

      var message = validity.message ||
        spec.message ||
        'Value `{{value}}` is invalid';

      var variables = {};
      assign(variables, spec);
      assign(variables, {
        rawValue: value,
        value: JSON.stringify(value)
      });

      validity.invalid = true;
      validity.message = formatMessage(message, variables);

      return validity;
    };
  };
}

module.exports = createConstraint;
