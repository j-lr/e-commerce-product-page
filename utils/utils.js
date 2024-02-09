/**
 * @param {*} s string from which numeric values are to be extracted
 * Special cases : -ve values would be converted to positive values as negative symbol would be stripped off
 *
 * @returns
 * @throws Error if falsy values are passed as param s
 */
function extractNumericPartsFromString(s) {
  if (!s && s != 0) throw new Error("invalid argument passed " + s);
  const inputString = typeof s === "string" ? s : String(s);

  // Use regular expression to extract numeric part
  const numericPart = inputString.replace(/\D/g, "");
  // Convert the extracted string to a number
  return parseInt(numericPart, 10);
}

/**
 * returns true if element is currently visible on screen, false otherwise.
 *  Note : if elem is not HTMLElement then returns false
 */
function isElementVisible(elem) {
  if (elem instanceof HTMLElement) {
    const rect = elem.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
  return false;
}
export { extractNumericPartsFromString, isElementVisible };
