const express = require('express');

const app = express();

app.use(express.json());

// Initial data
let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Function to validate book data
function isValidBook(book) {
    return (
        typeof book.title === 'string' && book.title.trim() !== '' &&
        typeof book.author === 'string' && book.author.trim() !== '' &&
        typeof book.genre === 'string' && book.genre.trim() !== '' &&
        typeof book.publishedYear === 'number' &&
        Number.isInteger(book.publishedYear) &&
        typeof book.available === 'boolean'
    );
}

// 1. GET all books
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

// 2. POST a new book
app.post('/api/books', (req, res) => {

    const { title, author, genre, publishedYear, available } = req.body;

    if (!isValidBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    const newBook = {
        id: Math.max(100, ...books.map(book => book.id)) + 1,
        title,
        author,
        genre,
        publishedYear,
        available
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// 3. Filter books by author
// IMPORTANT: Keep this route before /:id
app.get('/api/books/filter', (req, res) => {

    const author = req.query.author;

    if (typeof author !== 'string' || !author.trim()) {
        return res.status(400).json({
            message: "Author query parameter is required"
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase().includes(author.trim().toLowerCase())
    );

    res.status(200).json(filteredBooks);
});

// 4. GET book by ID
app.get('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 5. PUT - Update book
app.put('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!isValidBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    books[index] = {
        id: id,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        publishedYear: req.body.publishedYear,
        available: req.body.available
    };

    res.status(200).json(books[index]);
});

// 6. DELETE book
app.delete('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});