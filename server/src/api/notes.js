const express = require('express');

const router = express.Router();
const joi = require('joi');
const db = require('../db/connection');

const notes = db.get('notes');

const schema = joi.object().keys({
  title: joi.string().min(2).max(30).required(),
  note: joi.string().required(),
});

router.get('/', (req, res, next) => {
  notes.find({
    user_id: req.user._id,
  }).then((result) => {
    res.json(result);
  }).catch(next);
});

router.post('/', (req, res, next) => {
  const result = joi.validate(req.body, schema);
  if (result.error === null) {
    const note = {
      body: req.body,
      user_id: req.user._id,
    };
    notes.insert(note).then((createdNote) => {
      res.json(createdNote);
    });
  } else {
    const error = new Error(result.error);
    res.status(422);
    next(error);
  }
});

module.exports = router;
