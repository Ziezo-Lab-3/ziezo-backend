const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/handyman', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const workSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
});

const Work = mongoose.model('Work', workSchema);

app.get('/works', async (req, res) => {
  const works = await Work.find();
  res.json(works);
});

app.post('/works', async (req, res) => {
  const work = new Work(req.body);
  const savedWork = await work.save();
  res.json(savedWork);
});

app.listen(3000, () => console.log('Server started on port 3000'));