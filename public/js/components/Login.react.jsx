'use strict';

var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;

var SigninForm = React.createClass({
  mixins: [Navigation],
  getInitialState: function () {
    return {};
  },
  _setUsername: function (event){
    this.setState({
      username: event.target.value
    });
  },
  _setPassword: function (event){
    this.setState({
      password: event.target.value
    });
  },
  signin: function (event){
    event.preventDefault();
    var self = this;
    primus.request('/auth/signin', this.state)
    .then(function(data){
      self.setState({
        success: 'Successfully logged in user '+data.displayName
      });
      setTimeout(function(){
        self.transitionTo('home');
      }, 500);
    })
    .fail(function(error){
      self.setState({
        success: 'Login failed with error '+error.message
      });
    });
  },
  render: function () {
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <div className="col-md-offset-4 col-md-4">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">Sign in</h3>
                </div>
                <div className="panel-body">
                  <form role="form" onSubmit={this.signin}>
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-addon"><i className="fa fa-user addon-icon"></i></div>
                        <input type="text" className="form-control input-lg" name="username" placeholder="Enter username" value={this.state.username} onChange={this._setUsername}></input>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-addon"><i className="fa fa-key addon-icon"></i></div>
                        <input type="password" className="form-control input-lg" name="password" placeholder="Enter password" value={this.state.password} onChange={this._setPassword}></input>
                      </div>
                    </div>
                    <input type="submit" className="btn btn-success"></input><br/><br/>
                    <div className={this.state.success ? 'alert alert-success' : ''} role="alert">{this.state.success}</div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-offset-4 col-md-4 well">
              Login with username: "demo" and password: "demo123"
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SigninForm;