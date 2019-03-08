const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
	_id: userOneId,
	email: 'yonglin@tom.com',
	password: 'PassWordOne',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
},{
	_id: userTwoId,
	email: 'marlyn@tom.com',
	password: 'PassWordTwo',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];

const todos = [{
		_id: new ObjectId(),
		text: 'First thing to do',
		_creator: userOneId
	}, {
		_id: new ObjectId(),
		text: 'Second thing to do',
		_creator: userTwoId
	}
];

const populateTodos = (done)=>{
	Todo.deleteMany({}).then(()=>{
		Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done)=>{
	User.deleteMany({}).then(()=>{
		// Both userOne and userTwo are promises. The save function returns Promise
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
		// Because Promise.all is returned as a promise so it can be chained.
	}).then(()=>done());
};

module.exports = {todos, populateTodos, users, populateUsers};


