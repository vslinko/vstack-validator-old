/**
 * vstack by @vslinko
 */

function isNull(value) {
  return value === null || value === undefined;
}

function isEmpty(value) {
  return isNull(value) || value.length === 0;
}

module.exports = {
  isNull: isNull,
  isEmpty: isEmpty
};
