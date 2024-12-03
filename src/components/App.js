import React, { useState } from "react";

// Initial list of items
const initialItems = [
  { id: 1, description: "Shirt", quantity: 5, packed: false },
  { id: 2, description: "Pants", quantity: 2, packed: false },
];

// Logo Component
function Logo() {
  return <h1>My Travel List</h1>; // Displays the app's title
}

// Form Component for adding items
function Form({ onAddItem }) {
  const [itemDescription, setItemDescription] = useState(""); // State to store the item description
  const [quantity, setQuantity] = useState(1); // State to store the quantity

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemDescription.trim()) return; // Do nothing if description is empty

    // Create a new item
    const newItem = {
      id: Date.now(), // Unique ID based on current timestamp
      description: itemDescription,
      quantity,
      packed: false,
    };

    onAddItem(newItem); // Pass the new item to the parent component
    setItemDescription(""); // Reset the form fields
    setQuantity(1);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>
      {/* Dropdown to select quantity */}
      <select
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ padding: "5px", margin: "5px 0", display: "block" }}
      >
        {[1, 2, 3].map((qty) => (
          <option key={qty} value={qty}>
            {qty}
          </option>
        ))}
      </select>
      {/* Input for item description */}
      <input
        type="text"
        placeholder="Item..."
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        style={{ padding: "5px", margin: "5px 0", display: "block" }}
      />
      {/* Submit button */}
      <button type="submit" style={{ marginTop: "10px" }}>
        Add
      </button>
    </form>
  );
}

// Component to render the list of items
function PackingList({ items, onTogglePacked, onDeleteItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onTogglePacked={onTogglePacked}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

// Individual Item Component
function Item({ item, onTogglePacked, onDeleteItem }) {
  return (
    <li
      style={{ textDecoration: item.packed ? "line-through" : "none" }} // Strikethrough if packed
    >
      {/* Checkbox to toggle packed status */}
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onTogglePacked(item.id)}
        style={{ marginRight: "10px" }}
      />
      {item.description} ({item.quantity}) {/* Display item details */}
      {/* Delete button */}
      <button
        onClick={() => onDeleteItem(item.id)}
        style={{
          marginLeft: "10px",
          cursor: "pointer",
          color: "red",
          background: "none",
          border: "none",
        }}
      >
        Delete
      </button>
    </li>
  );
}

// Stats Component to show packing statistics
function Stats({ items }) {
  const totalItems = items.length; // Total number of items
  const packedItems = items.filter((item) => item.packed).length; // Number of packed items
  const packedPercentage = totalItems
    ? Math.round((packedItems / totalItems) * 100)
    : 0; // Calculate percentage of packed items

  return (
    <footer className="stats">
      {/* Display appropriate message based on packing status */}
      {packedPercentage === 100 && totalItems > 0 ? (
        <em>You got everything!</em>
      ) : (
        <em>
          You have {totalItems} items in the list. You already packed {packedItems} (
          {packedPercentage}%).
        </em>
      )}
    </footer>
  );
}

// Main App Component
function App() {
  const [items, setItems] = useState(initialItems); // State to store the list of items
  const [sortBy, setSortBy] = useState("inputOrder"); // State for sorting method

  // Add a new item to the list
  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  // Toggle the packed status of an item
  const handleTogglePacked = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  // Delete an item from the list
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Clear all items
  const handleClearItems = () => {
    if (window.confirm("Are you sure you want to clear all items?")) {
      setItems([]);
    }
  };

  // Sort the items based on the selected method
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "description") {
      return a.description.localeCompare(b.description); // Alphabetical sort by description
    } else if (sortBy === "packed") {
      return a.packed - b.packed; // Sort by packed status
    }
    return 0; // Default order (input order)
  });

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      {/* Packing List rendered after the form */}
      <PackingList
        items={sortedItems}
        onTogglePacked={handleTogglePacked}
        onDeleteItem={handleDeleteItem}
      />
      <div>
        {/* Sorting controls */}
        <label>Sort by: </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ margin: "10px 0" }}
        >
          <option value="inputOrder">Input Order</option>
          <option value="description">Description</option>
          <option value="packed">Packed Status</option>
        </select>
        {/* Clear All button */}
        <button
          onClick={handleClearItems}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Clear All
        </button>
      </div>
      <Stats items={items} /> {/* Packing stats at the bottom */}
    </div>
  );
}

export default App;
