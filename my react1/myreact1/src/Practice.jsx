import React, { useState } from "react";
import axios from "axios";
import "./Practice.css"

function Practice() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resData,setResData] = useState([]);

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3400/chat", {
        query,
      });
      const newEntry = {
      question: query,
      answer: response.data.message,
    };
    setResData((prev) => [...prev, newEntry]);
      setData(response.data.message);
      setQuery("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
   <div className="container">
     <div className="hello">
      <div className="message">
{error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        {resData.map((entry, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div className="query"><p className="queryName">{entry.question}</p></div>
            <div className="response"><p className="responseName">{entry.answer}</p></div>
            <hr />
          </div>
        ))}
      </div>
      </div>
      <div className="inputfield">
        <input
        value={query}
        placeholder="Enter your query"
        onChange={(e) => setQuery(e.target.value)}
        className="inputs"
      />
      <button onClick={getData} disabled={!query || loading} className="button">
        {loading ? "Loading..." : "Send"}
      </button>
      </div>
    </div>
   </div>
   </>
  );
}

export default Practice;
