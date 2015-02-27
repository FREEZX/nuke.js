'use strict';

var React = require('react');

var SignupForm = React.createClass({
  getInitialState: function () {
    return {
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'Username',
      email: 'Email'
    };
  },
  _setFirstName: function (event){
    this.setState({
      firstName: event.target.value
    });
  },
  _setLastName: function (event){
    this.setState({
      lastName: event.target.value
    });
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
  _setEmail: function (event){
    this.setState({
      email: event.target.value
    });
  },
  signup: function (event){
  	event.preventDefault();
  	var self = this;
  	primus.request('/auth/signup', this.state)
  	.then(function(data){
  		self.setState({
  			success: 'Successfully created user '+data.displayName
  		});
  	})
  	.fail(function(error){
  		self.setState({
  			success: 'Signup failed with error '+error.message
  		});
  	});
  },
  render: function () {
    return (
      <form onSubmit={this.signup}>
      	<br/>
      	<label>Sign up</label><br/>
      	<input name="firstName" type="text" value={this.state.firstName} onChange={this._setFirstName}></input><br/>
      	<input name="lastName" type="text" value={this.state.lastName} onChange={this._setLastName}></input><br/>
      	<input name="username" type="text" value={this.state.username} onChange={this._setUsername}></input><br/>
      	<input name="email" type="text" value={this.state.email} onChange={this._setEmail}></input><br/>
      	<input name="password" type="password" value={this.state.password} onChange={this._setPassword}></input><br/>
        <input type="submit"></input><br/>
        <label>{this.state.success}</label>
      </form>
    );
  }
});

module.exports = SignupForm;