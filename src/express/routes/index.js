'use strict';

const express = require(`express`);
const mainRouter = require(`./main-routes`);
const myRouter = require(`./my-routes.js`);
const articlesRouter = require(`./articles-routes`);
const categoriesRouter = require(`./categories-routes`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

module.exports = app;
