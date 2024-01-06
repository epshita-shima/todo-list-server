const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://db_todo:NWSfmeG4paEnVH8X@cluster0.cnsel.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todoList").collection("task");

        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const data = await cursor.toArray()
            res.send(data);
        })
        // app.get('/task/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const completeTask = await taskCollection.findOne(query);
        //     res.send(completeTask);
        // })
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            console.log("addning new info", newTask);
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })
        app.put('/task/:id', async (req, res) => {
            const updateTask = req.body.data;
            console.log(updateTask,'check')
            const id=updateTask._id;
            console.log(id)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    task: updateTask.task,
                    time: updateTask.time,
                    deadlineDate: updateTask.deadlineDate,
                    status:updateTask.status,
                    startTime:updateTask.startTime,
                    remarks:updateTask.remarks,
                    taskPriority:updateTask.taskPriority
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.put('/', async (req, res) => {
            const updateTask = req.body;
            console.log(updateTask)
            console.log(updateTask._id)
            const id = updateTask._id;
            console.log(id)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    task: updateTask.task,
                    time: updateTask.time,
                    deadlineDate: updateTask.deadlineDate,
                    status:updateTask.status,
                    startTime:updateTask.startTime,
                    remarks:updateTask.remarks,
                    taskPriority:updateTask.taskPriority
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.put('/close/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id:new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'close'
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.put('/open/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id:new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'open'
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);
app.use(cors({ origin: "" }))
app.get('/', (req, res) => {
    res.send('To Do server is running');
})

app.listen(port, () => {
    console.log('Todo server running');
})