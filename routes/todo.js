const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

// 認証チェック用ミドルウェア
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
}

// TODOリスト表示
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('req.user:', req.user); // デバッグ用
    const userId = req.user.id;
    const tasks = await knex('tasks').where({ user_id: userId });
    res.render('todo', {
      title: 'My TODO List',
      tasks: tasks,
      user: req.user,
    });
  } catch (err) {
    console.error(err); // エラー内容を表示
    res.status(500).send('Error loading tasks');
  }
});

// TODO追加（例）
router.post('/add', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    if (content && content.trim()) {
      await knex('tasks').insert({ user_id: userId, content });
    }
    res.redirect('/todo');
  } catch (err) {
    res.status(500).send('Error adding task');
  }
});

//タスク削除
router.post('/done/:id', async (req, res) => {
  const id = req.params.id;
  await knex('tasks').where({ id }).update({ done: true });
  res.redirect('/todo');
});

module.exports = router;