import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';

class Register extends Component {
	constructor () {
		super();

		this.state = {
			email: "fake@tom.com",
			password: "PassWordOne"
        };
 
        this.onSubmit = this.onSubmit.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
    }

	onSubmit(e) {
		e.preventDefault();
		const data = JSON.stringify(this.state);

		fetch("/user/", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			redirect: "follow",
			referrer: "no-referrer",
			body: data
		}).then((response) => {
			return response.json();
		}).then((responseData, err) => {
			if(err){
				alert("There is error happened");
			}else{
				if(responseData.errmsg){
					console.log(37, responseData);
					alert("Existing email, plase login");
					this.props.history.push("/");
				}else{
					return (<Redirect to='/listtodo' />);
				}
			}
  		});
    }

    onEmailChange(e) {
        const email = e.target.value;
        this.setState({ email });
    }

    onPasswordChange(e) {
        const password = e.target.value;
        this.setState({ password });
    }

	render() {
		return (
			<div className="centered-form__form">
			<form onSubmit={this.onSubmit}>
				<div className="form-field">
					<h3>Please Register</h3>
				</div>
				<div className="form-field">
					<label>Email:</label>
					<input type="text" id="email" name="email" onChange={this.onEmailChange} value={this.state.email} />
				</div>
				<div className="form-field">
					<label>Password</label>
					<input type="password" id="password" name="password" onChange={this.onPasswordChange} value={this.state.password} />
				</div>
				<div className="form-field">
					<button className="login">Register</button>
				</div>
			</form>
			</div>
		);
	}
}

export default Register;

