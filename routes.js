const routes = require('next-routes')();

routes
    .add('/elections/new', '/elections/new')
    .add('/elections/:address', '/elections/show')
    .add('/profile', '/profile/view');

module.exports = routes;
