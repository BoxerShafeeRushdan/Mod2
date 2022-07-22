const express = require(`express`);
const mongoose = require(`mongoose`);
const bodyParser = require("body-parser");
const app = express();
const db = mongoose.connect("mongodb://localhost/bookAPI");
const bookRouter = express.Router();
const port = process.env.PORT || 4000;
const Book = require("./models/bookModel.js");
const bcrypt = require("bcrypt")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

bookRouter
  .route("/books")
  .post((req, res) => {
    const book = new Book(req.body);
    bcrypt.hash(book, async function (err, hash){

    })
    book.save();
    return res.status(201).json(book);
  })
  .get((req, res) => {
    const query = {};
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  });

bookRouter
  .route("/books/:bookId")
  .get((req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  })

  .put((req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      book.title = req.book.title;
      book.genre = req.book.genre;
      book.read = req.book.read;
      return res.json(book);
    });
  });

app.use("/api", bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome to my Nodemon API!");
});

app.listen(port, () => {
  console.log(`Running on port + ${port}`);
});
