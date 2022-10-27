//drag-n-drop card
const cards = document.querySelectorAll('.card');
const placeholders = document.querySelectorAll('.placeholder');

for (const card of cards) {
  card.addEventListener('dragstart', dragstart);
  card.addEventListener('dragend', dragend);
}

function dragstart(event) {
  event.target.classList.add('hold');
  setTimeout(() => event.target.classList.add('hide'), 0);
}

function dragend(event) {
  event.target.className = 'card';
}

for (const placeholder of placeholders) {
  placeholder.addEventListener('dragover', dragover);
  placeholder.addEventListener('dragenter', dragenter);
  placeholder.addEventListener('dragleave', dragleave);
  placeholder.addEventListener('drop', dragdrop);
}

function dragover(event) {
  event.preventDefault();
}

function dragenter(event) {
  event.target.classList.add('hovered');
}

function dragleave(event) {
  event.target.classList.remove('hovered');
}

function dragdrop(event) {
  event.target.classList.remove('hovered');
  const card = document.querySelector('.hold');
  if (event.target.classList.contains('card')) {
    event.target.parentElement.append(card);
  } else {
    event.target.append(card);
  }
}

//work with card in modal window
const boardBox = document.querySelector('.board-box');
const addDescription = document.querySelector('.add-description');
const cardDescription = document.querySelector('.card-description');
const addList = document.querySelector('.add-list');
const cardList = document.querySelector('.card-list');
const addListItem = document.querySelector('.add-list-item');
const closeIcon = document.querySelector('.close-icon');
const savebutton = document.querySelector('.save-button');
const clarificationBlock = document.querySelector('.clarification-block');

// document.addEventListener('keyup', (event) => {
//   console.log(event.code);
//   if (event.code === 'Escape') {
//     closeCardModal();
//   }
// });

addDescription.addEventListener('click', () => {
  addDescription.classList.add('hide');
  cardDescription.classList.remove('hide');
  document.querySelector('.icon-description-modal').classList.remove('opacity');
});

addList.addEventListener('click', () => {
  addList.classList.add('hide');
  cardList.classList.remove('hide');
  document.querySelector('.icon-list-modal').classList.remove('opacity');
});

addListItem.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('.progress-bar').classList.remove('hide');
  const newListItem = document.createElement('div');
  newListItem.classList.add('list-item');
  newListItem.innerHTML = `<div class="checkbox-item">
  <input id="list-item1" class="checkbox-input" type="checkbox" name="item" />
  <label class="checkbox-label" for="list-item1"></label>
</div>
<textarea
  class="list-item-description"
  type="text"
  placeholder="Добавьте описание"
  name="item-description1"
></textarea>`;
  addListItem.before(newListItem);
});

closeIcon.addEventListener('click', closeCardModal);

savebutton.addEventListener('click', saveCardModal);

function closeCardModal(event) {
  console.log('closeCardModal');
  clarificationBlock.classList.remove('hide');
  document.querySelector('.card-modal').classList.add('blur');

  document
    .querySelector('.button-yes')
    .addEventListener('click', saveCardModal);

  document.querySelector('.button-no').addEventListener('click', () => {
    console.log('withoutSaveCardModal');
    clarificationBlock.classList.add('hide');
    document.querySelector('.card-modal').classList.add('hide');
    boardBox.classList.remove('blur');
  });
}

function saveCardModal(event) {
  console.log('saveCardModal');
}
