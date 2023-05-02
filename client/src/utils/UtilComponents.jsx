//@ts-check
/**
 * Util file for functions and constants only. React components should be
 * placed in ./UtilComponents.jsx to allow for fast reload.
 */
import React from "react";
import { floatToPercentStr } from "./Util";

/**
 * 
 * @typedef {{
 *   number: number,
 *   decimals?: number,
 * }} param0
 * @param {param0} param0 
 * @returns 
 */
export function ColoredPercent({ number, decimals = 1 }) {
  let col;
  if (number < 0.55) col = 'color-bad';
  else if (number < 0.75) col = 'color-mid';
  else col = 'color-good';
  return (
    <span className={col}>{floatToPercentStr(number, decimals)}</span>
  );
}
