'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);
const {
  getRandomInt,
  shuffle,
  getRandomDate,
} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;
const MAX_COMMENTS = 10;

const DataFileUrl = {
  TITLES: `./src/data/titles.txt`,
  SENTENCES: `./src/data/sentences.txt`,
  CATEGORIES: `./src/data/categories.txt`,
  COMMENTS: `./src/data/comments.txt`,
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
    logger.error(`Ошибка чтения файла ${filePath}\n${error}`);
    process.exit(ExitCode.ERROR);
  }

  return data;
};

const generateComments = (comments, count) => Array(count).fill({}).map(() => ({
  id: nanoid(MAX_ID_LENGTH),
  text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
}));

const generatePosts = async (count) => {
  if (count > MAX_COUNT) {
    logger.error(`Не больше ${MAX_COUNT} публикаций`);
    process.exit(ExitCode.ERROR);
  }

  const [categories, sentences, titles, comments] = await Promise.all([
    getStringArrayFromFile(DataFileUrl.CATEGORIES),
    getStringArrayFromFile(DataFileUrl.SENTENCES),
    getStringArrayFromFile(DataFileUrl.TITLES),
    getStringArrayFromFile(DataFileUrl.COMMENTS),
  ]);

  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: getRandomArrayItem(titles),
    announce: getRandomItemsFromArray(sentences, getRandomInt(1, 5)).join(` `),
    fullText: getRandomItemsFromArray(sentences, getRandomInt(1, sentences.length - 1)).join(` `),
    createdDate: getRandomDate(3, `month`),
    category: getRandomItemsFromArray(categories, getRandomInt(1, categories.length - 1)),
    comments: generateComments(comments, getRandomInt(1, MAX_COMMENTS))
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
      logger.info(`Файл с mock данными создан`);
    } catch (error) {
      logger.error(`Не удалось записать данные в файл moсks.json\nОшибка: ${error}`);
      process.exit(ExitCode.ERROR);
    }
  },
};
