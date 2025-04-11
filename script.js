const contentDiv = document.getElementById('content');
const showBooksBtn = document.getElementById('showBooks');
const addBookBtn = document.getElementById('addBookBtn');
const showUsersBtn = document.getElementById('showUsers');
const addUserBtn = document.getElementById('addUserBtn');
const showBorrowedBtn = document.getElementById('showBorrowed');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const notificationArea = document.getElementById('notification-area');

const STORAGE_KEY_BOOKS = 'library_books';
const STORAGE_KEY_USERS = 'library_users';
const STORAGE_KEY_BORROWED = 'library_borrowed';

// Load data from local storage
let books = JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKS)) || [
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0618260274' },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0446310789' },
    { id: 4, title: '1984', author: 'George Orwell', isbn: '978-0451524935' },
    { id: 5, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565' },
    { id: 6, title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', isbn: '978-0061120084' },
    { id: 7, title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', isbn: '978-0345391803' },
    { id: 8, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', isbn: '978-0590353403' }
];
let users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS)) || [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
];
let borrowedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY_BORROWED)) || [];
let allBooks = [...books];

// Function to save data to local storage
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_BORROWED, JSON.stringify(borrowedBooks));
}

function showNotification(message) {
    notificationArea.textContent = message;
    setTimeout(() => {
        notificationArea.textContent = '';
    }, 3000); // Clear after 3 seconds
}

function BookList({ books }) {
    if (books.length === 0) {
        return '<p>No books available.</p>';
    }
    const bookItems = books.map(book => `
        <div class="book-item">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <div class="book-actions">
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
                <button onclick="borrowBook(${book.id})">Borrow</button>
            </div>
        </div>
    `).join('');
    return `<div class="book-grid">${bookItems}</div>`;
}

function renderBooks(bookList = books) {
    contentDiv.classList.add('fade-out');
    setTimeout(() => {
        contentDiv.innerHTML = `<h2>Books</h2>${BookList({ books: bookList })}`;
        contentDiv.classList.remove('fade-out');
    }, 300);
}

function AddBookForm() {
    return `
        <h2>Add New Book</h2>
        <form id="addBookForm">
            <label for="title">Title:</label><br>
            <input type="text" id="title" name="title" required><br>
            <label for="author">Author:</label><br>
            <input type="text" id="author" name="author" required><br>
            <label for="isbn">ISBN:</label><br>
            <input type="text" id="isbn" name="isbn" required><br><br>
            <button type="submit">Add Book</button>
        </form>
    `;
}

function renderAddBookForm() {
    contentDiv.innerHTML = AddBookForm();
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
}

function handleAddBook(event) {
    event.preventDefault();
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const isbnInput = document.getElementById('isbn');

    const newBook = {
        id: Date.now(),
        title: titleInput.value,
        author: authorInput.value,
        isbn: isbnInput.value
    };
    books.push(newBook);
    allBooks.push(newBook);
    renderBooks();
    saveToLocalStorage();
    showNotification('Book added successfully!');
}

function editBook(id) {
    const bookToEdit = books.find(book => book.id === id);
    if (bookToEdit) {
        contentDiv.innerHTML = `
            <h2>Edit Book</h2>
            <form id="editBookForm">
                <input type="hidden" id="bookId" value="${bookToEdit.id}">
                <label for="title">Title:</label><br>
                <input type="text" id="title" name="title" value="${bookToEdit.title}" required><br>
                <label for="author">Author:</label><br>
                <input type="text" id="author" name="author" value="${bookToEdit.author}" required><br>
                <label for="isbn">ISBN:</label><br>
                <input type="text" id="isbn" name="isbn" value="${bookToEdit.isbn}" required><br><br>
                <button type="submit">Save Changes</button>
            </form>
        `;
        document.getElementById('editBookForm').addEventListener('submit', handleEditBookSubmit);
    }
}

function handleEditBookSubmit(event) {
    event.preventDefault();
    const bookId = parseInt(document.getElementById('bookId').value);
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const isbnInput = document.getElementById('isbn');

    const index = books.findIndex(book => book.id === bookId);
    const allBooksIndex = allBooks.findIndex(book => book.id === bookId);
    if (index !== -1 && allBooksIndex !== -1) {
        books[index] = {
            id: bookId,
            title: titleInput.value,
            author: authorInput.value,
            isbn: isbnInput.value
        };
        allBooks[allBooksIndex] = { ...books[index] };
        renderBooks();
        saveToLocalStorage();
        showNotification('Book updated successfully!');
    }
}

function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    allBooks = allBooks.filter(book => book.id !== id);
    renderBooks();
    saveToLocalStorage();
    showNotification('Book deleted successfully!');
}

function UserList({ users }) {
    if (users.length === 0) {
        return '<p>No users available.</p>';
    }
    const userItems = users.map(user => `
        <div class="user-item">
            <h3>${user.name}</h3>
            <div class="user-actions">
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `).join('');
    return `<div class="user-grid">${userItems}</div>`;
}

function renderUsers() {
    contentDiv.classList.add('fade-out');
    setTimeout(() => {
        contentDiv.innerHTML = UserList({ users: users });
        contentDiv.classList.remove('fade-out');
    }, 300);
}

function AddUserForm() {
    return `
        <h2>Add New User</h2>
        <form id="addUserForm">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required><br><br>
            <button type="submit">Add User</button>
        </form>
    `;
}

function renderAddUserForm() {
    contentDiv.innerHTML = AddUserForm();
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
}

function handleAddUser(event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const newUser = {
        id: Date.now(),
        name: nameInput.value
    };
    users.push(newUser);
    renderUsers();
    saveToLocalStorage();
    showNotification('User added successfully!');
}

function editUser(id) {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
        contentDiv.innerHTML = `
            <h2>Edit User</h2>
            <form id="editUserForm">
                <input type="hidden" id="userId" value="${userToEdit.id}">
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name" value="${userToEdit.name}" required><br><br>
                <button type="submit">Save Changes</button>
            </form>
        `;
        document.getElementById('editUserForm').addEventListener('submit', handleEditUserSubmit);
    }
}

function handleEditUserSubmit(event) {
    event.preventDefault();
    const userId = parseInt(document.getElementById('userId').value);
    const nameInput = document.getElementById('name');
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users[index] = {
            id: userId,
            name: nameInput.value
        };
        renderUsers();
        saveToLocalStorage();
        showNotification('User updated successfully!');
    }
}

function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    renderUsers();
    saveToLocalStorage();
    showNotification('User deleted successfully!');
}

function BorrowedBookList({ borrowedBooks, books, users }) {
    if (borrowedBooks.length === 0) {
        return '<p>No books currently borrowed.</p>';
    }
    const borrowedItems = borrowedBooks.map(item => {
        const book = books.find(b => b.id === item.bookId);
        const user = users.find(u => u.id === item.userId);
        if (book && user) {
            return `
                <li>
                    ${book.title} (Borrowed by: ${user.name}, Due: ${item.dueDate})
                    <button onclick="returnBook(${item.bookId})">Return</button>
                </li>
            `;
        }
        return '';
    }).join('');
    return `<h2>Borrowed Books</h2><ul>${borrowedItems}</ul>`;
}

function renderBorrowedBooks() {
    contentDiv.classList.add('fade-out');
    setTimeout(() => {
        contentDiv.innerHTML = BorrowedBookList({ borrowedBooks: borrowedBooks, books: books, users: users });
        contentDiv.classList.remove('fade-out');
    }, 300);
}

function borrowBook(bookId) {
    if (users.length === 0) {
        alert('No users available to borrow the book.');
        return;
    }
    let userOptions = '<option value="">Select User</option>';
    users.forEach(user => {
        userOptions += `<option value="${user.id}">${user.name}</option>`;
    });

    const bookToBorrow = books.find(book => book.id === bookId);
    if (bookToBorrow && !borrowedBooks.some(item => item.bookId === bookId)) {
        contentDiv.innerHTML = `
            <h2>Borrow Book: ${bookToBorrow.title}</h2>
            <form id="borrowBookForm">
                <label for="userId">Select User:</label><br>
                <select id="userId" name="userId" required>
                    ${userOptions}
                </select><br>
                <label for="dueDate">Due Date:</label><br>
                <input type="date" id="dueDate" name="dueDate" required><br><br>
                <button type="submit">Borrow</button>
            </form>
        `;
        document.getElementById('borrowBookForm').addEventListener('submit', handleBorrowBookSubmit);
    } else if (borrowedBooks.some(item => item.bookId === bookId)) {
        alert('This book is already borrowed.');
    } else {
        alert('Book not found.');
    }
}

function handleBorrowBookSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const selectElement = form.querySelector('#userId');
    const selectedUserId = parseInt(selectElement.value);
    const dueDateInput = form.querySelector('#dueDate');
    const dueDate = dueDateInput.value;
    const bookTitle = form.parentElement.querySelector('h2').textContent.split(': ')[1];
    const book = books.find(b => b.title === bookTitle);

    if (book) {
        borrowedBooks.push({ bookId: book.id, userId: selectedUserId, borrowDate: new Date(), dueDate: dueDate });
        renderBorrowedBooks();
        saveToLocalStorage();
        showNotification('Book borrowed successfully!');
    } else {
        alert('Book not found.');
    }
}

function returnBook(bookId) {
    borrowedBooks = borrowedBooks.filter(item => item.bookId !== bookId);
    renderBorrowedBooks();
    saveToLocalStorage();
    showNotification('Book returned successfully!');
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
}

showBooksBtn.addEventListener('click', renderBooks);
addBookBtn.addEventListener('click', renderAddBookForm);
showUsersBtn.addEventListener('click', renderUsers);
addUserBtn.addEventListener('click', renderAddUserForm);
showBorrowedBtn.addEventListener('click', renderBorrowedBooks);
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('input', handleSearch);

// Initial rendering
renderBooks();
renderUsers();
renderBorrowedBooks();