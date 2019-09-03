DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  image VARCHAR(1000),
  isbn VARCHAR(15),
  description VARCHAR(255),
  bookshelf VARCHAR(255)
);

INSERT INTO books (title, author, image, isbn, description, bookshelf) VALUES('single quote boy','double quote girl', 'https://i.redd.it/yyxrrwfu4ze21.jpg', '15151515151515', 'little boy wants the love but dog explodes all over. what will he do? can he be the hero?', 'shelf 2');