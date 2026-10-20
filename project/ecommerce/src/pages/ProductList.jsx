import React, { useState } from "react";
import products from "./p";
import { aiSearch } from "./aiSearch";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filtered, setFiltered] = useState(products);
  const [loading, setLoading] = useState(false);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const handleFilter = () => {
    const filteredProducts = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
    setFiltered(filteredProducts);
  };

  const handleAISearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    const ids = await aiSearch(search);
    setFiltered(products.filter((p) => ids.includes(p.id)));
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛒 E-commerce Product Catalog</h1>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Type your search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px", flex: 1 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "5px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button onClick={handleFilter} style={{ padding: "5px 10px" }}>
          Filter
        </button>

        <button onClick={handleAISearch} style={{ padding: "5px 10px" }}>
          AI Search
        </button>
      </div>

      {loading && <p>Searching with AI...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <div key={p.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
              <h3>{p.name}</h3>
              <p>💲{p.price}</p>
              <p><b>Category:</b> {p.category}</p>
              <p>{p.description}</p>
              <p>⭐ {p.rating}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
