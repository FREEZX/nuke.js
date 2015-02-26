var flux = require('flux-react');

module.exports = flux.createActions([
  'fetchArticles',
  'addArticle',
  'removeArticle'
]);