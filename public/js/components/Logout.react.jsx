'use strict';

var React = require('react');

var SigninForm = React.createClass({
  getInitialState: function () {
    return {};
  },
  signout: function (event){
  	var self = this;
  	primus.request('/auth/signout', this.state)
  	.then(function(data){
  		self.setState({
  			success: 'Successfully logged out user'
  		});
  	})
  	.fail(function(error){
  		self.setState({
  			success: 'Logout failed with error '+error.message
  		});
  	});
  },
  render: function () {
    return (
    	<div>
      		<button onClick={this.signout}>Logout</button>
      		<label>{this.state.success}</label>
  		</div>
    );
  }
});

module.exports = SigninForm;