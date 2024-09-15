const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the user to the users array
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully", users});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate async operation, like fetching data from a database (if needed in the future)
    const bookList = await new Promise((resolve, reject) => {
      resolve(books); // In real scenarios, you'd resolve data from a DB
    });

    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found by this author");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({ message: err }));
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
