import React from 'react'
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'

const FilterLink = ({active, children, onClick}) => {
	return (
	<button
		onClick={onClick}
		disabled={active}
		style={{
			marginLeft: '4px',
		}}
	>
		{children}
	</button>
)};

// FilterLink has props of active, onClick. So map the stats to active prop and dispatch
// function to onClick handle as prop.
const mapStateToProps = (state, ownProps) => {
	console.log(20, ownProps);
	return {active: ownProps.filter === state.visibilityFilter }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
	});
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FilterLink)

