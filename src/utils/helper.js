import { currencyNames } from "../configs/constants";

function filterMinAmount(data = {}) {
    return Object.keys(data).filter(key => key.includes('min_amount_') && !key.includes('_usd') && !!data[key]);
}

function getAcceptedCurrencyNames(currencies = []) {
    if (currencies.length === 0) return '';

    let result = '';

    currencies.forEach(currency => {
      if (result !== '') {
        result += `, ${currencyNames[currency]}`;
      } else {
        result += currencyNames[currency];
      }
    })

    return result;
}

function capitalizeFirstLetter(str  = '') {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function calcualteApiUsage(tokensUsed = null, tokens = null) {
  if (!tokensUsed || !tokens || tokens === 0 || isNaN(parseInt(tokensUsed)) || isNaN(parseInt(tokens))) return 0;
  return (parseInt(tokensUsed) * 100 / parseInt(tokens)).toFixed()
}

export {
    filterMinAmount,
    getAcceptedCurrencyNames,
    capitalizeFirstLetter,
    calcualteApiUsage,
}