const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // To serve index.html

mongoose.connect('mongodb://localhost:27017/personalInfoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const personSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
   
  });
  
  

const Person = mongoose.model('Person', personSchema);

// CRUD Routes
app.get('/api/people', async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

app.post('/api/people', async (req, res) => {
  const person = new Person(req.body);
  await person.save();
  res.json(person);
});

app.put('/api/people/:id', async (req, res) => {
  await Person.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Updated' });
});

app.delete('/api/people/:id', async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));