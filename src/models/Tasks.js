const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  task: [
    {
      name: String,
      status: Boolean,
    },
  ],
  name: String,
});
const Task = mongoose.model("Task", taskSchema);
module.exports = { Task };
