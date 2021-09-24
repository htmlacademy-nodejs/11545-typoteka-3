'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const FILENAME = `mocks.json`;
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return data;
  }

  try {
    data = JSON.parse(await fs.readFile(FILENAME, `utf-8`));
  } catch (error) {
    console.error(chalk.red(`Ошибка чтения файла ${FILENAME}. Убедитесь, что создали мокирующие данные`));
  }

  return [...data];
};

module.exports = {
  getMockData,
};
