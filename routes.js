const routes = require('next-routes')();

routes
    .add('/elections/new', '/elections/new')
    .add('/elections/:address', '/elections/show')
    .add('/profile', '/profile/show');

module.exports = routes;
