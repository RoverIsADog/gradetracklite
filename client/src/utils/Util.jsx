// @ts-check
/**
 * Util file for functions and constants only. React components should be
 * placed in ./UtilComponents.jsx to allow for fast reload.
 */
import React from "react";

/**
 * @param {number} number
 * @param {number?} decimals
 * @returns {string} String denoting the percentage of the provided fraction. 
 */
export function floatToPercentStr(number, decimals = 1) {
  // All this work just to trim trailing zeros :(
  const result = parseFloat(`${Math.round((number) * (Math.pow(10, decimals + 2))) / Math.pow(10, decimals)}`);
  return isNaN(result) || result > 999999 ? '--%' :`${result}%`;
}

/**
 * @param {number} number 
 * @returns {string} String denoting the decimal value of the provided fraction. 
 */
export function floatToDecimalStr(number, decimals = 1) {
  const result = parseFloat(`${Math.round((number) * (Math.pow(10, decimals))) / Math.pow(10, decimals)}`);
  return isNaN(result) ? '--' : `${result}`;
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

/**
 * 
 * @typedef {{ 
 *   ok: boolean
 *   longEnough: boolean
 *   hasLower: boolean
 *   hasUpper: boolean
 *   hasNumber: boolean
 *   hasSpecial: boolean
 *   noInvalid: boolean
 * }} returnVal
 * 
 * Checks whether the password is sophisticated enough and returns a boolean
 * of whether it is, and an error message if it is not.
 * 
 * ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?!.* ).{8,}$
 * 
 * ^ ... $: Match the entire string
 * (?=.*[A-Z]): Match at least one uppercase
 * (?=.*[a-z]): Match at least one lowercase
 * (?=.*[0-9]): Match at least one number
 * (?=.*[!@#\$%\^&\*]): Match at least one special (escaped in regex string)
 * (?!.* ): Doesn't match any spaces
 * .{8,}: Match at least 8 characters
 * 
 * @param {string} pwd 
 * @returns {returnVal}
 */
export function passwordComplexity(pwd) {

  const oneLower = new RegExp('^(?=.*[a-z]).{1,}$');
  const oneUpper = new RegExp('^(?=.*[A-Z]).{1,}$');
  const oneNumber = new RegExp('^(?=.*[0-9]).{1,}$');
  const oneSpecial = new RegExp('^(?=.*[!@#\\$%\\^&\\*]).{1,}$');
  const noInvalid = new RegExp('^(?!.* ).{1,}$');

  /** @type {returnVal} */
  let ret = {
    ok: false,
    longEnough: (pwd.length >= 8),
    hasLower: (oneLower.test(pwd)),
    hasUpper: (oneUpper.test(pwd)),
    hasNumber: (oneNumber.test(pwd)),
    hasSpecial: (oneSpecial.test(pwd)),
    noInvalid: (noInvalid.test(pwd)),
  };
  
  ret.ok = ret.longEnough && ret.hasLower && ret.hasUpper && ret.hasNumber && ret.hasSpecial && ret.noInvalid;
  
  return ret;
  
}