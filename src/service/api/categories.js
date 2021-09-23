'use strict';

const {Router} = require(`express`);
const {HttpResponseCode} = require(`../../constants`);

module.exports = (service) => {
  const route = new Router();

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpResponseCode.OK).json(categories);
  });

  return route;
};
