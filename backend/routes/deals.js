const express = require('express');
const { Deal, Contact } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const deals = await Deal.find({ user: req.user._id }).populate('contact').sort({ createdAt: -1 });
  res.json(deals);
});

router.post('/', async (req, res) => {
  const { name, contact, stage, status, value, closeDate } = req.body;
  const deal = new Deal({
    user: req.user._id,
    name,
    contact,
    stage,
    status,
    value,
    closeDate,
  });
  await deal.save();
  await deal.populate('contact');
  res.status(201).json(deal);
});

router.put('/:id', async (req, res) => {
  const deal = await Deal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  ).populate('contact');

  if (!deal) {
    return res.status(404).json({ message: 'Deal not found' });
  }
  res.json(deal);
});

router.delete('/:id', async (req, res) => {
  const deal = await Deal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deal) {
    return res.status(404).json({ message: 'Deal not found' });
  }
  res.json({ message: 'Deal deleted' });
});

module.exports = router;
