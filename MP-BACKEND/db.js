import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();

const config = {
  host: process.env['DB_HOST'],
  port: process.env['DB_PORT'],
  database: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
};

const pool = new Pool(config);

export const getCards = async () => {
  const sql = `SELECT * FROM table_cards`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const newCard = async ({
  cardId,
  cardTitle,
  cardDescription,
  listTitle,
  cardList,
  columnDbId,
}) => {
  const params = [
    cardId,
    cardTitle,
    cardDescription,
    listTitle,
    JSON.stringify(cardList),
    columnDbId,
  ];
  const sql = `INSERT INTO table_cards (cardId, cardTitle, cardDescription, listTitle, cardList, columnDbId )
  VALUES ($1, $2, $3, $4, $5, $6);`;
  await pool.query(sql, params);
  return true;
};

export const removeCard = async (neededId) => {
  const sql = `DELETE FROM table_cards tc 
  WHERE cardId = ${neededId}`;
  await pool.query(sql);
  return true;
};

export const updateCard = async ({ neededId, ...fields }) => {
  const params = [];
  const sql = `UPDATE table_cards tc 
  SET ${Object.entries(fields)
    .map(([k, v]) =>
      k == 'cardList'
        ? `${k} = $${params.push(JSON.stringify(v))}`
        : `${k} = $${params.push(v)}`
    )
    .join(',')}
  WHERE cardid = ${neededId};`;
  await pool.query(sql, params);
  return true;
};

export default { getCards, newCard, removeCard, updateCard };
