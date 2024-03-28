import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
const password = "1234"; // Replace with your password

env.config();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/admin/:password", (req, res, next) => {
  if (req.params.password === password) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

let books = [];

app.get("/", (req, res) => {
  const orderedBy = req.query.ordered_by || "rating";

  let query = orderedBy
    ? `SELECT * FROM books ORDER BY ${orderedBy}`
    : "SELECT * FROM books";

  if (orderedBy === "read_date" || orderedBy === "rating") {
    query += " DESC";
  }

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    books = result.rows;

    res.render("index", { books: books });
  });
});

app.get("/admin/:password", (req, res) => {
  res.render("admin");
});

app.post("/add", (req, res) => {
  let { book_title, author, isbn, rating, date, comment } = req.body;

  if (!book_title) book_title = "Unknown";
  if (!author) author = "Unknown";
  if (!isbn) isbn = "Unknown";
  if (!rating) rating = 1;
  if (!date) date = new Date();
  if (!comment) comment = "No comment";

  db.query(
    "INSERT INTO books (book_title, author, isbn, rating, read_date, comment) VALUES ($1, $2, $3, $4, $5, $6)",
    [book_title, author, isbn, rating, date, comment],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added successfully");
        res.redirect(req.get("referer"));
      }
    }
  );
});

app.post("/delete", (req, res) => {
  db.query("DELETE FROM books WHERE isbn = $1", [req.body.isbn], (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted successfully");
      res.redirect(req.get("referer"));
    }
  });
});

app.post("/update", async (req, res) => {
  const { isbn } = req.body;

  const { rows } = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);

  const [book] = rows;

  const { book_title, author, rating, read_date, comment } = book;

  const updatedBook = {
    book_title: req.body.book_title || book_title,
    author: req.body.author || author,
    rating: req.body.rating || rating,
    read_date: req.body.read_date || read_date,
    comment: req.body.comment || comment,
    isbn,
  };

  db.query(
    "UPDATE books SET book_title = $1, author = $2, rating = $3, read_date = $4, comment = $5 WHERE isbn = $6",
    [
      updatedBook.book_title,
      updatedBook.author,
      updatedBook.rating,
      updatedBook.read_date,
      updatedBook.comment,
      isbn,
    ],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated successfully");
        res.redirect(req.get("referer"));
      }
    }
  );
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
