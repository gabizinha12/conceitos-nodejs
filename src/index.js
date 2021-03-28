const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username)
  if (!user) {
    return response.status(400).json({ error: "User not found" })
  }
  request.user = user;
  return next();

}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const id = uuidv4()
  const userArleadyExists = users.some((user) => user.username === username)

  if (userArleadyExists) {
    return response.status(400).json({ error: "User arleady exists" })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })
  return response.status(201).send()

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const todoOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()

  }
  user.todos.push(todoOperation)
  return response.status(201).send()
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = users.find(user => user.todos.id === id)

  user.todos.push(todo)
  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { done } = request.body;
  const { id } = request.params;

  const todo = users.find(user => user.todos.id === id)

  user.todos.push(todo)
  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = users.find(user => user.todos.id === id)

  user.todos.splice(todo, 1)
  return response.status(200).send()

});

module.exports = app;