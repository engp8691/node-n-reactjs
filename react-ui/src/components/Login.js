import React, { Component } from 'react';
import './App.css';

class Login extends Component {
	constructor () {
		super();
 
		this.state = {
			email: "yonglin@tom.com",
			password: "PassWordOne",
			xauth: ""
		};
 
        this.onSubmit = this.onSubmit.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
    }

	componentDidMount() {
		const token = sessionStorage.getItem('x-auth');

		var myInit = {
			method: 'DELETE',
			headers:{
				'Content-Type': 'application/json',
				'x-auth': token
			},
			mode: 'cors',
			cache: 'default'
		};

		fetch('/find/me/token', myInit).then(res => {
			if(res.status === 200){
				console.log(34, res);
				sessionStorage.setItem("x-auth", "");
				return res.json();
			}else{
				if(res.status === 401){
					console.log(34, res);
					return Promise.reject(res.statusText);
				}else{
					return Promise.resolve();
				}
			}
		}).then((responseData, err) => {
			console.log(89, responseData);
		}).catch((e)=>{
			console.log(91, e);
		});

		sessionStorage.setItem("x-auth", "");
	}

	onSubmit(e) {
		e.preventDefault();
		const data = JSON.stringify(this.state);

		// fetch("https://sleepy-ocean-58992.herokuapp.com/user/login/", {
		fetch("/user/login/", {
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
			for (var pair of response.headers.entries()) {
				if(pair[0] === 'x-auth'){
					console.log(pair[0]+ ': '+ pair[1]);
					sessionStorage.setItem(pair[0], pair[1]);
				}
			}

			return response.json();
		}).then((responseData, err) => {
			console.log(responseData, err);
			console.log(46, sessionStorage.getItem('x-auth'));

			this.props.history.push("/todolist");
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
					<h3>Please Login</h3>
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
					<button class="login">Login</button>
				</div>
				<div className="form-field">
					<span className="regLink">New user <a href="/register">register</a></span>
				</div>
			</form>
			</div>
		);
	}
}

export default Login;

