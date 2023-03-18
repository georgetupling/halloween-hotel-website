const db = require("../db");
const { camelToSnakeCase } = require("../utils/case-conversion");

const getRoomBookings = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM room_bookings", (err, results) => {
      if (err) {
        console.error("Error in getRoomBookings: ", err);
        reject(err);
      }
      resolve(results.rows);
    });
  });
};

const createRoomBooking = (body) => {
  return new Promise((resolve, reject) => {
    const { roomId, transactionId, startDate, endDate, amount_due } = body;
    db.query(
      "INSERT INTO room_bookings (room_id, transaction_id, startDate, endDate, amount_due) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [roomId, transactionId, startDate, endDate, amount_due],
      (err, results) => {
        if (err) {
          console.error("Error in createRoomBooking: ", err);
          reject(err);
        }
        resolve(
          `A new room booking has been created for room with id ${roomId}.`
        );
      }
    );
  });
};

const getRoomBookingById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM room_bookings WHERE id = $1`,
      [id],
      (err, results) => {
        if (err) {
          console.error("Error in getRoomBookingById: ", err);
          reject(err);
        } else if (results.rowCount === 0) {
          reject(new Error(`Room booking with id ${id} not found.`));
        }
        resolve(results.rows);
      }
    );
  });
};

const deleteRoomBooking = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM room_bookings WHERE ID = $1",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error in deleteRoomBooking: ", err);
          reject(err);
        } else if (results.rowCount === 0) {
          reject(new Error(`Room booking with id ${id} not found.`));
        }
        resolve(`Room booking deleted with id ${id}.`);
      }
    );
  });
};

const patchRoomBooking = (id, body) => {
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
      reject(new Error(`Room booking with id ${id} not found.`));
    }

    const query = `UPDATE room_bookings SET ${setClause.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error in patchRoomBooking: ", err);
        reject(err);
      } else if (results.rowCount === 0) {
        reject(new Error(`Room booking with id ${id} not found.`));
      }
      resolve(`Room booking with id ${id} updated.`);
    });
  });
};

module.exports = {
  getRoomBookings,
  createRoomBooking,
  getRoomBookingById,
  deleteRoomBooking,
  patchRoomBooking,
};
