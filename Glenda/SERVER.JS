const express = require("express");
const fs = require("fs");
const app = express();

// Load contact data from the JSON file
let contact = require("./contact.json");

// Middleware to parse JSON bodies
app.use(express.json());

// Helper function to save data back to contact.json
function saveContacts() {
  fs.writeFileSync("./contact.json", JSON.stringify(contact, null, 2));
}

// READ all contacts
app.get("/api/contact", (req, res) => {
  res.json(contact);
});

// CREATE a new contact
app.post("/api/contact", (req, res) => {
  const newContact = req.body;
  newContact.id = Date.now(); // simple unique ID using timestamp
  contact.push(newContact);
  saveContacts(); // save to file
  res.status(201).json(newContact);
});

// UPDATE a contact by ID
app.put("/api/contact/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = contact.findIndex((c) => c.id === id);

  if (index !== -1) {
    contact[index] = { ...contact[index], ...req.body };
    saveContacts(); // save changes
    res.json(contact[index]);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

// DELETE a contact by ID
app.delete("/api/contact/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = contact.findIndex((c) => c.id === id);

  if (index !== -1) {
    const deleted = contact.splice(index, 1);
    saveContacts(); // save changes
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
