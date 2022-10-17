const express = require(`express`);
const mongoose = require(`mongoose`);
const bodyParser = require("body-parser");
const app = express();
const db = mongoose.connect("mongodb://localhost/bookAPI");
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const Book = require("./models/bookModel.js");
const User = require("./models/userModel.js");
const bcrypt = require("bcrypt")
const basicAuth = require('express-basic-auth');
const saltRounds = 2;
const { use } = require("bcrypt/promises");
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-w6lecynb.us.auth0.com/.well-known/jwks.json'
}),
audience: 'http://localhost:3000',
issuer: 'https://dev-w6lecynb.us.auth0.com/',
algorithms: ['RS256']
});

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

// app.use(basicAuth({
//   authorizer : dbAuthorizer,
//   authorizeAsync : true,
//   unauthorizedResponse : () => "You do not have access to this content"
// }));

async function dbAuthorizer(title, genre, callback) {
  try{
    // get matching book from db
    const book = await Book.findOne({where: {title: BookTitle}})
    // if title is valid compare genres
    let isValid = ( book != null ) ? await bcrypt.compare(genre, book.genre) : false;
    callback(null, isValid)
  }catch(err){
    //if authorizer fails, show error
    console.log("Error: ", err)
    callback(null, false)
  }
}

bookRouter
  .route("/users")
  .post((req, res) => {
    const user = new User(req.body);
    bcrypt.hash(user, async function (err, hash){

    })
    user.save();
    return res.status(201).json(user);
  })
  .get((req, res) => {
    const query = {};
    User.find(query, (err, users) => {
      if (err) {
        return res.send(err);
      }
      return res.json(users);
    });
  });

  bookRouter
  .route("/users/:userId")
  .get((req, res) => {
    Book.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.send(err);
      }
      return res.json(user);
    });
  })

  .put((req, res) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.send(err);
      }
      user.title = req.user.name;
      user.genre = req.user.password;
      return res.json(user);
    });
  });