require ('../config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
// const cors = require('cors');

const app = express();

const port = process.env.PORT;

// app.use(cors());
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(bodyParser.json());

// The authenticate middle ware look for the user by the token value
// and attach the user onto the request content
app.post('/todos', authenticate, (req, res) => {
	const todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((todos) => {
		res.send(todos);
	}, (err)=>{
		res.status(400).send(err);
	});
});

app.get('/todos', authenticate, (req, res)=>{
	Todo.find({
		_creator: req.user._id
	}).then((todos)=>{
		res.send({todos});
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todo/:id', authenticate, (req, res)=>{
	const id = req.params.id;

	if(!ObjectID.isValid(id)){
		res.status(400).send("Bad request with invalid ID");
	}

console.log(52, id, req.user._id);

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo)=>{
		if(!todo){
			res.status(404).send();
		}
		res.send({todo});

	}).catch((e)=>{
		 res.status(400).send();
	});

});

// app.delete('/todo/:id', authenticate, (req, res)=>{
// 	const _id = req.params.id;
// 	const _creator = req.user._id;

// 	Todo.findOneAndDelete({_id, _creator}).then((todo)=>{
// 		if(!todo){
// 			res.status(404).send(`Todo with id of ${_id} cannot be found`);
// 		}else{
// 			res.send({todo});
// 		}
// 	}).catch((e)=>{
// 		res.status(400).send("You are in trouble");
// 	});
// });

app.delete('/todo/:id', authenticate, async (req, res)=>{
	const _id = req.params.id;
	const _creator = req.user._id;

	try{
		const todo = await Todo.findOneAndDelete({_id, _creator});
		if(!todo){
			res.status(404).send(`Todo with id of ${_id} cannot be found`);
		}else{
			res.send({todo});
		}
	}catch(e){
		res.status(400).send("You are in trouble");
	}
});

app.patch('/todo/:id', authenticate, (req, res)=>{
	const _id = req.params.id;
	const _creator = req.user._id;

	const todoData = _.pick(req.body, ['text', 'completed'])

	if(_.isBoolean(todoData.completed) && todoData.completed){
		todoData.completedAt = new Date().getTime();
	}else{
		todoData.completed   = false;
		todoData.completedAt = null;
	}

	Todo.findOneAndUpdate({_id, _creator}, {$set: todoData}, {runValidators: true, upsert: false, setDefaultsOnInsert: false, new: true}).then((todo)=>{
		if(!todo){
			return res.status(404).send(`Todo with the id of ${_id} cannot be found`);
		}else{
			res.send({todo});
		}
	}).catch((err)=>{
		res.status(400).send(err);
	});
});

// POST /user
// app.post('/user', (req, res)=>{
// 	const userdata = _.pick(req.body, ['email', 'password'])

// 	const user = new User(userdata);

// 	user.save().then((paramUser) => {
// 		return paramUser.generateAuthToken();
// 	}).then((token)=>{
// 		res.header('x-auth', token).send(user);
// 	}).catch((err)=>{
// 		res.status(400).send(err);
// 	});
// });

// POST /user
app.post('/user', async (req, res)=>{
	const userdata = _.pick(req.body, ['email', 'password'])

	const user = new User(userdata);

	try{
		const paramUser = await user.save();
		const token = await paramUser.generateAuthToken();
		res.header('x-auth', token).send(user);
	}catch(err){
		res.status(400).send(err);
	}
});

// GET /users
app.get('/users', (req, res)=>{
	User.find().then((users)=>{
		if(users.length>0){
			res.send(users);
		}else{
			res.status(404).send("There is no user found");
		}
	}).catch((err)=>{
		res.status(400).send(err);
	});
});

// GET /user/:id
app.get('/user/:id', (req, res)=>{
	const id = req.params.id;

	User.findById(id).then((user)=>{
		if(user){
			res.send(user);
		}else{
			res.status(404).send(`There is no user find for ${id}`);
		}
	}).catch((err)=>{
		res.status(400).send(err);
	});
});

// DELETE /user/:id
// app.delete('/user/:id', (req, res)=>{
// 	const _id = req.params.id;

// 	User.findOneAndDelete({_id}).then((user)=>{
// 		if(user){
// 			res.send(user);
// 		}else{
// 			res.status(404).send(`User with id of ${_id} cannot be found`);
// 		}
// 	}).catch((err)=>{
// 		res.status(400).send(err);
// 	});
// });

// DELETE /user/:id
app.delete('/user/:id', async (req, res)=>{
	const _id = req.params.id;

	try{
		const user = await User.findOneAndDelete({_id});
		if(user){
			res.send(user);
		}else{
			res.status(404).send(`User with id of ${_id} cannot be found`);
		}
	}catch(err){
		res.status(400).send(err);
	}
});

function updateUser(_id, userData, res){
	User.findOneAndUpdate({_id}, {$set: userData}, {runValidators: true, upsert: false, setDefaultsOnInsert: false, new: true}).then((user)=>{
		if(!user){
			res.status(404).send("Cannot find user");
		}else{
			res.send({user});
		}
	}).catch((err)=>{
		res.status(400).send(err);
	});
}

app.patch('/user/:id', (req, res)=>{
	const _id = req.params.id;
	
	const userData = _.pick(req.body, ['email', 'password']);
	const newPassword = userData.password;
	if(newPassword){
		userData.password = "A_String_To_Be_Replaced";
	}

	User.findOneAndUpdate({_id}, {$set: userData}, {runValidators: true, upsert: false, setDefaultsOnInsert: false, new: true}).then((user)=>{
		if(newPassword){
			console.log(177, "There is a new password given.");
			return user.encryptPassword(newPassword);
		}else{
			console.log(180, "There is no password change.");
			return Promise.resolve(user);
		}
	}).then((user)=>{
		if(!user){
			res.status(404).send("Cannot find user");
		}else{
			res.send({user});
		}
	}).catch((err)=>{
		res.status(400).send(err);
	});

/*
	if(userData.password){
		bcrypt.genSalt(10, (err, salt)=>{
			bcrypt.hash(userData.password, salt, (err, hash)=>{
				userData.password = hash;

				updateUser(_id, userData, res);
			})
		});
	}else{
		updateUser(_id, userData, res);
	}
*/
});

app.get('/find/me', authenticate, (req, res)=>{
	res.send(req.user);
});

// app.post('/user/login', (req, res)=>{
// 	const userData = _.pick(req.body, ['email', 'password']);

// 	User.findByCredentials(userData.email, userData.password).then((user)=>{
// 		return user.generateAuthToken().then((token)=>{
// 			res.header('x-auth', token).send(user);
// 		});
// 	}).catch((err)=>{
// 		res.status(400).send(err);
// 	});
// });

app.post('/user/login', async (req, res)=>{
	const userData = _.pick(req.body, ['email', 'password']);
	console.log(289, userData);

    try{
        const user = await User.findByCredentials(userData.email, userData.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    }catch(err){
		console.log(296, err);
        res.status(400).send(err);
    }
});

app.delete('/find/me/token', authenticate, (req, res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	}).catch((err)=>{
		res.status(400).send();
	});
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
	response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(port, ()=>{
	console.log(`Started listening port ${port}`);
});

module.exports = {app};

