import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [merchants, setMerchants] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getMerchants();
  }, []);

  const getMerchants = async () => {
    try {
      const response = await axios.get("http://localhost:3001/");
      setMerchants(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createMerchant = async () => {
    try {
      const response = await axios.post("http://localhost:3001/", {
        name: name,
        email: email,
      });
      console.log(response);
      getMerchants();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMerchant = async () => {};

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.nativeEvent.submitter.name === "create") {
      createMerchant();
    } else if (event.nativeEvent.submitter.name === "delete") {
      deleteMerchant();
    }
  };

  return (
    <div>
      {merchants ? (
        merchants.map((merchant, index) => {
          return <p key={index}>{merchant.name}</p>;
        })
      ) : (
        <p>There is no merchant data available</p>
      )}

      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" name="create">
          Create
        </button>
        <button type="submit" name="delete">
          Delete
        </button>
      </form>
    </div>
  );
}

export default App;
