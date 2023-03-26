import express from 'express';
import bodyParser from 'body-parser';

import {
  registerValidation,
  loginValidation,
  cardCreateValidation,
} from './validatoins.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { CardController } from './controllers/index.js';

const app = express();
app.use(bodyParser.json());

app.get('/cards', CardController.getAll);
app.get('/cards/:id', CardController.getOne);
app.post(
  '/cards',
  cardCreateValidation,
  handleValidationErrors,
  CardController.create
);
app.delete('/cards/:id', CardController.remove);
app.patch(
  '/cards/:id',
  cardCreateValidation,
  handleValidationErrors,
  CardController.update
);

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK');
});
