class CardDialog extends HTMLElement {
  #template;
  #initialState = {};
  #data = {
    orderliness: '',
    title: '',
    description: '',
    headlist: '',
    list: [],
    columnid: '',
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
      orderliness: '',
      title: '',
      description: '',
      headlist: '',
      list: [],
      columnid: '',
    };
    this.#initialState = { ...this.#data };
  }

  async saveNewCard() {
    const card = document.querySelector('#new');
    this.#data.orderliness = card.parentElement.children.length;
    this.#data.title = this.components.cardTitle.value;
    this.#data.description = this.components.textareaDescription.value;
    this.#data.headlist = this.components.listTitle.value;
    this.#data.list = [...this.querySelectorAll('.list-item-description')].map(
      (el, i) => {
        return {
          order: i,
          description: el.value,
          checking: el.classList.contains('line-through'),
        };
      }
    );
    this.#data.columnid = card.closest('.column').id.split('-')[1];

    card.data = this.#data;

    const { result: id } = await myFetch('/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ ...this.#data }),
    }).then((res) => res.json());
    card.id = id;

    this.resetValues();
  }

  setOldCard(id, dataset) {
    this.resetValues();
    this.#data = dataset;
    this.#data.id = id;
    this.#initialState = { ...this.#data };
    this.components.cardTitle.value = this.#data.title;

    if (this.#data.description) {
      this.components.addDescription.classList.add('hide');
      this.components.cardDescription.classList.remove('hide');
      this.components.iconDescriptionModal.classList.remove('opacity');
      this.components.textareaDescription.value = this.#data.description;
    }

    if (this.#data.list.length > 0) {
      this.components.listTitle.value = this.#data.headlist;
      this.#data.list.map((el, i) => {
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

  async saveOldCard() {
    const card = document.getElementById(`cr-${this.#data.id}`);
    this.#data.title = this.components.cardTitle.value;
    this.#data.description = this.components.textareaDescription.value;
    this.#data.headlist = this.components.listTitle.value;
    this.#data.list = [...this.querySelectorAll('.list-item-description')].map(
      (el, i) => {
        return {
          order: i,
          description: el.value,
          checking: el.classList.contains('line-through'),
        };
      }
    );
    card.data = this.#data;

    await myFetch(`/cards/${this.#data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ ...this.#data }),
    });
    this.resetValues();
  }

  comparisonData() {
    const comparisonCardList = () => {
      if (this.#data.list.length == this.#initialState.list.length) {
        for (let i = 0; i < this.#data.list.length; i++) {
          if (
            this.#data.list[i].description ==
              this.#initialState.list[i].description &&
            this.#data.list[i].checking == this.#initialState.list[i].checking
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
      this.#data.title == this.#initialState.title &&
      this.#data.description == this.#initialState.description &&
      this.#data.headlist == this.#initialState.headlist &&
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
    this.#template = myFetch('/card-dialog/card-dialog.html').then((res) =>
      res.text()
    );
  }

  async connectedCallback() {
    this.innerHTML = await this.#template;
    this.components = {
      cardModal: this.querySelector('.card-modal'),
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
    };

    this.components.cardModal.addEventListener('click', (event) => {
      if (event.target.classList.contains('add-description')) {
        this.components.addDescription.classList.add('hide');
        this.components.cardDescription.classList.remove('hide');
        this.components.iconDescriptionModal.classList.remove('opacity');
      }
      if (event.target.classList.contains('add-list')) {
        this.components.addList.classList.add('hide');
        this.components.cardList.classList.remove('hide');
        this.components.iconListModal.classList.remove('opacity');
      }
      if (event.target.classList.contains('add-list-item')) {
        event.preventDefault();
        this.components.progressBar.classList.remove('hide');
        this.createListItem();
      }
      if (event.target.classList.contains('close-icon')) {
        closeCardModal();
      }
      if (event.target.classList.contains('save-button')) {
        saveCardModal();
      }
    });
  }
}
customElements.define('card-dialog', CardDialog);
