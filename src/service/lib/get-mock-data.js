'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});
const FILENAME = `mocks.json`;
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return data;
  }

  try {
    data = JSON.parse(await fs.readFile(FILENAME, `utf-8`));
  } catch (error) {
    logger.error(`Ошибка чтения файла ${FILENAME}. Убедитесь, что создали мокирующие данные`);
  }

  return [...data];
};

module.exports = {
  getMockData,
};
