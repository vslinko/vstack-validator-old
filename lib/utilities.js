/**
 * vstack by @vslinko
 */

function isNull(value) {
  return value === null || value === undefined;
}

function isEmpty(value) {
  return isNull(value) || value.length === 0;
}

function wrapChecker(checker) {
  return function validator(value, spec) {
    return {
      valid: checker(value, spec)
    };
  };
}

function deepFind(object, path) {
  var lookup = object;
  var keys = path.split('.');

  for (var i = 0; i < keys.length; ++i) {
    if (lookup[keys[i]] === undefined) {
      return undefined;
    } else {
      lookup = lookup[keys[i]];
    }
  }

  return lookup;
}

var formatMessage = (function() {
  var start = '{{';
  var end = '}}';
  var path = '[a-z0-9_][\\.a-z0-9_]*';
  var pattern = new RegExp(start + '\\s*(' + path + ')\\s*' + end, 'gi');

  return function formatMessage(template, data) {
    return template.replace(pattern, function(tag, token) {
      return deepFind(data, token);
    });
  };
}());

module.exports = {
  isNull: isNull,
  isEmpty: isEmpty,
  wrapChecker: wrapChecker,
  deepFind: deepFind,
  formatMessage: formatMessage
};
