var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var _ = require('underscore');

var PORT = process.env.PORT || 3000;

var todos = [];

var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

// POST /todos/
app.post('/todos', function (req, res) {
	// var body = _.pick(req.body, "description", "completed");
	var body = req.body;
	if (!(_.isBoolean(body.completed) && _.isString(body.description)) || body.description.trim().length  === 0) {
		return res.status(400).send();
	}

	console.log('description: ' + body.description);
	body.id = todoNextId;
	body.description = body.description.trim();
	todoNextId += 1;
	// console.log(_.pick(body, "id", "description", "completed"))
	todos.push(_.pick(body, "id", "description", "completed"));
	// todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo item found with id " + todoId});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});