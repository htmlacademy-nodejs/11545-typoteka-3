'use strict';

const {Router} = require(`express`);
const mainRouter = require(`./main-routes`);
const myRouter = require(`./my-routes.js`);
const articlesRouter = require(`./articles-routes`);
const categoriesRouter = require(`./categories-routes`);

const appRouter = new Router();

appRouter.use(`/`, mainRouter);
appRouter.use(`/my`, myRouter);
appRouter.use(`/articles`, articlesRouter);
appRouter.use(`/categories`, categoriesRouter);

module.exports = appRouter;
