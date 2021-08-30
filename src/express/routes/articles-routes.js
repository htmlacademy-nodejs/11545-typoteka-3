'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => res.render(`articles/post`));
offersRouter.get(`/:id`, (req, res) => res.render(`articles/post-detail`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`articles/post`));
offersRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

module.exports = offersRouter;
