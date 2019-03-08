export const addTodo = (data) => ({
  type: 'ADD_TODO',
  _id: data._id,
  text: data.text,
  completed: data.completed,
  completedAt: data.completedAt,
  _creator: data._creator
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = (_id) => ({
  type: 'TOGGLE_TODO',
  _id
})

export const deleteTodo = (_id) => ({
  type: 'DELETE_TODO',
  _id
})

export const VisibilityFilterTypes = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
