const db = require("../db");
const { camelToSnakeCase } = require("../utils/case-conversion");

const getCustomerAddresses = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM customer_addresses", (err, results) => {
      if (err) {
        console.error("Error in getCustomerAddresses: ", err);
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createCustomerAddress = (body) => {
  return new Promise((resolve, reject) => {
    const { customerId, address1, address2, city, country, postCode } = body;
    const cleanPostCode = postCode.replace(/\s/g, "");
    db.query(
      "INSERT INTO customer_addresses (customer_id, address_1, address_2, city, country, post_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [customerId, address1, address2, city, country, cleanPostCode],
      (err, results) => {
        if (err) {
          console.error("Error in createCustomerAddress: ", err);
          reject(err);
        }
        resolve(
          `A new customer address has been created for customer with id ${customerId}.`
        );
      }
    );
  });
};

const getCustomerAddressById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM customer_addresses WHERE id = $1`,
      [id],
      (err, results) => {
        if (err) {
          console.error("Error in getCustomerAddressById: ", err);
          reject(err);
        } else if (results.rowCount === 0) {
          reject(new Error(`Customer with id ${id} not found.`));
        }
        resolve(results.rows);
      }
    );
  });
};

const deleteCustomerAddress = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM customer_addresses WHERE ID = $1",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error in deleteCustomerAddress: ", err);
          reject(err);
        } else if (results.rowCount === 0) {
          reject(new Error(`Customer with id ${id} not found.`));
        }
        resolve(`Customer deleted with id ${id}.`);
      }
    );
  });
};

const patchCustomerAddress = (id, body) => {
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

    const query = `UPDATE customer_addresses SET ${setClause.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error in patchCustomerAddress: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Customer with id ${id} not found.`));
      }
      resolve(`Customer with id ${id} updated.`);
    });
  });
};

module.exports = {
  getCustomerAddresses,
  createCustomerAddress,
  getCustomerAddressById,
  deleteCustomerAddress,
  patchCustomerAddress,
};
