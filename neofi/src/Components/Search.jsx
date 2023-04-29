import React, { useState, useEffect } from "react";

const data = [
  { symbol: "AAPL", price: 135.5 },
  { symbol: "GOOG", price: 2345.67 },
  { symbol: "AMZN", price: 3215.43 },
  { symbol: "MSFT", price: 255.34 },
];

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const regex = new RegExp(searchTerm, "g");
    const newFilteredData = data.filter((obj) =>
      regex.test(obj.symbol.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchTerm]);

  const debouncedSetSearchTerm = debounce(setSearchTerm, 500);

  function handleInputChange(event) {
    debouncedSetSearchTerm(event.target.value.trim().toLowerCase());
  }

  const resultsHtml = filteredData.map((obj) => (
    <li key={obj.symbol}>
      {obj.symbol}: {obj.price}
    </li>
  ));

  return (
    <div>
      <input type="text" onChange={handleInputChange} />
      <ul>{resultsHtml}</ul>
    </div>
  );
}

export default Search;
