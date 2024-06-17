const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;
chai.use(chaiHttp);

describe('books', () => {
    let bookId;
    it('should create a new book', (done) => {
        const book = { id: "1", title: "The Alchemist", author: "Paulo Coelho"};
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                const body = res.body;
                expect(res.statusCode).to.be.equal(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                bookId = res.body.id;
                done();
            });
        });
    it('should get all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
              
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });});
    it('should get a book by id', (done) => {
        const bookID = 1;
        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
        });
    it('should update a book by id', (done) => {
        const bookId = 1;
        const updatedBook = { id: bookId, title: "updated book", author: "updated author"};
        chai.request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.title).to.equal('updated book');
                expect(res.body.author).to.equal('updated author');
                done();
            });
        }
    );
    it("should delete a book by name", (done) => {
        const newBook = { id:"123", title: "New Book", author: "New Author" };
    
        // First create a new book
        chai.request(server)
            .post(`/books`)
            .send(newBook)
            .end((err, res) => {
                
                const bookName = res.body.title; // Use book title instead of id
    
                // Then delete the book
                chai.request(server)
                    .delete(`/books/${newBook.id}`)
                    .end((err, res) => {
                        
                        expect(res).to.have.status(204);
                        done();
                    });
            });
    });
  
    it('should return 404 for non-existing book', (done) => {
        
        chai.request(server)
            .get(`/books/9999`)
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(404);                
            });
        chai.request(server)
            .put(`/books/9999`)
            .send({ id: 9999, title: "no book", author: "no author"})
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(404);
            });
        chai.request(server)
            .delete(`/books/9999`)
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
        });});