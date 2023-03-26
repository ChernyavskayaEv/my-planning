import db from '../db.js';

export const getAll = async (req, res) => {
  try {
    const cards = await db.getCards();
    res.json(cards);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить карточки',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const neededId = req.params.id;

    const card = (await db.getCards()).find((item) => item.cardId == neededId);

    if (!card) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    }

    res.json(card);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить карточку',
    });
  }
};

export const create = async (req, res) => {
  try {
    const {
      cardId,
      cardTitle,
      cardDescription,
      listTitle,
      cardList,
      columnDbId,
    } = req.body;

    const result = await db.newCard({
      cardId,
      cardTitle,
      cardDescription,
      listTitle,
      cardList,
      columnDbId,
    });

    res.json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать карточку',
    });
  }
};

export const update = async (req, res) => {
  try {
    const neededId = req.params.id;

    const card = (await db.getCards()).find((item) => item.cardid == neededId);

    if (!card) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    } else {
      const result = await db.updateCard({ neededId, ...req.body });
      res.json({ result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить карточку',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const neededId = req.params.id;

    const card = (await db.getCards()).find((item) => item.cardid == neededId);

    if (!card) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    } else {
      const result = await db.removeCard(neededId);
      res.json({ result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить карточку',
    });
  }
};
