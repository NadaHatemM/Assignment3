const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, "users.json");

// Read users
function readUsers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}");
  }

  const data = fs.readFileSync(filePath, "utf8").trim();

  if (data === "") {
    fs.writeFileSync(filePath, "{}");
    return {};
  }

  return JSON.parse(data);
}

// Save users to the file.
function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// Q1: Add a user
app.post("/user", (req, res) => {
  const { name, age, email } = req.body;
  const users = readUsers();

  if (!name || age === undefined || !email) {
    return res.status(400).json({ message: "Enter name, age and email." });
  }

  for (const id in users) {
    if (users[id].email.toLowerCase() === email.toLowerCase()) {
      return res.status(409).json({ message: "Email already exists." });
    }
  }

  let highestId = 0;

  for (const id in users) {
    if (Number(id) > highestId) {
      highestId = Number(id);
    }
  }

  const newId = highestId + 1;

  users[newId] = {
    id: newId,
    name: name,
    age: age,
    email: email,
  };

  saveUsers(users);

  res.status(201).json({
    message: "User added successfully.",
    user: users[newId],
  });
});

// Q2: Update a user
app.patch("/user/:id", (req, res) => {
  const users = readUsers();
  const id = req.params.id;

  if (!Object.hasOwn(users, id)) {
    return res.status(404).json({ message: "User ID not found." });
  }

  const { name, age, email } = req.body;

  if (email !== undefined) {
    for (const otherId in users) {
      if (
        otherId !== id &&
        users[otherId].email.toLowerCase() === email.toLowerCase()
      ) {
        return res.status(409).json({ message: "Email already exists." });
      }
    }

    users[id].email = email;
  }

  if (name !== undefined) users[id].name = name;
  if (age !== undefined) users[id].age = age;

  saveUsers(users);

  res.json({
    message: "User updated successfully.",
    user: users[id],
  });
});

// Q3: Delete a user by ID
function deleteUser(req, res) {
  const id = req.params.id || req.body.id;
  const users = readUsers();

  if (!Object.hasOwn(users, id)) {
    return res.status(404).json({ message: "User ID not found." });
  }

  delete users[id];
  saveUsers(users);

  res.json({ message: "User deleted successfully." });
}

app.delete("/user/:id", deleteUser);
app.delete("/user", deleteUser);

// Q4: Get a user by name
app.get("/user/getByName", (req, res) => {
const name = req.query.name;
if (!name) return res.status(400).json({ message: "Name is required." });
const users = readUsers();

for (const id in users) {
    if (users[id].name.toLowerCase() === name.toLowerCase()) {
    return res.json(users[id]);
    }
}

res.status(404).json({ message: "User name not found." });
});

// Q5: Get all users
app.get("/user", (req, res) => {
  res.json(Object.values(readUsers()));
});

// Q6: Filter users by minimum age
app.get("/user/filter", (req, res) => {
  const minAge = Number(req.query.minAge);
  const users = readUsers();
  const result = {};

  for (const id in users) {
    if (users[id].age >= minAge) {
      result[id] = users[id];
    }
  }

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "no user found" });
}

res.json(Object.values(result));
});

// Q7: Get a user by ID
app.get("/user/:id", (req, res) => {
const users = readUsers();
const id = req.params.id;

if (!Object.hasOwn(users, id)) {
    return res.status(404).json({ message: "User not found." });
}

res.json(users[id]);
});

app.listen(3001, () => {
console.log("Server is running on port 3001");
});
