const db = require("../db");
const { camelToSnakeCase } = require("../utils/case-conversion");

const getInvoices = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM invoices", (err, results) => {
      if (err) {
        console.error("Error in getInvoices: ", err);
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createInvoice = (body) => {
  return new Promise((resolve, reject) => {
    const { transactionId, date, amountPaid } = body;
    db.query(
      "INSERT INTO invoices (transaction_id, date, amount_paid) VALUES ($1, $2, $3) RETURNING *",
      [transactionId, date, amountPaid],
      (err, results) => {
        if (err) {
          console.error("Error in createInvoice: ", err);
          reject(err);
        }
        resolve(
          `An invoice has been created with for transaction with id ${transactionId}.`
        );
      }
    );
  });
};

const getInvoiceById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM invoices WHERE id = $1`, [id], (err, results) => {
      if (err) {
        console.error("Error in getInvoiceById: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`invoice with id ${id} not found.`));
      }
      resolve(results.rows);
    });
  });
};

const deleteInvoice = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM invoices WHERE ID = $1", [id], (err, results) => {
      if (err) {
        console.error("Error in deleteInvoice: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`invoice with id ${id} not found.`));
      }
      resolve(`invoice deleted with id ${id}.`);
    });
  });
};

const patchInvoice = (id, body) => {
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
      reject(new Error(`Invoice with id ${id} not found.`));
    }

    const query = `UPDATE invoices SET ${setClause.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error in patchInvoice: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`invoice with id ${id} not found.`));
      }
      resolve(`Invoice with id ${id} updated.`);
    });
  });
};

module.exports = {
  getInvoices,
  createInvoice,
  getInvoiceById,
  deleteInvoice,
  patchInvoice,
};
