import { validationResult } from 'express-validator';

export default (req, res, next) => {
  console.log('1', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
