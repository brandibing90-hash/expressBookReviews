const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const doesExist = users.some((user) => user.username === username);

    if (!doesExist) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Provide username and password." });
});

// Task 10: Get the book list available in the shop using Async/Await & Promises
public_users.get('/', async function (req, res) {
  try {
    const fetchBooks = () => Promise.resolve(books);
    const booksList = await fetchBooks();
    return res.status(200).send(JSON.stringify({ books: booksList }, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books list" });
  }
});

// Task 11: Get book details based on ISBN using Async/Await & Promises
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const fetchBookByISBN = (id) => {
      return new Promise((resolve, reject) => {
        if (books[id]) {
          resolve(books[id]);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };
    const book = await fetchBookByISBN(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
  
// Task 12: Get book details based on author using Async/Await & Promises
public_users.get('/author/:author', async function (req, res) {
  try {
    const authorParam = req.params.author.toLowerCase();
    const fetchBooksByAuthor = (author) => {
      return new Promise((resolve) => {
        const filteredBooks = {};
        Object.keys(books).forEach(key => {
          if (books[key].author.toLowerCase() === author) {
            filteredBooks[key] = books[key];
          }
        });
        resolve(filteredBooks);
      });
    };
    const filtered = await fetchBooksByAuthor(authorParam);
    if (Object.keys(filtered).length > 0) {
      return res.status(200).send(JSON.stringify(filtered, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error processing author search" });
  }
});

// Task 13: Get all books based on title using Async/Await & Promises
public_users.get('/title/:title', async function (req, res) {
  try {
    const titleParam = req.params.title.toLowerCase();
    const fetchBooksByTitle = (title) => {
      return new Promise((resolve) => {
        const filteredBooks = {};
        Object.keys(books).forEach(key => {
          if (books[key].title.toLowerCase() === title) {
            filteredBooks[key] = books[key];
          }
        });
        resolve(filteredBooks);
      });
    };
    const filtered = await fetchBooksByTitle(titleParam);
    if (Object.keys(filtered).length > 0) {
      return res.status(200).send(JSON.stringify(filtered, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error processing title search" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
