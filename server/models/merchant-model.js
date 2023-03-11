const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getMerchants = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM merchants", (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createMerchant = (body) => {
  return new Promise((resolve, reject) => {
    const { name, email } = body;
    pool.query(
      "INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(
          `A new merchant has been created with name ${name} and email ${email}.`
        );
      }
    );
  });
};

const deleteMerchant = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM merchants WHERE ID = $1", [id], (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(`Merchant deleted with id ${id}.`);
    });
  });
};

module.exports = { getMerchants, createMerchant, deleteMerchant };
