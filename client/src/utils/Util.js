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
 * @param {number} numerator 
 * @param {number} denominator 
 * @returns {string} String denoting the percentage of the provided fraction. 
 */
export function floatToPercentStr(number, decimals = 1) {
  // All this work just to trim trailing zeros :(
  const result = parseFloat(Math.round((number) * (Math.pow(10, decimals + 2))) / Math.pow(10, decimals));
  return isNaN(result) ? '--%' :`${result}%`;
}

/**
 * @param {number} numerator 
 * @param {number} denominator 
 * @returns {string} String denoting the decimal value of the provided fraction. 
 */
export function floatToDecimalStr(number, decimals = 1) {
  const result = parseFloat(Math.round((number) * (Math.pow(10, decimals))) / Math.pow(10, decimals));
  return isNaN(result) ? '--' : result;
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