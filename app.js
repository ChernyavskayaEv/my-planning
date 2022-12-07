const boardBox = document.querySelector('.board-box');
const column = document.querySelector('.column');

column.addEventListener('click', (event) => {
  event.preventDefault();
  if (event.target.classList.contains('add-column')) {
    addColumns(event);
  }
  if (event.target.classList.contains('column-remove')) {
    if (event.target.parentElement.nextElementSibling.children.length > 0) {
      document.querySelector('.question-block').classList.remove('hide');

      document.querySelector('.yes').addEventListener('click', () => {
        event.target.parentElement.parentElement.remove();
        document.querySelector('.question-block').classList.add('hide');
      });

      document.querySelector('.no').addEventListener('click', () => {
        document.querySelector('.question-block').classList.add('hide');
      });
    } else {
      event.target.parentElement.parentElement.remove();
    }
  }
  if (event.target.classList.contains('add-card')) {
    addCard(event);
  }
});

function dragDrop() {
  const cards = document.querySelectorAll('card-column');
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
    event.target.classList.remove('hold');
    event.target.classList.remove('hide');
    event.target.showContent();
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
    if (event.target.classList.contains('placeholder')) {
      event.target.append(card);
    } else {
      event.target.closest('card-column').parentElement.append(card);
    }
  }
}

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
      <i class="fa-solid fa-plus add-column"></i>
      <i class="fa-solid fa-xmark column-remove"></i>
    </div>
    <div class="placeholder"></div>
    <a href="#" class="add-card">Добавить карточку</a>`;
    event.target.parentElement.parentElement.after(newColumn);
    newColumn.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.classList.contains('add-column')) {
        addColumns(event);
      }
      if (event.target.classList.contains('column-remove')) {
        if (event.target.parentElement.nextElementSibling.children.length > 0) {
          document.querySelector('.question-block').classList.remove('hide');

          document.querySelector('.yes').addEventListener('click', () => {
            event.target.parentElement.parentElement.remove();
            document.querySelector('.question-block').classList.add('hide');
          });

          document.querySelector('.no').addEventListener('click', () => {
            document.querySelector('.question-block').classList.add('hide');
          });
        } else {
          event.target.parentElement.parentElement.remove();
        }
      }
      if (event.target.classList.contains('add-card')) {
        addCard(event);
      }
    });
    dragDrop();
  }
}
class CardColumn extends HTMLElement {
  #template;
  #data = {
    cardId: '',
    cardTitle: '',
    cardDescription: '',
    cardList: [],
    listTitle: '',
  };

  set cardId(value) {
    this.#data.cardId = value;
  }

  set cardTitle(value) {
    this.#data.cardTitle = value;
    this.components.cardTitle.textContent = value;
    this.components.cardColumn.classList.remove('hide');
  }

  set cardDescription(value) {
    this.#data.cardDescription = value;
    if (!this.#data.cardDescription == '') {
      this.components.iconDescriptionColumn.classList.remove('hide');
    } else {
      this.components.iconDescriptionColumn.classList.add('hide');
    }
  }

  set cardList(array) {
    this.#data.cardList = array;
    if (this.#data.cardList.length > 0) {
      this.components.blockList.classList.remove('hide');
      this.components.cardListInfo.textContent = `${
        this.#data.cardList.filter((el) => el.checking).length
      }/${this.#data.cardList.length}`;
    } else {
      this.components.blockList.classList.add('hide');
    }
  }

  set listTitle(value) {
    this.#data.listTitle = value;
  }

  showContent() {
    this.cardTitle = this.#data.cardTitle;
    this.cardDescription = this.#data.cardDescription;
    this.cardList = this.#data.cardList;
    this.listTitle = this.#data.listTitle;
  }

  constructor() {
    super();
    this.#template = fetch('/card-column/card-column.html').then((res) =>
      res.text()
    );
  }

  async connectedCallback() {
    this.innerHTML = await this.#template;
    this.components = {
      cardColumn: this.querySelector('.card-column'),
      cardTitle: this.querySelector('.card-title'),
      iconDescriptionColumn: this.querySelector('.icon-description-column'),
      blockList: this.querySelector('.block-list'),
      cardListInfo: this.querySelector('.card-list-info'),
      iconOpen: this.querySelector('.icon-open'),
    };

    this.components.iconOpen.addEventListener('click', (event) => {
      event.preventDefault();
      const cardDialog = document.querySelector('card-dialog');
      cardDialog.setOldCard(
        this.#data.cardId,
        this.#data.cardTitle,
        this.#data.cardDescription,
        this.#data.cardList,
        this.#data.listTitle
      );
      const cardModal = document.querySelector('.card-modal');
      cardModal.classList.remove('hide');
      boardBox.classList.add('blur');
    });
  }
}
customElements.define('card-column', CardColumn);

class CardDialog extends HTMLElement {
  #template;
  #initialState = {};
  #data = {
    cardId: '',
    cardTitle: '',
    cardDescription: '',
    listTitle: '',
    cardList: [],
  };

  get data() {
    return this.#data;
  }

  resetValues() {
    this.components.cardTitle.value = '';
    this.components.addDescription.classList.remove('hide');
    this.components.cardDescription.classList.add('hide');
    this.components.iconDescriptionModal.classList.add('opacity');
    this.components.textareaDescription.value = '';
    this.components.listTitle.value = '';
    this.components.addList.classList.remove('hide');
    this.components.cardList.classList.add('hide');
    this.components.iconListModal.classList.add('opacity');
    this.components.listItems.forEach((el) => el.remove());
    this.components.fullScale.style.width = '';
    this.components.percents.innerHTML = '0%';
  }

  scale() {
    this.components.listChecked = this.querySelectorAll('.line-through');
    this.components.listItems = this.querySelectorAll('.list-item');
    if (!this.components.listItems.length) {
      console.log(this.components.listItems.length);
      this.components.percents.innerHTML = '0%';
    } else {
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
    }
  }

  setNewCard() {
    this.#data = {
      cardId: Date.now(),
      cardTitle: '',
      cardDescription: '',
      listTitle: '',
      cardList: [],
    };
    this.#initialState = { ...this.#data };
  }

  saveNewCard() {
    const card = document.querySelector('#new');
    card.id = this.#data.cardId;
    card.cardId = this.#data.cardId;
    card.cardTitle = this.components.cardTitle.value;
    card.cardDescription = this.components.textareaDescription.value;
    card.listTitle = this.components.listTitle.value;
    card.cardList = [...this.querySelectorAll('.list-item-description')].map(
      (el, i) => {
        return {
          order: i,
          description: el.value,
          checking: el.classList.contains('line-through'),
        };
      }
    );
    this.resetValues();
  }

  setOldCard(cardId, cardTitle, cardDescription, cardList, listTitle) {
    this.resetValues();
    this.#data = {
      cardId: cardId,
      cardTitle: cardTitle,
      cardDescription: cardDescription,
      listTitle: listTitle,
      cardList: cardList,
    };
    this.#initialState = { ...this.#data };
    this.components.cardTitle.value = cardTitle;

    if (cardDescription) {
      this.components.addDescription.classList.add('hide');
      this.components.cardDescription.classList.remove('hide');
      this.components.iconDescriptionModal.classList.remove('opacity');
      this.components.textareaDescription.value = cardDescription;
    }

    if (cardList.length > 0) {
      this.components.listTitle.value = listTitle;
      cardList.map((el, i) => {
        this.createListItem();
        const listItem = this.querySelectorAll('.list-item-description')[i];
        const checkboxInput = this.querySelectorAll('.checkbox-input')[i];
        listItem.value = el.description;
        checkboxInput.disabled = false;
        this.scale();

        this.components.addList.classList.add('hide');
        this.components.cardList.classList.remove('hide');
        this.components.iconListModal.classList.remove('opacity');

        if (el.checking) {
          listItem.classList.add('line-through');
          checkboxInput.checked = true;
          this.scale();
        } else {
          listItem.classList.remove('line-through');
          checkboxInput.checked = false;
          this.scale();
        }
      });
    }
  }

  saveOldCard() {
    const card = document.getElementById(`${this.#data.cardId}`);
    card.id = this.#data.cardId;
    card.cardId = this.#data.cardId;
    card.cardTitle = this.components.cardTitle.value;
    card.cardDescription = this.components.textareaDescription.value;
    card.listTitle = this.components.listTitle.value;
    card.cardList = [...this.querySelectorAll('.list-item-description')].map(
      (el, i) => {
        return {
          order: i,
          description: el.value,
          checking: el.classList.contains('line-through'),
        };
      }
    );
    this.resetValues();
  }

  comparisonData() {
    const comparisonCardList = () => {
      if (this.#data.cardList.length == this.#initialState.cardList.length) {
        for (let i = 0; i < this.#data.cardList.length; i++) {
          if (
            this.#data.cardList[i].description ==
              this.#initialState.cardList[i].description &&
            this.#data.cardList[i].checking ==
              this.#initialState.cardList[i].checking
          ) {
            continue;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
      return true;
    };
    return (
      this.#data.cardTitle == this.#initialState.cardTitle &&
      this.#data.cardDescription == this.#initialState.cardDescription &&
      this.#data.listTitle == this.#initialState.listTitle &&
      comparisonCardList()
    );
  }

  createListItem() {
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
      if (event.target.classList.contains('list-item-description')) {
        event.target.onchange = () =>
          (newListItem.querySelector('.checkbox-input').disabled = false);
        this.scale();
      }
      if (event.target.classList.contains('checkbox-input')) {
        const { checked } = event.target;
        if (checked) {
          newListItem
            .querySelector('.list-item-description')
            .classList.add('line-through');
          this.scale();
        } else {
          newListItem
            .querySelector('.list-item-description')
            .classList.remove('line-through');
          this.scale();
        }
      }
      if (event.target.classList.contains('list-item-remove')) {
        event.target.parentElement.remove();
        this.scale();
      }
    });
  }

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
      cardTitle: this.querySelector('.card-title'),
      iconDescriptionModal: this.querySelector('.icon-description-modal'),
      addDescription: this.querySelector('.add-description'),
      cardDescription: this.querySelector('.card-description'),
      textareaDescription: this.querySelector('.textarea-description'),
      iconListModal: this.querySelector('.icon-list-modal'),
      addList: this.querySelector('.add-list'),
      cardList: this.querySelector('.card-list'),
      listTitle: this.querySelector('.list-title'),
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

      this.createListItem();
    });

    this.components.closeIcon.addEventListener('click', closeCardModal);

    this.components.savebutton.addEventListener('click', saveCardModal);
  }
}
customElements.define('card-dialog', CardDialog);

function addCard(event) {
  if (event.target.classList.contains('add-card')) {
    const cardDialog = document.querySelector('card-dialog');
    cardDialog.setNewCard();
    const cardModal = document.querySelector('.card-modal');
    cardModal.classList.remove('hide');
    boardBox.classList.add('blur');
    const newCardColumn = document.createElement('card-column');
    newCardColumn.id = 'new';
    newCardColumn.setAttribute('draggable', true);
    event.target.previousElementSibling.append(newCardColumn);
  }
}

function closeCardModal() {
  const cardModal = document.querySelector('card-dialog');
  cardModal.data.cardTitle = cardModal.querySelector('.card-title').value;
  cardModal.data.cardDescription = cardModal.querySelector(
    '.textarea-description'
  ).value;
  cardModal.data.cardList = [
    ...cardModal.querySelectorAll('.list-item-description'),
  ].map((el, i) => {
    return {
      order: i,
      description: el.value,
      checking: el.classList.contains('line-through'),
    };
  });
  if (!cardModal.comparisonData()) {
    document.querySelector('.clarification-block').classList.remove('hide');
    document.querySelector('.card-modal').classList.add('blur');
  } else {
    hideCardModal();
    const card = document.getElementById('new');
    if (card) {
      card.remove();
    }
    const cardModal = document.querySelector('card-dialog');
    cardModal.resetValues();
  }

  document
    .querySelector('.button-yes')
    .addEventListener('click', saveCardModal);

  document.querySelector('.button-no').addEventListener('click', () => {
    hideCardModal();
    const card = document.getElementById('new');
    if (card) {
      card.remove();
    }
    const cardModal = document.querySelector('card-dialog');
    cardModal.resetValues();
  });
}

function saveCardModal() {
  hideCardModal();
  dragDrop();
  const cardModal = document.querySelector('card-dialog');
  if (document.querySelector('#new')) {
    cardModal.saveNewCard();
  } else {
    cardModal.saveOldCard();
  }
}

function hideCardModal() {
  document.querySelector('.clarification-block').classList.add('hide');
  document.querySelector('.card-modal').classList.add('hide');
  document.querySelector('.card-modal').classList.remove('blur');
  boardBox.classList.remove('blur');
}

// document.addEventListener('keyup', (event) => {
//   console.log(event.code);
//   if (
//     event.code === 'Escape' &&
//     !document.querySelector('.card-modal').classList.contains('hide')
//   ) {
//     closeCardModal();
//   }
// });
