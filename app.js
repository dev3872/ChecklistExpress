const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TaskModel = require("./src/models/Tasks").Task;
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected"))
  .catch((reason) => console.error(reason));

// test api
app.get("/:name", async (req, res) => {
  try {
    const userName = req.params.name;
    const task = await TaskModel.findOne({
      name: userName,
    });
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const taskDoc = req.body;
    const newtask = await TaskModel.create({
      task: taskDoc.task,
      name: taskDoc.name,
    });
    res.status(200).send(newtask);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.post("/:docName", async (req, res) => {
  try {
    const docname = req.params.docName;
    const taskDoc = req.body;
    const newtask = await TaskModel.findOneAndUpdate(
      { name: docname },
      {
        $push: {
          task: { name: taskDoc.name, status: false },
        },
      }
    );
    res.status(200).send(newtask);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.put("/task/:taskId", async (req, res) => {
  try {
    const id = req.params;
    const updateTask = await TaskModel.findOneAndUpdate(
      {
        "task._id": id.taskId,
      },
      {
        "task.$.name": req.body.name,
        "task.$.status": req.body.status,
      }
    );
    res.send(updateTask);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.delete("/task/:taskId", async (req, res) => {
  try {
    const id = req.params;
    const deletedTask = await TaskModel.findOneAndUpdate(
      {
        "task._id": id.taskId,
      },
      {
        $pull: {
          task: {
            _id: id.taskId,
          },
        },
      }
    );
    res.status(200).send(deletedTask);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.listen(4000, (_, err) => {
  if (!err) {
    console.log("server running on port 4000");
  }
});
