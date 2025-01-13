const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String },
});

// Create and export the Student model
const students = mongoose.model("students", studentSchema);
module.exports = students;
