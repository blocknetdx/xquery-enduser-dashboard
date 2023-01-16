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

const paymentNames = {
  eth: 'aBLOCK, ETH',
  avax: 'aaBLOCK, AVAX',
  nevm: 'wSYS, sysBLOCK'
}

function getPaymentName(data = '') {
  return paymentNames[data.split('_')[1]] || '';
}

function getPaymentAddresses(data = {}) {
  let addresses = [];

  Object.keys(data).forEach(item => {
    if (item.includes('_address') && data[item]?.length > 0) {
      addresses.push({
        address: data[item],
        name: getPaymentName(item),
      });
    }
  })

  return addresses;
}

export {
    filterMinAmount,
    getAcceptedCurrencyNames,
    capitalizeFirstLetter,
    calcualteApiUsage,
    getPaymentAddresses,
}