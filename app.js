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
      closeIcon: this.querySelector('.close-icon'),
      iconDescriptionModal: this.querySelector('.icon-description-modal'),
      addDescription: this.querySelector('.add-description'),
      cardDescription: this.querySelector('.card-description'),
      iconListModal: this.querySelector('.icon-list-modal'),
      addList: this.querySelector('.add-list'),
      cardList: this.querySelector('.card-list'),
      progressBar: this.querySelector('.progress-bar'),
      fullScale: this.querySelector('.full-scale'),
      percents: this.querySelector('.percents'),
      addListItem: this.querySelector('.add-list-item'),
      listItems: this.querySelectorAll('.list-item'),
      listChecked: this.querySelectorAll('.line-through'),
      savebutton: this.querySelector('.save-button'),
    };

    this.components.addDescription.addEventListener('click', () => {
      this.components.addDescription.classList.add('hide');
      this.components.cardDescription.classList.remove('hide');
      this.components.iconDescriptionModal.classList.remove('opacity');
    });

    this.components.addList.addEventListener('click', () => {
      this.components.addList.classList.add('hide');
      this.components.cardList.classList.remove('hide');
      this.components.iconListModal.classList.remove('opacity');
    });

    this.components.addListItem.addEventListener('click', (event) => {
      event.preventDefault();

      this.components.progressBar.classList.remove('hide');

      const newListItem = document.createElement('div');
      newListItem.classList.add('list-item');
      (this.components.listItems = this.querySelectorAll('.list-item')),
        (newListItem.innerHTML = `<div class="checkbox-item">
			  <input id="list-item${
          this.components.listItems.length + 1
        }" class="checkbox-input" type="checkbox" name="item" disabled = true/>
			  <label class="checkbox-label" for="list-item${
          this.components.listItems.length + 1
        }"></label>
			</div>
			<textarea
			  class="list-item-description"
			  type="text"
			  placeholder="Добавьте описание"
			  name="item-description${this.components.listItems.length + 1}"
			></textarea>
      <i class="fa-solid fa-xmark list-item-remove"></i>`);
      this.components.addListItem.before(newListItem);

      newListItem.addEventListener('click', (event) => {
        const scale = () => {
          this.components.listChecked = this.querySelectorAll('.line-through');
          this.components.listItems = this.querySelectorAll('.list-item');

          this.components.fullScale.style.width = `${
            (this.components.listChecked.length /
              this.components.listItems.length) *
            100
          }%`;
          this.components.percents.innerHTML = `${Math.floor(
            (this.components.listChecked.length /
              this.components.listItems.length) *
              100
          )}%`;
        };

        if (event.target.classList.contains('list-item-description')) {
          event.target.onchange = () =>
            (newListItem.querySelector('.checkbox-input').disabled = false);
          scale();
        }
        if (event.target.classList.contains('checkbox-input')) {
          const { checked } = event.target;
          if (checked) {
            newListItem
              .querySelector('.list-item-description')
              .classList.add('line-through');
            scale();
          } else {
            newListItem
              .querySelector('.list-item-description')
              .classList.remove('line-through');
            scale();
          }
        }
        if (event.target.classList.contains('list-item-remove')) {
          event.target.parentElement.remove();
          scale();
        }
      });
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
