const con = require('../db-config');
const router = require('express').Router();

router.get('/', (req,res) => {
  con.query('SELECT * from users', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving users from database');
    } else {
      res.json(result);
    }
  });
});

router.get('/:id', (req,res) => {
  const userId = req.params.id;
  con.query('SELECT * from users WHERE id = ?',
  [userId],
  (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving user');
    } else {
      if(result.length) res.json(result[0]);
      else res.status(404).send('User not found');
    }
  });
});

router.post('/', (req,res) => {
  const { firstname, lastname, email, phone, country, comments } = req.body;
  con.query('INSERT INTO users (firstname, lastname, email, phone, country, comments) VALUES (?,?,?,?,?,?)',
  [ firstname, lastname, email, phone, country, comments ],
  (err,result) => {
    if (err) {
      res.status(500).send('Error adding user');
    } else {
      const id = result.insertId;
      const createdUser = { firstname, lastname, email, phone, country, comments };
      res.status(201).json(createdUser);
    }
  });
});

router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const db = connection.promise();
  let existingUser = null;

  db.query('SELECT * FROM users WHERE id = ?', 
  [userId])
  .then(([results]) => {
      existingUser = results[0];
      if (!existingUser) return Promise.reject('User not found')
      return db.query('UPDATE users SET ? WHERE id = ?', [req.body, userId]);
  })
  .then(() => {
      res.status(200).json({...existingUser, ...req.body});
  })
  .catch((err) => {
      console.log(err);
      if (err === 'User not found')
      res.status(404).send(`User with id ${userId} not found.`)
      else {
          res.status(500).send('Error updating user from database');
      }
  });
});

router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query(
      'DELETE FROM users WHERE id = ?',
      [userId],
      (err, result) => {
          if (err) {
              console.log(err);
              res.status(500).send('Error while deleting a user');
          }
          else
          {
              if(result.affectedRows) res.status(200).send('🎉 User deleted')
              else res.status(404).send('User not found!')
          }
      }
  )
})

module.exports = router;