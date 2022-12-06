const express = require('express');
const app = express();
const port = 3000;
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
};

const connection = mysql.createConnection(config);

connection.query(
  'create table if not exists people(id int not null auto_increment, name varchar(255), primary key (id));'
);

function htmlReturn(nameList) {
  return `
  <h1>Full Cycle Rocks!</h1>
  <ul>
    ${nameList.map((name) => `<li>${name}</li>`)}
  </ul>
  `;
}

app.get('/', async (_, res) => {
  const inserNewPerson = `INSERT INTO people(name) values('${faker.name.firstName(
    'female'
  )}')`;

  console.log('inserNewPerson', inserNewPerson);

  connection.query(inserNewPerson, (err, result) =>
    err
      ? res.send(err)
      : connection.query('SELECT * FROM people', (selectErr, selectResult) =>
          selectErr
            ? res.send(selectErr)
            : res.send(htmlReturn(selectResult.map((item) => item.name)))
        )
  );
});

// connection.end();

app.listen(port, () => {
  console.log('Rodando na porta ' + port);
});
