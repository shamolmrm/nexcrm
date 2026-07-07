const express = require('express');
const { Deal, Contact } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/summary', async (req, res) => {
  const contacts = await Contact.countDocuments({ user: req.user._id });
  const deals = await Deal.find({ user: req.user._id });
  const wonDeals = deals.filter((deal) => deal.status === 'won');
  const totalRevenue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const winRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  res.json({
    revenue: totalRevenue,
    contacts,
    deals: deals.length,
    winRate,
  });
});

router.get('/pipeline', async (req, res) => {
  const pipeline = await Deal.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
      },
    },
  ]);

  res.json(pipeline.map((item) => ({ stage: item._id, count: item.count, totalValue: item.totalValue })));
});

router.get('/monthly', async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthly = await Deal.aggregate([
    { $match: { user: req.user._id, closeDate: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$closeDate' }, month: { $month: '$closeDate' } },
        revenue: { $sum: '$value' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json(monthly.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    revenue: item.revenue,
  })));
});

module.exports = router;
