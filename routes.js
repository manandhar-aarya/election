const routes = require('next-routes')();

routes
    .add('/elections/new', '/elections/new')
    .add('/elections/:address', '/elections/show');

module.exports = routes;
