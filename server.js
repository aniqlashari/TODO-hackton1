const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
require('dotenv').config()
// const User = require("./models/User")

mongoose.connect('mongodb+srv://mahaqamber3:aniq1020@cluster0.sbmat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((data) => {
  console.log('mongodb save')
})
const app = express()
app.use(cors())
app.use(bodyParser.json())

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

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Task = mongoose.model('Task', TaskSchema);
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

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, age, password, image } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ name, email, age, password: hashedPassword, image })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', message: err.message })
  }
})

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    res.status(200).json({ message: 'Login successful', user })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
