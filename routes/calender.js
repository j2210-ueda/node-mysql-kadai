const express = require('express');
const router = express.Router();

function getCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const weeks = [];
  let week = new Array(7).fill('');
  let day = 1;

  for (let i = firstDay.getDay(); day <= lastDay.getDate(); i++) {
    week[i] = day++;
    if (i === 6 || day > lastDay.getDate()) {
      weeks.push(week);
      week = new Array(7).fill('');
      i = -1;
    }
  }
  return weeks;
}

router.get('/', (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const weeks = getCalendar(year, month);
  res.render('calendar', { weeks });
});

module.exports = router;