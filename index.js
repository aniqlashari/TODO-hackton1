const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://mahaqamber3:aniq1020@cluster0.sbmat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((data)=>{
  console.log("mongodb has connected")
}).catch((err)=>{
  console.log("mongodb disconnnected"+err)
})

// ✅ Create schema and model
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Task = mongoose.model('Task', TaskSchema);

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes

// Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create new task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Update task by ID
app.put('/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedTask);
});

// Delete task by ID
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ✅ Start server
app.listen(3001, () => {
  console.log('🚀 Server is running on http://localhost:3001');
});

mongoose.connect('mongodb+srv://mahaqamber3:aniq1020@cluster0.sbmat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((data)=>{
  console.log('mongodb save')
})

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

app.use(cors());
app.use(express.json());

// Get single user (for profile)
app.get('/user', async (req, res) => {
  const user = await User.findOne(); // just one user
  res.json(user);
});

// Update user profile
app.put('/user', async (req, res) => {
  const user = await User.findOne();
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    return res.json(user);
  } else {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
  }
});

app.listen(3001, () => {
  console.log('🚀 Server running at http://localhost:3001');
});
