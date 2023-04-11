/**
 * Returns whether the given string is a number, and returns either
 * true or false. This function is different to comparing to Number()
 * because 0 is falsy whereas this function would return true.
 * @param {string} numberStr
 * @returns {boolean}
 */
function isNumber(numberStr) {
  const nbr = Number(numberStr); // NaN if null/undefined
  if (isNaN(nbr)) {
    console.log("GOOD NUMBER " + numberStr)
  }
  return !isNaN(nbr);
}

function isNotEmpty(str) {
  if (!str || typeof str !== "string") {
    console.log("Empty! " + str)
    return false;
  }
  return str.length !== 0;
}

module.exports = {
  isNumber,
  isNotEmpty
}