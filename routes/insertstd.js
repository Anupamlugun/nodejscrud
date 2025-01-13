const express = require("express");
const students = require("../models/studentModel");
const router = express.Router();

// Route to getting  student
router.get("/stdload", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  students
    .find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .then((result) => res.json(result))
    .catch(() => res.json({ error: "cannot get details" }));
});

//inserting students
router.post("/insertstd", (req, res) => {
  const std_obj = new students({
    name: req.body.name,
    age: req.body.age,
    course: req.body.course,
  });
  std_obj
    .save()
    .then(() => res.json({ message: "User saved" }))
    .catch(() => res.json({ error: "Cant save" }));
});

//updating students
router.put("/updatestd", (req, res) => {
  const { id, name, age, course } = req.body;

  // Validate required fields
  if (!id || !name || !age || !course) {
    return res.status(400).json({ error: "All fields are required" });
  }

  students
    .findByIdAndUpdate(id, { name, age, course }, { new: true })
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
      res
        .status(200)
        .json({ message: "Student updated", student: updatedStudent });
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Cannot update student", details: error.message })
    );
});

//delete student
// Delete student
router.delete("/stddelete", (req, res) => {
  students
    .findByIdAndDelete(req.body.id) // Use req.body.id to find and delete the student
    .then(() => res.json({ message: "Student deleted successfully" }))
    .catch((error) =>
      res
        .status(400)
        .json({ error: "Cannot delete student", message: error.message })
    );
});

module.exports = router;
