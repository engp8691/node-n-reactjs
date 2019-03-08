import { VisibilityFilterTypes } from '../actions'
import { combineReducers } from 'redux'

const todos = (state = [], action) => {
	console.log(5, "todos: ", action);

	switch (action.type) {
		case 'ADD_TODO':
			if(action.text){
				if(String(action.text).trim().length<1){
					return state;
				}
			}else{
				return state;
			}

			return [
				...state,
				{
					_id: action._id,
					text: action.text,
					completed: action.completed,
					completedAt: action.completedAt,
					_creator: action._creator
				}
			]

		case 'DELETE_TODO':
			
			if(!action._id){
				return state;
			}

			const array = [...state];

			var filtered = array.filter(function(todo, index, arr){
    			return todo._id !== action._id;
			});

			return [ ...filtered]; 

		case 'TOGGLE_TODO':
			return state.map((todo) =>{
				let completedAt = Date.now();
				if(todo.completed){
					completedAt = null; 
				}

				return ((todo._id === action._id) ? {...todo, completed: !todo.completed, completedAt} : todo);
			});
		default:
			return state
	}
}

const visibilityFilter = (state = VisibilityFilterTypes.SHOW_ALL, action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter
		default:
			return state
	}
}

const logout = (state = "logout", action) => {
	switch (action.type) {
		case 'LOGOUT':
			return "logout";
		default:
			return "login";
	}
}

const reducers = combineReducers({todos, visibilityFilter, logout});

export default reducers;

