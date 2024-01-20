const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const { default: axios } = require("axios");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cnsel.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("todoList").collection("task");
    const userCollection = client.db("todoList").collection("users");
    app.get("/task", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    app.get("/info", async (req, res) => {
      // const ipAddress =  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const ipAddress = "202.84.35.56";
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const response = await axios.get(
        `https://ipinfo.io?token=${process.env.IPSTACK_API_KEY}`
      );
      const userData = {
        ip: response.data.ip,
        country: response.data.country,
        region: response.data.region,
        city: response.data.city,
        dateTime: formattedDate,
      };
      res.json(userData);
    });

    app.post("/task", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    app.get("/info", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    app.post("/info", async (req, res) => {
      const newTask = req.body;
      const result = await userCollection.insertOne(newTask);
      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const updateTask = req.body.data;
      const id = updateTask._id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          task: updateTask.task,
          time: updateTask.time,
          deadlineDate: updateTask.deadlineDate,
          status: updateTask.status,
          priviousStatus:updateTask.priviousStatus,
          markNotification:updateTask.markNotification,
          startTime: updateTask.startTime,
          remarks: updateTask.remarks,
          pinTask: updateTask.pinTask,
          taskPriority: updateTask.taskPriority,
          taskCompletionDate: updateTask.taskCompletionDate,
          taskSubmissionDate: updateTask.taskSubmissionDate,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/project", async (req, res) => {
      const updateTask = req.body;
      const id = updateTask._id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          task: updateTask.task,
          time: updateTask.time,
          deadlineDate: updateTask.deadlineDate,
          status: updateTask.status,
          priviousStatus:updateTask.priviousStatus,
          markNotification:updateTask.markNotification,
          startTime: updateTask.startTime,
          remarks: updateTask.remarks,
          pinTask: updateTask.pinTask,
          taskPriority: updateTask.taskPriority,
          taskCompletionDate: updateTask.taskCompletionDate,
          taskSubmissionDate: updateTask.taskSubmissionDate,
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/close/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "close",
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/open/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "open",
        },
      };
      const result = await taskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

  } finally {
  }
}

run().catch(console.dir);
app.use(cors({ origin: "" }));
app.get("/", (req, res) => {
  res.send("To Do server is running");
});

app.listen(port, () => {
  console.log("Todo server running");
});
