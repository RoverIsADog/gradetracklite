export function ColoredPercent({ number, decimals = 1 }) {
  let col;
  if (number < 0.55) col = 'color-bad';
  else if (number < 0.75) col = 'color-mid';
  else col = 'color-good';
  return (
    <span className={col}>{floatToPercentStr(number)}</span>
  );
}

/**
 * @param {number | string} number  
 * @returns {string} String denoting the percentage of the provided fraction. 
 */
export function floatToPercentStr(number, decimals = 1) {
  // All this work just to trim trailing zeros :(
  const result = parseFloat(Math.round((number) * (Math.pow(10, decimals + 2))) / Math.pow(10, decimals));
  return isNaN(result) || result > 999999 ? '--%' :`${result}%`;
}

/**
 * @param {number | string} number 
 * @returns {string} String denoting the decimal value of the provided fraction. 
 */
export function floatToDecimalStr(number, decimals = 1) {
  const result = parseFloat(Math.round((number) * (Math.pow(10, decimals))) / Math.pow(10, decimals));
  return isNaN(result) ? '--' : result;
}

/**
 * Returns whether the given string is a number, and returns either
 * true or false. This function is different to comparing to Number()
 * because 0 is falsy whereas this function would return true.
 * @param {string} numberStr
 * @returns {boolean}
 */
export function isNumber(numberStr) {
  const nbr = Number(numberStr);
  return !isNaN(nbr);
}

/**
 * Returns the value of the specified cookie.
 * @param {string} name 
 * @returns 
 */
export function readCookie(name) {
  // Credit https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function floatToGPAMcgill(percent) {
  let col = 'color-good';
  let gpa = '4.0';
  if (percent < 0.85) { col = 'color-good'; gpa = '3.7' }
  if (percent < 0.80) { col = 'color-good'; gpa = '3.3' }
  if (percent < 0.75) { col = 'color-mid'; gpa = '3.0' }
  if (percent < 0.70) { col = 'color-mid'; gpa = '2.7' }
  if (percent < 0.65) { col = 'color-mid'; gpa = '2.3' }
  if (percent < 0.60) { col = 'color-mid'; gpa = '2.0' }
  if (percent < 0.55) { col = 'color-bad'; gpa = '1.0' }
  if (percent < 0.50) { col = 'color-bad'; gpa = '0' }
  
  return (
    <>
      <span className={col}>{gpa}</span>{" GPA "}
    </>
  );
}