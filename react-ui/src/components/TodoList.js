import React from 'react';
import { connect } from 'react-redux';

import {addTodo} from '../actions';

import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

import './App.css';

class TodoList extends React.Component {
	addATodo(sth){
		this.props.toAddTodo(sth);
	}

	componentDidMount() {
		const token = sessionStorage.getItem('x-auth');
		console.log(19, token);

		var myInit = {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
				'x-auth': token
            },
            mode: 'cors',
            cache: 'default'
        };

        fetch('/todos', myInit).then(res => {
			console.log(32, res);
			if(res.status === 401){
				return Promise.reject();
			}else{
				return res.json();
			}
		}).then((responseData, err) => {
			console.log(35, responseData, err);

			if(!err){
				if(responseData.todos && responseData.todos.length>0){
					responseData.todos.forEach(aThing=>{
						console.log(35, aThing);

						this.props.toAddTodo({
							_id: aThing._id,
							text: aThing.text,
							completed: aThing.completed,
							completedAt: aThing.completedAt,
							_creator: aThing._creator
						});
					});
				}
			}else{
				console.log(56, "Please log me out");
			}
		}).catch(e=>{
			console.log(59, e);
			this.props.history.push("/");
		});
	}
	
	render(){
		console.log(66, "Componet refresh");

		return (
			<div>
				<VisibleTodoList />
				<AddTodo />
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
    console.log(78, state);

	return {...state.todos};
}

const mapDispatchToProps = dispatch => {
    return {
        toAddTodo: (sth) => dispatch(addTodo(sth))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);

