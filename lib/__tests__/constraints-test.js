/**
 * vstack by @vslinko
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var constraints = require('..').constraints;
var createConstraint = require('..').createConstraint;

function expectValid(validity) {
  expect(validity.valid).toBeTruthy();
}

function expectInvalid(validity) {
  expect(validity.invalid).toBeTruthy();
}

describe('notNull', function() {
  var validator = constraints.notNull();

  it('should validate', function() {
    expectInvalid(validator(null));
    expectInvalid(validator(undefined));

    expectValid(validator(''));
    expectValid(validator([]));
  });
});

describe('notEmpty', function() {
  var validator = constraints.notEmpty();

  it('should validate', function() {
    expectInvalid(validator(null));
    expectInvalid(validator(undefined));
    expectInvalid(validator(''));
    expectInvalid(validator([]));

    expectValid(validator('a'));
    expectValid(validator(['a']));
  });
});

describe('isTrue', function() {
  var validator = constraints.isTrue();

  it('should validate', function() {
    expectInvalid(validator(null));
    expectInvalid(validator(undefined));
    expectInvalid(validator(false));
    expectInvalid(validator(''));

    expectValid(validator(true));
  });
});

describe('isFalse', function() {
  var validator = constraints.isFalse();

  it('should validate', function() {
    expectInvalid(validator(null));
    expectInvalid(validator(undefined));
    expectInvalid(validator(true));
    expectInvalid(validator(''));

    expectValid(validator(false));
  });
});

describe('isNumber', function() {
  var validator = constraints.isNumber();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator(''));

    expectValid(validator(1));
  });
});

describe('isString', function() {
  var validator = constraints.isString();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator(1));

    expectValid(validator(''));
  });
});

describe('isBoolean', function() {
  var validator = constraints.isBoolean();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectValid(validator(true));
    expectValid(validator(false));

    expectInvalid(validator(1));
  });
});

describe('isObject', function() {
  var validator = constraints.isObject();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectValid(validator({}));

    expectInvalid(validator(1));
  });
});

describe('isArray', function() {
  var validator = constraints.isArray();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));
    expectInvalid(validator({}));

    expectValid(validator([]));
  });
});

describe('isRegexp', function() {
  var validator = constraints.isRegexp();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator({}));

    expectValid(validator(/a/));
  });
});

describe('isDate', function() {
  var validator = constraints.isDate();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator({}));

    expectValid(validator(new Date()));
  });
});

describe('isMoment', function() {
  var validator = constraints.isMoment();

  it('should validate', function() {
    var isValid = jest.genMockFunction();

    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator(''));
    expectInvalid(validator([]));

    isValid.mockReturnValueOnce(true);
    expectValid(validator({_isAMomentObject: 1, isValid: isValid}));
    isValid.mockReturnValueOnce(false);
    expectInvalid(validator({_isAMomentObject: 1, isValid: isValid}));
  });
});

describe('regexp', function() {
  var validator = constraints.regexp({
    regexp: /a/
  });

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));
    expectValid(validator(''));

    expectInvalid(validator('b'));

    expectValid(validator('a'));
  });
});

describe('email', function() {
  var validator = constraints.email();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));
    expectValid(validator(''));

    expectInvalid(validator('a'));

    expectValid(validator('test@example.com'));
  });
});

describe('uppercase', function() {
  var validator = constraints.uppercase();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));
    expectValid(validator(''));

    expectInvalid(validator('a'));

    expectValid(validator('A'));
  });
});

describe('lowercase', function() {
  var validator = constraints.lowercase();

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));
    expectValid(validator(''));

    expectInvalid(validator('A'));

    expectValid(validator('a'));
  });
});

describe('minLength', function() {
  var validator = constraints.minLength({
    minLength: 2
  });

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator(''));
    expectInvalid(validator([]));
    expectInvalid(validator('a'));
    expectInvalid(validator(['a']));

    expectValid(validator('ab'));
    expectValid(validator(['a', 'b']));
  });
});

describe('maxLength', function() {
  var validator = constraints.maxLength({
    maxLength: 1
  });

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectValid(validator(''));
    expectValid(validator([]));
    expectValid(validator('a'));
    expectValid(validator(['a']));

    expectInvalid(validator('ab'));
    expectInvalid(validator(['a', 'b']));
  });
});

describe('all', function() {
  var validator = constraints.all({
    validators: [
      constraints.notEmpty(),
      constraints.email()
    ]
  });

  it('should validate', function() {
    expectInvalid(validator(null));
    expectInvalid(validator(undefined));
    expectInvalid(validator(''));

    expectInvalid(validator('a'));

    expectValid(validator('test@example.com'));
  });

  it('should proxy root', function() {
    var checker = jest.genMockFunction().mockReturnValue(true);

    var validator = constraints.all({
      validators: {
        test: createConstraint({
          name: 'test',
          validator: checker
        })()
      }
    });

    var data = {};
    validator(data);

    expect(checker.mock.calls[0][2]).toBe(data);
  });
});

describe('object', function() {
  var validator = constraints.object({
    mapping: {
      name: constraints.notEmpty()
    }
  });

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));

    expectInvalid(validator(''));
    expectInvalid(validator([]));

    expectInvalid(validator({
      name: ''
    }));

    expectValid(validator({
      name: 'a'
    }));
  });

  it('should proxy root', function() {
    var checker = jest.genMockFunction().mockReturnValue(true);

    var validator = constraints.object({
      mapping: {
        test: createConstraint({
          name: 'test',
          validator: checker
        })()
      }
    });

    var data = {test: 1};
    validator(data);

    expect(checker.mock.calls[0][2]).toBe(data);
  });

  it('should override proxied root', function() {
    var checker = jest.genMockFunction().mockReturnValue(true);

    var validator = constraints.array({
      itemValidator: constraints.object({
        overrideRoot: true,
        mapping: {
          test: createConstraint({
            name: 'test',
            validator: checker
          })()
        }
      })
    });

    var data = [{test: 1}, {test: 2}];
    validator(data);

    expect(checker.mock.calls[0][2]).toBe(data[0]);
    expect(checker.mock.calls[1][2]).toBe(data[1]);
  });
});

describe('array', function() {
  var validator = constraints.array({
    itemValidator: constraints.notEmpty()
  });

  it('should validate', function() {
    expectValid(validator(null));
    expectValid(validator(undefined));
    expectValid(validator([]));

    expectInvalid(validator(['']));
    expectInvalid(validator(['a', '']));

    expectValid(validator(['a', 'b']));
  });

  it('should proxy root', function() {
    var checker = jest.genMockFunction().mockReturnValue(true);

    var validator = constraints.array({
      itemValidator: createConstraint({
        name: 'test',
        validator: checker
      })()
    });

    var data = [{test: 1}];
    validator(data);

    expect(checker.mock.calls[0][2]).toBe(data);
  });
});

describe('complex validator', function() {
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
    itemValidator: authorValidator
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

  var invalidPosts = [
    {
      name: '',
      authors: []
    },
    {
      name: 'a',
      authors: []
    },
    {
      name: 'a',
      authors: [{}]
    },
    {
      name: 'a',
      authors: [{
        name: ''
      }]
    },
    {
      name: 'a',
      authors: [{
        name: 'a'
      }]
    },
    {
      name: 'a',
      authors: [
        {
          name: 'abc'
        },
        {
          name: 'a'
        }
      ]
    }
  ];

  var validPosts = [
    {
      name: 'a',
      authors: [{
        name: 'abc'
      }]
    }
  ];

  it('should validate', function() {
    expectValid(postValidator(null));
    expectValid(postValidator(undefined));
    expectInvalid(postValidator([]));

    invalidPosts.forEach(function(invalidPost) {
      expectInvalid(postValidator(invalidPost));
    });

    validPosts.forEach(function(validPost) {
      expectValid(postValidator(validPost));
    });
  });

  it('should return full validity tree', function() {
    expect(postValidator(validPosts[0])).toEqual({
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
          length: 1,
          valid: true,
          constraint: 'array',
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
    });

    expect(postValidator(invalidPosts[invalidPosts.length - 1])).toEqual({
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
            message: 'Name is too short'
          },
          length: 2,
          valid: false,
          constraint: 'array',
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
      message: 'Name is too short'
    });
  });
});
