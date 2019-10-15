const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?name=1
// const name = req.query.name;

// Route params = /users/1
// const { id } = req.params;

// Request body = { "name": "luisito", "email": "luisito@c.d" }
// server.use(express.json());
// const { name } = req.body;

// CRUD - Create, Read, Update, Delete

const users = ["Luisito", "Igor", "Luigi", "William"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`HTTPMethod: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "name not found in request body" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User not found in database" });
  }

  req.user = user;

  return next();
}

server.get("/test", (req, res) => {
  const name = req.query.name;

  return res.json({ message: `Hello ${name}` });
});

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  // const index = req.params.index;

  return res.json(req.user);
});

server.post("/users", checkNameExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkNameExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
