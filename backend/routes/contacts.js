const express = require('express');
const { Contact } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const contacts = await Contact.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(contacts);
});

router.post('/', async (req, res) => {
  const { name, company, email, phone, status, value } = req.body;
  const contact = new Contact({ user: req.user._id, name, company, email, phone, status, value });
  await contact.save();
  res.status(201).json(contact);
});

router.put('/:id', async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(contact);
});

router.delete('/:id', async (req, res) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json({ message: 'Contact deleted' });
});

module.exports = router;
