const cards = [
  {
    cardId: 1,
    cardTitle: 'card1',
    cardDescription: 'cardDescription1',
    listTitle: 'checkList1',
    cardList: [
      {
        order: 1,
        description: 'el.value11',
        checking: false,
      },
      {
        order: 2,
        description: 'el.value12',
        checking: true,
      },
    ],
  },
];

export const getCards = async () => cards;

export const newCard = async ({
  cardId,
  cardTitle,
  cardDescription,
  listTitle,
  cardList,
}) => {
  cards.push({ cardId, cardTitle, cardDescription, listTitle, cardList });
  return true;
};

export const removeCard = async (neededId) => {
  const indexCard = cards.findIndex((item) => item.cardId == neededId);
  cards.splice(indexCard, 1);
  return true;
};

export const updateCard = async (
  neededId,
  { cardId, cardTitle, cardDescription, listTitle, cardList }
) => {
  const indexCard = cards.findIndex((item) => item.cardId == neededId);
  cards.splice(indexCard, 1, {
    cardId,
    cardTitle,
    cardDescription,
    listTitle,
    cardList,
  });
  return true;
};

export default { getCards, newCard, removeCard, updateCard };
