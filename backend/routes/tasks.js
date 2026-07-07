const express = require('express');
const { Task } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, relatedTo, dueDate, priority, status } = req.body;
  const task = new Task({ user: req.user._id, title, relatedTo, dueDate, priority, status });
  await task.save();
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json({ message: 'Task deleted' });
});

module.exports = router;
