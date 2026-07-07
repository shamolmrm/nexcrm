const express = require('express');
const { Email } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const emails = await Email.find({ user: req.user._id }).sort({ date: -1 });
  res.json(emails);
});

router.put('/:id/read', async (req, res) => {
  const email = await Email.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!email) {
    return res.status(404).json({ message: 'Email not found' });
  }
  res.json(email);
});

module.exports = router;
