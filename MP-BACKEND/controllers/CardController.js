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
    const { cardId, cardTitle, cardDescription, listTitle, cardList } =
      req.body;

    const result = await db.newCard({
      cardId,
      cardTitle,
      cardDescription,
      listTitle,
      cardList,
    });

    res.json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать карточку',
    });
  }
};

export const update = async (req, res) => {
  try {
    const neededId = req.params.id;
    const { cardId, cardTitle, cardDescription, listTitle, cardList } =
      req.body;

    const card = (await db.getCards()).find((item) => item.cardId == neededId);

    if (!card) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    } else {
      const result = await db.updateCard(neededId, {
        cardId,
        cardTitle,
        cardDescription,
        listTitle,
        cardList,
      });
      res.json({ result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось обновить карточку',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const neededId = req.params.id;

    const card = (await db.getCards()).find((item) => item.cardId == neededId);

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
