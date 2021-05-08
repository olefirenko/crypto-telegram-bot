/**
 * @param {number} value
 * @param {string} currency
 * @param {string} locale
 *
 * * @example formatMoney(4500) -> $4,500.00
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export const formatMoney = (value, currency = "USD", locale = "en-US") => {
  return Intl.NumberFormat(locale, { style: "currency", currencyDisplay: "symbol", currency }).format(value);
};
