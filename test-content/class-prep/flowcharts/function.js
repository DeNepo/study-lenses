const numberOrNaN = (num = 0) => {
  if (typeof num !== 'number') {
    return NaN;
  }

  return num;
};

const forty = numberOrNaN('forty');
