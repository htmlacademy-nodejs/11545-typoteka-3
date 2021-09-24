'use strict';

const {Router} = require(`express`);
const {HttpResponseCode} = require(`../../constants`);

module.exports = (searchService) => {
  const route = new Router();

  route.get(`/`, (req, res) => {
    const {query: searchText = ``} = req.query;

    if (!searchText) {
      res.status(HttpResponseCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = searchService.searchOffers(searchText);

    res.status(HttpResponseCode.OK).json(searchResults);
  });

  return route;
};
