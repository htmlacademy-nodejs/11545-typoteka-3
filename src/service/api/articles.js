'use strict';
const {Router} = require(`express`);
const {HttpResponseCode, KeysForValidation} = require(`../../constants`);
const objectValidator = require(`../middlewares/object-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (articleService, commentService) => {
  const route = new Router();

  route.get(`/`, (req, res) => {
    return res.status(HttpResponseCode.OK).json(articleService.findAll());
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpResponseCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpResponseCode.OK).json(article);
  });

  route.post(`/`, objectValidator(KeysForValidation.ARTICLE), (req, res) => {
    const newArticle = articleService.create(req.body);

    return res.status(HttpResponseCode.CREATED).json(newArticle);
  });

  route.put(`/:articleId`, articleExist(articleService), (req, res) => {
    const updatedArticle = articleService.update(res.locals.article, req.body);

    return res.status(HttpResponseCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.delete(articleId);

    if (!article) {
      return res.status(HttpResponseCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpResponseCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    const comments = commentService.findAll(article);

    return res.status(HttpResponseCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    const deletedComment = commentService.delete(article, commentId);

    if (!deletedComment) {
      return res.status(HttpResponseCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpResponseCode.OK).json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), objectValidator(KeysForValidation.COMMENT)], (req, res) => {
    const {article} = res.locals;
    const newComment = commentService.create(article, req.body);

    return res.status(HttpResponseCode.CREATED).json(newComment);
  });

  return route;
};
