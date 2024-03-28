# Books Project

## Description

This is a personal project by Maxrosoft, which is a collection of all the books that the creator has ever read. The project aims to provide a comprehensive list and details of the books, making it a valuable resource for book enthusiasts.

## Features

The project offers various features to enhance the user experience.

## Installation

1. **Clone the Repository**

   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/Maxrosoft/books-project.git
2. **Navigate to the Directory Change your current directory to the project’s directory**:
   ```bash
    cd books-project
3. **Install Dependencies**
   ```bash
   npm i
4. **Run the Project**
   ```bash
   nodemon index.js   
## Usage

This project uses a PostgreSQL database named `books`. Here are the steps to set it up:

1. **Create the Database**

   First, you need to create a new PostgreSQL database named `books`. You can do this with the following SQL command:

   ```sql
   CREATE DATABASE books;
2. **Create the Table**

   Next, you need to create a table named books in your new database. This table has the following fields: id, book_title, isbn, rating, read_date, comment, and author. You can create this table with the following SQL command:

   ```sql
   CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    book_title VARCHAR(255),
    isbn VARCHAR(13),
    rating INTEGER,
    read_date DATE,
    comment TEXT,
    author VARCHAR(255));

  Please note that these are general instructions and might need to be adapted based on the specifics of your project.
## License

This project is licensed under the ISC license. For more information, please refer to the ISC license documentation.

