class CardColumn extends HTMLElement {
  #template;
  #data = {
    orderliness: '',
    title: '',
    description: '',
    headlist: '',
    list: [],
    columnid: '',
  };

  set data(value) {
    this.#data = value;

    this.components.cardTitle.textContent = this.#data.title;
    this.components.cardColumn.classList.remove('hide');

    if (!this.#data.description == '') {
      this.components.iconDescriptionColumn.classList.remove('hide');
    } else {
      this.components.iconDescriptionColumn.classList.add('hide');
    }

    if (this.#data.list.length > 0) {
      this.components.blockList.classList.remove('hide');
      this.components.cardListInfo.textContent = `${
        this.#data.list.filter((el) => el.checking).length
      }/${this.#data.list.length}`;
    } else {
      this.components.blockList.classList.add('hide');
    }
  }

  get data() {
    return this.#data;
  }

  // set orderliness(value) {
  //   this.#data.orderliness = value;
  // }

  // set title(value) {
  //   this.#data.title = value;
  //   this.components.cardTitle.textContent = value;
  //   this.components.cardColumn.classList.remove('hide');
  // }

  // set description(value) {
  //   this.#data.description = value;
  //   if (!this.#data.description == '') {
  //     this.components.iconDescriptionColumn.classList.remove('hide');
  //   } else {
  //     this.components.iconDescriptionColumn.classList.add('hide');
  //   }
  // }

  // set headlist(value) {
  //   this.#data.headlist = value;
  // }

  // set list(array) {
  //   this.#data.list = array;
  //   if (this.#data.list.length > 0) {
  //     this.components.blockList.classList.remove('hide');
  //     this.components.cardListInfo.textContent = `${
  //       this.#data.list.filter((el) => el.checking).length
  //     }/${this.#data.list.length}`;
  //   } else {
  //     this.components.blockList.classList.add('hide');
  //   }
  // }

  // set orderliness(value) {
  //   this.#data.orderliness = value;
  // }

  // showContent() {
  //   this.orderliness = this.#data.orderliness;
  //   this.title = this.#data.title;
  //   this.description = this.#data.description;
  //   this.headlist = this.#data.headlist;
  //   this.list = this.#data.list;
  //   this.columnid = this.#data.columnid;
  // }

  constructor() {
    super();
    this.#template = fetch('/card-column/card-column.html').then((res) =>
      res.text()
    );
  }

  async init(dataset) {
    await this.#template;
    this.components.cardColumn.classList.remove('hide');
    this.data = { ...dataset };
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
      const activeCard = event.target.parentElement.parentElement.parentElement;
      if (event.target.classList.contains('icon-open')) {
        const cardDialog = document.querySelector('card-dialog');
        cardDialog.setOldCard(activeCard.id.split('-')[1], this.#data);
        const cardModal = document.querySelector('.card-modal');
        cardModal.classList.remove('hide');
        addBlurBoardBox();
      }
      if (event.target.classList.contains('card-remove')) {
        document.querySelector('.question-block').classList.remove('hide');
        document.querySelector('.question-card').classList.remove('hide');

        removingCard(event);
        closing();
      }
    });
  }
}
customElements.define('card-column', CardColumn);
