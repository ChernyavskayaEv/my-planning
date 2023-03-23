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
    };

    this.components.cardColumn.addEventListener('click', (event) => {
      if (event.target.classList.contains('icon-open')) {
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
        addBlurBoardBox();
      }
      if (event.target.classList.contains('card-remove')) {
        event.preventDefault();
        document.querySelector('.question-block').classList.remove('hide');
        document.querySelector('.question-card').classList.remove('hide');

        removing(event);
        closing();
      }
    });
  }
}
customElements.define('card-column', CardColumn);
