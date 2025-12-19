export const formatInIndianStyle = (num: number | string) => {
  const numStr = String(num);
  if (!numStr || isNaN(parseFloat(numStr))) {
    return '';
  }
  const [integerPart, decimalPart] = numStr.split('.');
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  
  let result = formattedOtherNumbers ? `${formattedOtherNumbers},${lastThree}` : lastThree;

  if (decimalPart) {
    result += `.${decimalPart}`;
  }
  
  return result;
};

export const parseFormattedNumber = (str: string) => {
  return str.replace(/,/g, '');
};
