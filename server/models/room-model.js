const db = require("../db");
const { camelToSnakeCase } = require("../utils/case-conversion");

const getRooms = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM rooms", (err, results) => {
      if (err) {
        console.error("Error in getRooms: ", err);
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createRoom = (body) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      description,
      noOfSingleBeds,
      noOfDoubleBeds,
      floor,
      isEnsuite,
      hasCoffin,
    } = body;
    db.query(
      "INSERT INTO rooms (name, description, no_of_single_beds, no_of_double_beds, floor, is_ensuite, has_coffin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        description,
        noOfSingleBeds,
        noOfDoubleBeds,
        floor,
        isEnsuite,
        hasCoffin,
      ],
      (err, results) => {
        if (err) {
          console.error("Error in createRoom: ", err);
          reject(err);
        }
        resolve(`A new room has been created with name ${name}.`);
      }
    );
  });
};

const getRoomById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM rooms WHERE id = $1`, [id], (err, results) => {
      if (err) {
        console.error("Error in getRoomById: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Room with id ${id} not found.`));
      }
      resolve(results.rows);
    });
  });
};

const deleteRoom = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM rooms WHERE ID = $1", [id], (err, results) => {
      if (err) {
        console.error("Error in deleteRoom: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Room with id ${id} not found.`));
      }
      resolve(`Room deleted with id ${id}.`);
    });
  });
};

const patchRoom = (id, body) => {
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
      reject(new Error(`Room with id ${id} not found.`));
    }

    const query = `UPDATE rooms SET ${setClause.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error in patchRoom: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Room with id ${id} not found.`));
      }
      resolve(`Room with id ${id} updated.`);
    });
  });
};

module.exports = {
  getRooms,
  createRoom,
  getRoomById,
  deleteRoom,
  patchRoom,
};
