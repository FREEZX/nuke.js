'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var App = require('./App.react');
var Login = require('./Login.react');
var Logout = require('./Logout.react');
var Home = require('./Home.react');
var Benchmarks = require('./Benchmarks.react');

var routes = (
  <Route handler={App}>
    <Route name="home" path="/" handler={Home}/>
    <Route name="benchmarks" handler={Benchmarks}/>
    <Route name="login" handler={Login}/>
    <Route name="logout" handler={Logout}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});