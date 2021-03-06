'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomDate = (period = 3, periodType = `month`) => {
  const dateNow = Date.now();
  let dateStart;

  switch (periodType) {
    case `day`:
      dateStart = dateNow - period * 24 * 60 * 60 * 1000;
      break;
    case `year`:
      dateStart = dateNow - period * 365 * 24 * 60 * 60 * 1000;
      break;
    case `month`:
    default:
      dateStart = dateNow - period * 30 * 24 * 60 * 60 * 1000;
      break;
  }

  return getRandomInt(dateStart, dateNow);
};

module.exports = {
  getRandomDate,
  shuffle,
  getRandomInt,
};
