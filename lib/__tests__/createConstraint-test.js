/**
 * vstack by @vslinko
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var createConstraint = require('..').createConstraint;
var constraints = require('..').constraints;

describe('createConstraint', function() {
  it('should throw if spec haven\'t validator', function() {
    expect(function() {
      createConstraint();
    }).toThrow('Constraint should have validator');
  });

  it('should throw if spec haven\'t name', function() {
    expect(function() {
      createConstraint({
        validator: jest.genMockFn()
      });
    }).toThrow('Constraint should have name');
  });

  it('should merge spec', function() {
    var validatorFn = jest.genMockFn().mockReturnValue({valid: true});

    var constraint = createConstraint({
      name: 'name',
      validator: validatorFn,
      a: 'a',
      b: 'b'
    });

    var validator = constraint({
      b: 'z',
      c: 'c'
    });

    validator(123);

    expect(validatorFn.mock.calls[0][1]).toEqual({
      name: 'name',
      validator: validatorFn,
      a: 'a',
      b: 'z',
      c: 'c'
    });
  });

  it('should extend validity', function() {
    var validatorFn = jest.genMockFn().mockReturnValue({valid: false, a: 'a'});

    var constraint = createConstraint({
      name: 'name',
      validator: validatorFn
    });

    var validator = constraint();

    var validity = validator(123);

    expect(validity).toEqual({
      constraint: 'name',
      valid: false,
      invalid: true,
      message: 'Value `123` is invalid',
      a: 'a'
    });
  });
});
