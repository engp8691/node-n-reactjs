const {ObjectId} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('./server');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {todos, populateTodos, users, populateUsers} = require('./tests/seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', ()=>{
	it('craete a new document in mongo DB', (done)=>{
		const text = 'Test text';

		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}

			Todo.find({text}).then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e) => done(e));
		});
	});

	it('empty text should not create a new object', (done)=>{
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({})
		.expect(400)
		.end((err, res) => {
			if(err){
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => done(e));
		});
	});
});

describe('GET /todos', ()=>{
	it('test get all todos', (done)=>{
		request(app)
		.get('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(1);
		})
		.end(done);
	});
});

describe('GET /todo/:id', ()=>{
	it('test get todo/:id with invalid id', (done)=>{
		request(app)
		.get(`/todo/123`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(400)
		.end(done);
	});

	it('test get todo/:id with valid id but not existing record', (done)=>{
		request(app)
		.get('/todo/5c6d8cd116ce8c2908bd0c4b')
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('test get todo/:id with existing record', (done)=>{
		console.log(88, todos[0]._id, users[0].tokens[0].token);

		request(app)
		.get(`/todo/${todos[0]._id}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res) => {
			if(err){
				return done(err);
			}

			expect(res.body.todo._id).toBe(`${todos[0]._id}`);
			done();
		});
	});
});

describe('DELETE /todo/:id', ()=>{
	it('test delete todo/:id with invalid id', (done)=>{
		request(app)
		.delete(`/todo/123`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(400)
		.end(done);
	});

	it('test delete todo/:id with valid id but not existing record', (done)=>{
		request(app)
		.delete('/todo/5c6d8cd116ce8c2908bd0c4b')
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('test delete todo/:id with existing record', (done)=>{
		request(app)
		.delete(`/todo/${todos[0]._id}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res)=>{
			if(err){
				return done(err);
			}

			// expect(res.body.todo._id).toBe(`${todos[0]._id}`);
			// done();

			Todo.findById(`${todos[0]._id}`).then((todo)=>{
				expect(todo).toBeNull();
				done();
			}).catch((e)=>done(e));
		});
	});
});

describe('UPDATE /todo/:id', ()=>{
	it('test update todo/:id with invalid id', (done)=>{
		request(app)
		.patch(`/todo/123`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(400)
		.end(done);
	});

	it('test update todo/:id with valid id but not existing record', (done)=>{
		request(app)
		.patch('/todo/5c6d8cd116ce8c2908bd0c2b')
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('test update todo/:id with existing record with data', (done)=>{
		const text = "My New Thing to Do";
		const completed = false;

		request(app)
		.patch(`/todo/${todos[0]._id}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({text, completed})
		.expect(200)
		.end((err, res)=>{
			if(err){
				return done(err);
			}

			// expect(res.body.todo._id).toBe(`${todos[0]._id}`);
			// done();

			Todo.findById(`${todos[0]._id}`).then((todo)=>{
				expect(todo.text).toBe(text);
				expect(todo.completed).toBe(completed);
				done();
			}).catch((e)=>done(e));
		});
	});
});

describe('Find Me /find/me', ()=>{
	it('test find me with header ', (done)=>{
		request(app)
		.get(`/find/me`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('test find me without header ', (done)=>{
		request(app)
		.get(`/find/me`)
		.set('x-auth', '')
		.expect(401)
		.expect((res)=>{
			expect(res.body).toEqual({});
		})
		.end(done);
	});
});

describe("POST /user/login", ()=>{
	it('login the user and return x-auth header', (done)=>{
		const email = users[1].email;
		const password = users[1].password;

		request(app)
		.post(`/user/login`)
		.send({email, password})
		.expect(200)
		.expect((res)=>{
			expect(res.headers['x-auth']).toBeTruthy();
		})
		.end((err, res)=>{
			if(err){
				done(err);
			}

			User.findById(users[1]._id).then((user)=>{
				expect(user.tokens[1].token).toBe(res.headers['x-auth']);

				done();
			}).catch((err)=>{
				done(err);
			});
		});
	});
});

describe("DELETE /find/me/token", ()=>{
	it('logout the user and remove the token with the x-auth header', (done)=>{
		request(app)
		.delete(`/find/me/token`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res)=>{
			User.findById(users[0]._id).then((user)=>{
				expect(user.tokens.length).toBe(0);

				done();
			}).catch((err)=>{
				done(err);
			});
		});
	});
});

