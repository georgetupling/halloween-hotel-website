const db = require("../db");
const { camelToSnakeCase } = require("../utils/case-conversion");

const getTransactions = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM transactions", (err, results) => {
      if (err) {
        console.error("Error in getTransactions: ", err);
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createTransaction = (body) => {
  return new Promise((resolve, reject) => {
    const { customerId, date } = body;
    db.query(
      "INSERT INTO transactions (customer_id, date) VALUES ($1, $2) RETURNING *",
      [customerId, date],
      (err, results) => {
        if (err) {
          console.error("Error in createTransaction: ", err);
          reject(err);
        }
        resolve(
          `A new transaction has been created for customer with id ${customerId}.`
        );
      }
    );
  });
};

const getTransactionById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM transactions WHERE id = $1`,
      [id],
      (err, results) => {
        if (err) {
          console.error("Error in getTransactionById: ", err);
          reject(err);
        } else if (results.rowCount === 0) {
          reject(new Error(`Transaction with id ${id} not found.`));
        }
        resolve(results.rows);
      }
    );
  });
};

const deleteTransaction = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM transactions WHERE ID = $1", [id], (err, results) => {
      if (err) {
        console.error("Error in deleteTransaction: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Transaction with id ${id} not found.`));
      }
      resolve(`Transaction deleted with id ${id}.`);
    });
  });
};

const patchTransaction = (id, body) => {
  return new Promise((resolve, reject) => {
    const snakeCaseBody = {};
    for (const [key, value] of Object.entries(body)) {
      snakeCaseBody[camelToSnakeCase(key)] = value;
    }

    const setClause = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(snakeCaseBody)) {
      setClause.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    if (setClause.length === 0) {
      reject(new Error(`Transaction with id ${id} not found.`));
    }

    const query = `UPDATE transactions SET ${setClause.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error in patchTransaction: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Transaction with id ${id} not found.`));
      }
      resolve(`Transaction with id ${id} updated.`);
    });
  });
};

module.exports = {
  getTransactions,
  createTransaction,
  getTransactionById,
  deleteTransaction,
  patchTransaction,
};
