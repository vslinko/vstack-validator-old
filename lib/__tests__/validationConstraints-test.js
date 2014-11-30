/**
 * vstack by @vslinko
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var validationConstraints = require('../validationConstraints');

describe('notNull', function() {
  it('should validate', function() {
    var validator = validationConstraints.notNull();

    expect(validator(null)).toBeFalsy();
    expect(validator(undefined)).toBeFalsy();

    expect(validator('')).toBeTruthy();
    expect(validator([])).toBeTruthy();
  });
});

describe('notEmpty', function() {
  it('should validate', function() {
    var validator = validationConstraints.notEmpty();

    expect(validator(null)).toBeFalsy();
    expect(validator(undefined)).toBeFalsy();
    expect(validator('')).toBeFalsy();
    expect(validator([])).toBeFalsy();

    expect(validator('a')).toBeTruthy();
    expect(validator(['a'])).toBeTruthy();
  });
});

describe('moment', function() {
  it('should validate', function() {
    var isValid = jest.genMockFunction();

    var validator = validationConstraints.moment();

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();

    expect(validator('')).toBeFalsy();
    expect(validator({})).toBeFalsy();
    expect(validator([])).toBeFalsy();
    expect(validator({isValid: isValid})).toBeFalsy();

    isValid.mockReturnValueOnce(true);
    expect(validator({_isAMomentObject: 1, isValid: isValid})).toBeTruthy();
    isValid.mockReturnValueOnce(false);
    expect(validator({_isAMomentObject: 1, isValid: isValid})).toBeFalsy();
  });
});

describe('email', function() {
  it('should validate', function() {
    var validator = validationConstraints.email();

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();
    expect(validator('')).toBeTruthy();

    expect(validator('test')).toBeFalsy();

    expect(validator('test@example.com')).toBeTruthy();
  });
});

describe('isTrue', function() {
  it('should validate', function() {
    var validator = validationConstraints.isTrue();

    expect(validator(null)).toBeFalsy();
    expect(validator(undefined)).toBeFalsy();
    expect(validator(false)).toBeFalsy();
    expect(validator('')).toBeFalsy();

    expect(validator(true)).toBeTruthy();
  });
});

describe('isFalse', function() {
  it('should validate', function() {
    var validator = validationConstraints.isFalse();

    expect(validator(null)).toBeFalsy();
    expect(validator(undefined)).toBeFalsy();
    expect(validator(true)).toBeFalsy();
    expect(validator('')).toBeFalsy();

    expect(validator(false)).toBeTruthy();
  });
});

describe('minLength', function() {
  it('should validate', function() {
    var validator = validationConstraints.minLength(2);

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();

    expect(validator('')).toBeFalsy();
    expect(validator([])).toBeFalsy();
    expect(validator('a')).toBeFalsy();
    expect(validator([1])).toBeFalsy();

    expect(validator('ab')).toBeTruthy();
    expect(validator([1, 2])).toBeTruthy();
  });
});

describe('maxLength', function() {
  it('should validate', function() {
    var validator = validationConstraints.maxLength(2);

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();

    expect(validator('abc')).toBeFalsy();
    expect(validator([1, 2, 3])).toBeFalsy();

    expect(validator('ab')).toBeTruthy();
    expect(validator([1, 2])).toBeTruthy();
  });
});

describe('regexp', function() {
  it('should validate', function() {
    var validator = validationConstraints.regexp(/a/);

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();
    expect(validator('')).toBeTruthy();

    expect(validator('qwerty')).toBeFalsy();

    expect(validator('asd')).toBeTruthy();
  });
});

describe('uppercase', function() {
  it('should validate', function() {
    var validator = validationConstraints.uppercase();

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();
    expect(validator('')).toBeTruthy();

    expect(validator('qwerty')).toBeFalsy();

    expect(validator('QWERTY')).toBeTruthy();
  });
});

describe('lowercase', function() {
  it('should validate', function() {
    var validator = validationConstraints.lowercase();

    expect(validator(null)).toBeTruthy();
    expect(validator(undefined)).toBeTruthy();
    expect(validator('')).toBeTruthy();

    expect(validator('QWERTY')).toBeFalsy();

    expect(validator('qwerty')).toBeTruthy();
  });
});
