import React from 'react';
import { connect } from 'react-redux';
import { deleteTodo } from '../actions';
import { toggleTodo } from '../actions';
import { VisibilityFilterTypes } from '../actions';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './../components/App.css';

library.add(faTrash, faTimes, faTrashAlt);

const Todo = ({ onDelete, onClick, _id, text, completed, completedAt, _creator }) => {
	if(!completedAt){
		completedAt = Date.now();
	}
	return (
		<li
			data-todo-_id = {_id}
			data-todo-completed = {completed}
			data-todo-_creator = {_creator}
			data-todo-completedat = {completedAt}
		>

			<span className="contentwrapper">
				<span className='leftcolumn' onClick={onDelete}>
					<FontAwesomeIcon icon="trash" color="#222" size="sm" />
				</span>
				<span className='maincontainer'>
					{
						completed ? (
							<span className='outer'>
								<span class="theText" onClick={onClick}>
									{text}
								</span>
							</span>
						) : (
							<span className='theText' onClick={onClick}>
								{text}
							</span>
						)
					}

					{
						completed ? (
						<>
						<br/>
					<span className='normalSpan'>
						&nbsp;&nbsp;&nbsp;&nbsp;{ completed ? `(Competed at ${moment(completedAt).format('MM/DD/YY, h:mm:ss a')})` : null }
					</span>
						</>
						) : null
					}
				</span>
			</span>
		</li>
	)
	};

const VisibleTodoList = ({todo_elems, deleteTodo, toggleTodo}) => {
	console.log(46, todo_elems);

	return (
	<ul>
		{todo_elems.map(todo =><Todo
				key={todo._id}
				{...todo}
				onDelete={() => {
						ConfirmDelete(deleteTodo, todo._id);
//						var r = alert("Continue deletion?");
//						if (r == true) {
//							deleteTodo(todo._id);
//						}
					}
				}
				onClick={() => toggleTodo(todo._id, todo.completed)}
			/>
		)}
	</ul>
	);
}

// Auxiliary function

const ConfirmDelete = (deleteTodo, _id) => {
	confirmAlert({
		message: 'Are you sure to delete it?',
		buttons: [
			{
				label: 'Yes',
				onClick: () => {
					deleteTodo(_id);
				}
			},
			{
				label: 'No',
				onClick: () => 0 
			}
		]
	})
};

const getVisibleTodos = (todo_elems, filter) => {
	switch (filter) {
		case VisibilityFilterTypes.SHOW_ALL:
			return todo_elems
		case VisibilityFilterTypes.SHOW_COMPLETED:
			return todo_elems.filter(t => t.completed)
		case VisibilityFilterTypes.SHOW_ACTIVE:
			return todo_elems.filter(t => !t.completed)
/*
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
				console.log(82, res);
				if(res.status === 200){
					return res.json();
				}else{
					return Promise.reject();
				}
			}).then((responseData, err) => {
				console.log(89, responseData);
            }).catch((e)=>{
				console.log(91, e);
			});;
			return []
*/
		default:
			throw new Error('Unknown filter: ' + filter)
	}
}

const mapStateToProps = (state) => {
	console.log(103, state);

	// The state has todos and visibilityFiler fields because
	// reducers = combineReducers({todos, visibilityFilter, logout});
	return ({
		todo_elems: getVisibleTodos(state.todos, state.visibilityFilter)
	});
}

const mapDispatchToProps = dispatch => ({
	deleteTodo: (_id) => {
		const token = sessionStorage.getItem('x-auth');

		const data = JSON.stringify({_id: _id});

		var myInit = {
			method: 'DELETE',
			headers:{
				'Content-Type': 'application/json',
				'x-auth': token
			},
			body: data,
			mode: 'cors',
			cache: 'default'
		};

		fetch(`/todo/${_id}`, myInit).then(res => {
			return res.json();
		}).then((responseData, err) => {
			console.log(81, responseData, err);
		});

		return dispatch(deleteTodo(_id));
	},

	toggleTodo: (_id, completed) => {
		const token = sessionStorage.getItem('x-auth');

		const data = JSON.stringify({_id: _id, completed: !completed});

		var myInit = {
			method: 'PATCH',
			headers:{
				'Content-Type': 'application/json',
				'x-auth': token
			},
			body: data,
			mode: 'cors',
			cache: 'default'
		};

		fetch(`/todo/${_id}`, myInit).then(res => {
			return res.json();
		}).then((responseData, err) => {
			console.log(106, responseData, err);
		});

		return dispatch(toggleTodo(_id, completed));
	}
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VisibleTodoList)

