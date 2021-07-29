'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInt,
  shuffle,
  getRandomDate,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const DataFileUrl = {
  TITLES: `./src/data/titles.txt`,
  SENTENCES: `./src/data/sentences.txt`,
  CATEGORIES: `./src/data/categories.txt`,
};

const getRandomArrayItem = (array) => array[getRandomInt(0, array.length - 1)];
/**
 * Возвращает указанное количество элементов массива взятых случайно
 * @param {Array} array
 * @param {number} itemsNumber
 * @return {Array}
 */
const getRandomItemsFromArray = (array, itemsNumber) => shuffle(array).slice(0, itemsNumber);

const getStringArrayFromFile = async (filePath) => {
  let data = [];

  try {
    data = (await fs.readFile(filePath, `utf-8`)).split(`\n`);
  } catch (error) {
    console.error(chalk.red(`Ошибка чтения файла ${filePath}\n${error}`));
    process.exit(ExitCode.ERROR);
  }

  return data;
};

const generatePosts = async (count) => {
  if (count > MAX_COUNT) {
    console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
    process.exit(ExitCode.ERROR);
  }

  const [categories, sentences, titles] = await Promise.all([
    getStringArrayFromFile(DataFileUrl.CATEGORIES),
    getStringArrayFromFile(DataFileUrl.SENTENCES),
    getStringArrayFromFile(DataFileUrl.TITLES),
  ]);

  return Array(count).fill({}).map(() => ({
    title: getRandomArrayItem(titles),
    announce: getRandomItemsFromArray(sentences, getRandomInt(1, 5)).join(` `),
    fullText: getRandomItemsFromArray(sentences, getRandomInt(1, sentences.length - 1)).join(` `),
    createdDate: getRandomDate(3, `month`),
    сategory: getRandomItemsFromArray(categories, getRandomInt(1, categories.length - 1)),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;

    try {
      const content = await generatePosts(countPosts);
      await fs.writeFile(FILE_NAME, JSON.stringify(content));
      console.info(chalk.green(`Файл с mock данными создан`));
    } catch (error) {
      console.error(chalk.red(`Не удалось записать данные в файл moсks.json\nОшибка: ${error}`));
      process.exit(ExitCode.ERROR);
    }
  },
};
