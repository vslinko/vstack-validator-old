/**
 * vstack by @vslinko
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.dontMock('../validator');

var validator = require('../validator');

describe('validateValue', function() {
  it('should call constraint with additional arguments', function() {
    var constraint = jest.genMockFunction();

    validator.validateValue('test', {
      notNull: constraint
    }, 'nothing');

    expect(constraint).toBeCalledWith('test', 'nothing');
  });

  it('should return positive validity', function() {
    var constraint = jest.genMockFunction();
    constraint.mockReturnValueOnce(true);

    var result = validator.validateValue('test', {
      notNull: constraint
    });

    expect(result).toEqual({
      invalid: false,
      valid: true,
      notNull: {
        invalid: false,
        valid: true
      }
    });
  });

  it('should return negative validity', function() {
    var constraint = jest.genMockFunction();
    constraint.mockReturnValueOnce(false);

    var result = validator.validateValue('test', {
      notNull: constraint
    });

    expect(result).toEqual({
      invalid: true,
      valid: false,
      notNull: {
        invalid: true,
        valid: false
      }
    });
  });
});

describe('validateObject', function() {
  it('should call constraint with additional arguments', function() {
    var constraint = jest.genMockFunction();
    constraint.mockReturnValueOnce(true);

    var object = {
      prop: false
    };

    validator.validateObject(object, {
      prop: {
        notNull: constraint
      }
    }, 'nothing');

    expect(constraint).toBeCalledWith(false, object, 'nothing');
  });

  it('should return validity with object properties', function() {
    var constraint = jest.genMockFunction();
    constraint.mockReturnValueOnce(true);

    var object = {
      prop: false
    };

    var result = validator.validateObject(object, {
      prop: {
        notNull: constraint
      }
    });

    expect(result).toEqual({
      invalid: false,
      valid: true,
      prop: {
        invalid: false,
        valid: true,
        notNull: {
          invalid: false,
          valid: true
        }
      }
    });
  });
});

describe('validate', function() {
  it('should call constraint with original object', function() {
    var constraint = jest.genMockFunction();
    constraint.mockReturnValue(false);

    var object = {
      childs: [
        {test: null}
      ]
    };

    var schema = {
      childs: {
        $iterate: {
          test: {
            notNull: constraint
          }
        }
      }
    };

    validator.validate(object, schema);

    expect(constraint).toBeCalledWith(null, object);
  });

  it('should validate object with array', function() {
    var constraint = jest.genMockFunction();
    constraint.mockReturnValue(false);

    var object = {
      childs: [
        {test: null}
      ]
    };

    var schema = {
      childs: {
        minLength: constraint,
        $iterate: {
          test: {
            notNull: constraint
          }
        }
      }
    };

    expect(validator.validate(object, schema)).toEqual({
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
    });

    constraint.mockReturnValue(true);

    expect(validator.validate(object, schema)).toEqual({
      invalid: false,
      valid: true,
      childs: {
        invalid: false,
        valid: true,
        length: 1,
        minLength: {
          invalid: false,
          valid: true
        },
        0: {
          invalid: false,
          valid: true,
          test: {
            invalid: false,
            valid: true,
            notNull: {
              invalid: false,
              valid: true
            }
          }
        }
      }
    });
  });
});
