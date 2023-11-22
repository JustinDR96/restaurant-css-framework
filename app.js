const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Importer le module "path"
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/")));

mongoose.connect(
  "mongodb+srv://justin_2:123456789.96@cluster0.apidfb6.mongodb.net/?retryWrites=true&w=majority"
);

const messageSchema = new mongoose.Schema({
  last_name: String,
  first_name: String,
  email: String,
  subject: String,
  message: String,
});

const Message = mongoose.model("Message", messageSchema);
app.get("/restaurant-css-framework/style.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
});

app.get("/admin/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.render("admin/messages", { messages });
  } catch (error) {
    console.error(error);
    res.send("Error fetching messages.");
  }
});

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.delete("/admin/messages/:id", async (req, res) => {
  const messageId = req.params.id;
  try {
    await Message.findByIdAndDelete(messageId);
    res.redirect("/admin/messages");
  } catch (error) {
    console.error(error);
    res.send("Error deleting message.");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/")); // Utilisez path.join pour définir le chemin correct
});

app.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/contact.html")); // Utilisez path.join pour définir le chemin correct
});

app.post("/submit", async (req, res) => {
  const { last_name, first_name, email, subject, message } = req.body;

  try {
    await Message.create({ first_name, last_name, email, subject, message });
  } catch (error) {
    console.error(error);
    res.send("Error submitting message.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
