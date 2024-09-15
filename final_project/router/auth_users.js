const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" }
];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required!" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username: username }, 'secretkey', { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token: accessToken });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add or update a book review (with JWT authentication)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Access the user from the req object (set by the middleware)
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review for the book
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", book: books[isbn] });
});

// Delete a book review (with JWT authentication)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Access the user from the req object (set by the middleware)
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has added a review for this book
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; // Remove the review
    return res.status(200).json({ message: "Review deleted successfully", book: books[isbn] });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
