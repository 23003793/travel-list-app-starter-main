import React, { useState } from "react";

// Initial items in the packing list
const initialItems = [
  { id: 1, description: "Shirt", quantity: 5, packed: false },
  { id: 2, description: "Pants", quantity: 2, packed: false },
];

// Logo Component: Displays the title of the app
function Logo() {
  return <h1>My Travel List</h1>;
}

// Form Component: Handles adding new items to the list
function Form({ onAddItem }) {
  // State to manage item description input
  const [itemDescription, setItemDescription] = useState("");
  // State to manage quantity input
  const [quantity, setQuantity] = useState(1);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Check if the description is empty
    if (!itemDescription.trim()) return;

    // Create a new item object with user input
    const newItem = {
      id: Date.now(), // Generate a unique ID using the current timestamp
      description: itemDescription, // User-entered item description
      quantity: quantity, // User-selected quantity
      packed: false, // Default value for new items
    };

    // Add the new item to the parent component's state
    onAddItem(newItem);

    // Reset the input fields to default values
    setItemDescription(""); // Clear the description field
    setQuantity(1); // Reset the quantity to 1
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>

      {/* Dropdown to select item quantity */}
      <label htmlFor="quantity"></label>
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

      {/* Input field for item description */}
      <input
        type="text"
        placeholder="Item..."
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        style={{ padding: "5px", margin: "5px 0", display: "block" }}
      />

      {/* Button to submit the form */}
      <button type="submit" style={{ marginTop: "10px" }}>
        Add
      </button>
    </form>
  );
}

// PackingList Component: Displays all items in the list
function PackingList({ items, onTogglePacked, onDeleteItem }) {
  return (
    <div className="list">
      <ul>
        {/* Map over the items and render an Item component for each */}
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

// Item Component: Represents a single item in the packing list
function Item({ item, onTogglePacked, onDeleteItem }) {
  return (
    <li
      style={{ textDecoration: item.packed ? "line-through" : "none" }} // Strike-through if packed
    >
      {/* Checkbox to toggle packed status */}
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onTogglePacked(item.id)}
        style={{ marginRight: "10px" }}
      />
      {/* Display item description and quantity */}
      {item.description} ({item.quantity})
      {/* Button to delete the item */}
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

// Stats Component: Displays statistics about the packing list
function Stats({ items }) {
  // Total number of items
  const totalItems = items.length;
  // Number of packed items
  const packedItems = items.filter((item) => item.packed).length;
  // Percentage of items packed (rounded)
  const packedPercentage = totalItems
    ? Math.round((packedItems / totalItems) * 100)
    : 0;

  return (
    <footer className="stats">
      <em>
        You have {totalItems} items in the list. You already packed {packedItems}{" "}
        ({packedPercentage}%).
      </em>
    </footer>
  );
}

// Main App Component: Combines all components and manages state
function App() {
  // Responsible for supplying data to the child component
  // State to manage the list of items
  const [items, setItems] = useState(initialItems);

  // Function to add a new item to the list
  const handleAddItem = (newItem) => {
    setItems([...items, newItem]); // Add the new item to the existing list
  };

  // Function to toggle the packed status of an item
  const handleTogglePacked = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  // Function to delete an item from the list
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id)); // Remove the item with the specified ID
  };

  return (
    <div className="app">
      {/* Render the Logo, Form, PackingList, and Stats components */}
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList
        items={items}
        onTogglePacked={handleTogglePacked}
        onDeleteItem={handleDeleteItem}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
