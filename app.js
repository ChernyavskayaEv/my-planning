const boardBox = document.querySelector('.board-box');
const column = document.querySelector('.column');

//working with column
column.addEventListener('click', (event) => {
  event.preventDefault();
  if (event.target.classList.contains('add-column')) {
    addColumns(event);
  }
  if (event.target.classList.contains('add-card')) {
    addCard(event);
  }
});

//add column
function addColumns(event) {
  if (event.target.classList.contains('add-column')) {
    const newColumn = document.createElement('div');
    newColumn.classList.add('column');
    newColumn.innerHTML = `<div class="title-column">
      <input
        class="column-title"
        type="text"
        placeholder="Введите название"
        name="title_column"
      />
      <a href="#" class="add-column"></a>
    </div>
    <div class="placeholder"></div>
    <a href="#" class="add-card">Добавить карточку</a>`;
    event.target.parentElement.parentElement.after(newColumn);
    newColumn.addEventListener('click', (event) => addColumns(event));

    //drag-n-drop card in column
    const cards = document.querySelectorAll('.card-column');
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
      event.target.className = 'card-column';
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
      if (event.target.classList.contains('card-column')) {
        event.target.parentElement.append(card);
      } else {
        event.target.append(card);
      }
    }
  }
}

class CardDialog extends HTMLElement {
  #template;
  #data = {
    cardId: '',
    cardTitle: '',
    cardDescription: '',
    cardList: [],
  };

  constructor() {
    super();
    this.#template = fetch('/card-dialog/card-dialog.html').then((res) =>
      res.text()
    );
  }

  async connectedCallback() {
    this.innerHTML = await this.#template;
    this.components = {
      cardModal: this.querySelector('.card-modal'),
      addDescription: this.querySelector('.add-description'),
      cardDescription: this.querySelector('.card-description'),
      addList: this.querySelector('.add-list'),
      cardList: this.querySelector('.card-list'),
      addListItem: this.querySelector('.add-list-item'),
      closeIcon: this.querySelector('.close-icon'),
      savebutton: this.querySelector('.save-button'),
    };

    this.components.addDescription.addEventListener('click', () => {
      this.components.addDescription.classList.add('hide');
      this.components.cardDescription.classList.remove('hide');
      document
        .querySelector('.icon-description-modal')
        .classList.remove('opacity');
    });

    this.components.addList.addEventListener('click', () => {
      this.components.addList.classList.add('hide');
      this.components.cardList.classList.remove('hide');
      document.querySelector('.icon-list-modal').classList.remove('opacity');
    });

    this.components.addListItem.addEventListener('click', (event) => {
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
      this.components.addListItem.before(newListItem);
    });

    this.components.closeIcon.addEventListener('click', closeCardModal);

    this.components.savebutton.addEventListener('click', saveCardModal);
  }
}
customElements.define('card-dialog', CardDialog);

//add card
function addCard(event) {
  if (event.target.classList.contains('add-card')) {
    const cardModal = document.querySelector('.card-modal');
    cardModal.classList.remove('hide');
    boardBox.classList.add('blur');
  }
}

function closeCardModal() {
  console.log('closeCardModal');
  document.querySelector('.clarification-block').classList.remove('hide');
  document.querySelector('.card-modal').classList.add('blur');

  document
    .querySelector('.button-yes')
    .addEventListener('click', saveCardModal);

  document.querySelector('.button-no').addEventListener('click', () => {
    console.log('withoutSaveCardModal');
    hideCardModal();
  });
}

function saveCardModal() {
  console.log('saveCardModal');
  hideCardModal();
}

function hideCardModal() {
  document.querySelector('.clarification-block').classList.add('hide');
  document.querySelector('.card-modal').classList.add('hide');
  document.querySelector('.card-modal').classList.remove('blur');
  boardBox.classList.remove('blur');
}

document.addEventListener('keyup', (event) => {
  console.log(event.code);
  if (
    event.code === 'Escape' &&
    !document.querySelector('.card-modal').classList.contains('hide')
  ) {
    closeCardModal();
  }
});
