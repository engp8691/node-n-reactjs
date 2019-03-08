import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

const mapStateToProps = function(state, ownProps) {
	return {...state, ...ownProps}
}

const AddTodo = (props) => {
	// let dispatch = props.dispatch;
	// This is the fancy way
	let { dispatch } = props;

	let textInput;

	return (
		<div>
			<form onSubmit={(e) => {
				e.preventDefault();

				if (!textInput.value.trim()) {
					alert("Please type todo in the box");
					return
				}

				const token = sessionStorage.getItem('x-auth');
				console.log(25, token);

				const text = textInput.value.trim();

				var myInit = {
					method: 'POST',
					headers:{
						'Content-Type': 'application/json',
						'x-auth': token
					},
					body: JSON.stringify({text}),
					mode: 'cors',
					cache: 'default'
				};

				fetch('/todos', myInit).then(res => {
					if(res.status === 401){
						return Promise.reject();
					}else{
						return res.json();
					}
				}).then((responseData, err) => {
					if(responseData.errors){
						if(responseData.errors.text.message){
							alert(responseData.errors.text.message);
						}
					}else{
						textInput.value = '';
						console.log(50, responseData);

						dispatch(addTodo({
							_id: responseData._id,
							text: responseData.text,
							completed: responseData.completed,
							completedAt: responseData.completedAt,
							_creator: responseData._creator
						}));
					}
				}).catch(e=>{
					console.log(65, e);
					// props.history.push("/");
				});
			}}>

			<br/>
			<input type="text" ref={(txt)=>{textInput=txt;}} />
			&nbsp;
			<button type="submit">
				添加事项
			</button>
			</form>
		</div>
	)
}

// AddTodo is a container component, connect it to the Redux store.
export default connect(mapStateToProps)(AddTodo)

