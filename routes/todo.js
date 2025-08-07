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
    const { content, deadline } = req.body;
    if (content && content.trim() && deadline) {
      await knex('tasks').insert({ user_id: userId, content, deadline });
    }
    res.redirect('/todo');
  } catch (err) {
    res.status(500).send('Error adding task');
  }
});
// ...existing code...

//タスク完了
router.post('/done/:id', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  await knex('tasks')
    .where({ id, user_id: userId })
    .update({ done: true, done_at: knex.fn.now() });
  res.redirect('/todo');
});

//タスク削除
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    // 自分のタスクのみ削除
    await knex('tasks').where({ id, user_id: userId, done: true }).del();
    res.redirect('/todo');
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

module.exports = router;