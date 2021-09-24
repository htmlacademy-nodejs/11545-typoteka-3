'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {getMockData} = require(`../lib/get-mock-data`);
const createCategoriesRoute = require(`./categories`);
const createSearchRoute = require(`./search`);
const createArticleRoute = require(`./articles`);
const ArticleService = require(`../data-service/article`);
const CategoryService = require(`../data-service/category`);
const SearchService = require(`../data-service/search`);
const CommentService = require(`../data-service/comment`);

const createRouter = async () => {
  const apiRouter = new Router();
  let data = [];

  try {
    data = await getMockData();
  } catch (error) {
    console.error(chalk.red(`Ошибка получения мокирующих данных.`));
  }

  apiRouter.use(`/articles`, createArticleRoute(new ArticleService(data), new CommentService()));
  apiRouter.use(`/categories`, createCategoriesRoute(new CategoryService(data)));
  apiRouter.use(`/search`, createSearchRoute(new SearchService(data)));

  return apiRouter;
};

module.exports = createRouter;
