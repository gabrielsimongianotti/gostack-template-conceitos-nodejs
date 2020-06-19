const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next();

  console.timeEnd(logLabel)
}

function validateRepositoriesId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid project ID" })

  return next()
}

app.use(logRequests)
app.use('/repositories/:id', validateRepositoriesId)


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repositorie = { title, id: uuid(), url, techs, likes: 0 }

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repositorieIndex = repositories.findIndex(project => id == project.id)

  if (repositorieIndex < 0) {
    response.status(400).json({ error: "project not found." })
  }

  repositories[repositorieIndex].title = title;
  repositories[repositorieIndex].url = url;
  repositories[repositorieIndex].techs = techs;

  return response.json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(project => id == project.id);

  if (repositorieIndex < 0) {
    response.status(400).json({ error: "project not found." });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(project => id == project.id);

  if (repositorieIndex < 0) {
    response.status(400).json({ error: "project not found." })
  }

  repositories[repositorieIndex].likes++

  return response.json(repositories[repositorieIndex])
});

app.put("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const {likes} = request.body
  const repositorieIndex = repositories.findIndex(project => id == project.id)

  if (repositorieIndex < 0) {
    response.status(400).json({ error: "project not found." })
  }

  repositories[repositorieIndex].likes = likes;

  return response.json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const {likes} = request.body
  const repositorieIndex = repositories.findIndex(project => id == project.id)

  if (repositorieIndex < 0) {
    response.status(400).json({ error: "project not found." })
  }

  repositories[repositorieIndex].likes = 0;
  
  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
