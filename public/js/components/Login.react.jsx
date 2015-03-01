'use strict';

var React = require('react');

var SigninForm = React.createClass({
  getInitialState: function () {
    return {
      username: 'Username'
    };
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
  	})
  	.fail(function(error){
  		self.setState({
  			success: 'Login failed with error '+error.message
  		});
  	});
  },
  render: function () {
    return (
      <form onSubmit={this.signin}>
      	<br/>
      	<label>Sign in</label><br/>
      	<input name="username" type="text" value={this.state.username} onChange={this._setUsername}></input><br/>
      	<input name="password" type="password" value={this.state.password} onChange={this._setPassword}></input><br/>
        <input type="submit"></input><br/>
        <label>{this.state.success}</label>
      </form>
    );
  }
});

module.exports = SigninForm;