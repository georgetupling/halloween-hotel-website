const db = require("../db");
const { camelToSnakeCase } = require("../utils/case-conversion");

const getCustomers = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM customers", (err, results) => {
      if (err) {
        console.error("Error in getCustomers: ", err);
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createCustomer = (body) => {
  return new Promise((resolve, reject) => {
    const { fName, lName, gender, dob, phoneNumber, email, password } = body;
    const cleanPhoneNumber = phoneNumber.replace(/\s/g, "");
    const lowerCaseGender = gender.toLowerCase();
    db.query(
      "INSERT INTO customers (f_name, l_name, gender, dob, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [fName, lName, lowerCaseGender, dob, cleanPhoneNumber, email, password],
      (err, results) => {
        if (err) {
          console.error("Error in createCustomer: ", err);
          reject(err);
        }
        resolve(`A new customer has been created with email ${email}.`);
      }
    );
  });
};

const getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM customers WHERE id = $1`, [id], (err, results) => {
      if (err) {
        console.error("Error in getCustomerById: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Customer with id ${id} not found.`));
      }
      resolve(results.rows);
    });
  });
};

const deleteCustomer = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM customers WHERE ID = $1", [id], (err, results) => {
      if (err) {
        console.error("Error in deleteCustomer: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Customer with id ${id} not found.`));
      }
      resolve(`Customer deleted with id ${id}.`);
    });
  });
};

const patchCustomer = (id, body) => {
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
      reject(new Error(`Customer with id ${id} not found.`));
    }

    const query = `UPDATE customers SET ${setClause.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error in patchCustomer: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Customer with id ${id} not found.`));
      }
      resolve(`Customer with id ${id} updated.`);
    });
  });
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomerById,
  deleteCustomer,
  patchCustomer,
};
