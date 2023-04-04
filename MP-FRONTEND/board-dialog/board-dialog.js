class BoardDialog extends HTMLElement {
  #template;
  #initialState = {};
  #data = {
    orderliness: '',
    title: '',
    background: '',
    active: false,
  };

  setNewBoard() {
    this.#data = {
      orderliness: '',
      title: '',
      background: '',
      active: false,
    };
    this.#initialState = { ...this.#data };
  }

  async saveNewBoard() {
    const board = document.querySelector('#newBoard');
    board.lastChild.textContent = this.#data.title =
      this.components.boardTitle.value;
    this.#data.orderliness = document.querySelectorAll('.board').length;
    board.style.backgroundImage = this.#data.background =
      this.components.boardBackground.style.backgroundImage;
    if (document.querySelectorAll('.board')[0].id == 'newBoard') {
      this.#data.active = true;
    } else {
      this.#data.active = false;
    }

    const { result: id } = await fetch('/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ ...this.#data }),
    }).then((res) => res.json());

    board.id = id;

    const boardBox = document.querySelector('.new-board');
    boardBox.classList.add(`${id}`);
    boardBox.classList.remove('new-board');

    this.resetValuesBoard();
  }

  async setOldBoard(idBoard) {
    const id = idBoard.split('-')[1];

    this.#data = await fetch(`/boards/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).then((res) => res.json());

    this.#initialState = { ...this.#data };
    this.components.boardTitle.value = this.#data.title;
    this.components.boardBackground.classList.remove('hide');
    this.components.boardBackground.style.backgroundImage =
      this.#data.background;
  }

  async saveOldBoard() {
    const board = document.getElementById(`br-${this.#data.id}`);
    board.lastElementChild.textContent = this.#data.title =
      this.components.boardTitle.value;
    board.style.backgroundImage = this.#data.background =
      this.components.boardBackground.style.backgroundImage;
    this.resetValuesBoard();

    await fetch(`/boards/${this.#data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ ...this.#data }),
    });
  }

  openBoardDialog() {
    this.components.boardDialog.classList.remove('hide');
    addBlurBoardBox();
  }

  revertAddingBoard() {
    document.getElementById('newBoard').remove();
    document.querySelector('.new-board').remove();
    this.resetValuesBoard();
  }

  resetValuesBoard() {
    this.components.boardTitle.value = '';
    this.components.boardBackground.classList.add('hide');
    this.components.boardBackground.style.backgroundImage = '';
    this.components.boardDialog.classList.add('hide');
    removeBlurBoardBox();
  }

  constructor() {
    super();
    this.#template = fetch('/board-dialog/board-dialog.html').then((res) =>
      res.text()
    );
  }

  async connectedCallback() {
    this.innerHTML = await this.#template;
    this.components = {
      boardDialog: this.querySelector('.board-dialog'),
      boardTitle: this.querySelector('.board-title'),
      boardBackground: this.querySelector('.board-background'),
      selectionImg: this.querySelector('.selection-img'),
    };

    const backgrounds = [
      `url('https://images.unsplash.com/photo-1669490893279-4589b3b1cf4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80')`,
      `url(
        'https://images.unsplash.com/photo-1673068283884-99aae7a88204?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1673022566624-c8315b87267c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1506606352681-649023fac596?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1610886420404-7f72bc3d57d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1673001015039-b4c646ef7aee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60'
      )`,
      `url('https://images.unsplash.com/photo-1539584222411-a76a40e9e861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')`,
      `url(
        'https://images.unsplash.com/photo-1672357868692-73cf46b52dfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDR8Ym84alFLVGFFMFl8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://plus.unsplash.com/premium_photo-1671628147501-42120d9d4af4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1672167834379-f6f3f9b8429e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDd8RnpvM3p1T0hONnd8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1671483331012-86fa989701d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDU2fEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1668826381348-081f41d5319c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDQ0fEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1670687541364-72b4e21d7182?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE0NHxGem8zenVPSE42d3x8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1672356822019-e3a52132dcdd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDY2fDZzTVZqVExTa2VRfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1672756955554-f16a2d013155?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDMxfDZzTVZqVExTa2VRfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1672565091943-2d4502c671f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDM2fDZzTVZqVExTa2VRfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1671050579276-b1f0dfbefe76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDQ3fDZzTVZqVExTa2VRfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60'
      )`,
      `url(
        'https://images.unsplash.com/photo-1672605183243-22fd7c7fd73e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
      )`,
      `url(
        'https://images.unsplash.com/photo-1671260131584-b1bbe779100b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE2fHFQWXNEenZKT1ljfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1671273976450-7d1944e5a2d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDIxfHFQWXNEenZKT1ljfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1672935060511-7b42638bc6ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
      )`,
      ` url(
        'https://plus.unsplash.com/premium_photo-1672695383101-48bf96571427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
      )`,
      ` url(
        'https://plus.unsplash.com/premium_photo-1672896873553-7ec68031824f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDMxfGlVSXNuVnRqQjBZfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      ` url(
        'https://plus.unsplash.com/premium_photo-1672785820580-13d7c0a87432?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDM2fGlVSXNuVnRqQjBZfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      ` url(
        'https://images.unsplash.com/photo-1655070250178-5112a940d0dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDh8eGpQUjRobGtCR0F8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60'
      )`,
      `   url(
        'https://images.unsplash.com/photo-1669848767705-ad8923db76eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDM0fHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60'
      )`,
      `url(
        'https://plus.unsplash.com/premium_photo-1664640733890-17acaf0529a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDEwMXx4alBSNGhsa0JHQXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=400&q=60'
      )`,
      ` url(
        'https://plus.unsplash.com/premium_photo-1669559809615-b08af364b738?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDUxfHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      ` url(
        'https://plus.unsplash.com/premium_photo-1669559809077-52f963b1ea7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDUyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
      `url(
        'https://plus.unsplash.com/premium_photo-1669495126753-d943195037a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDY4fHhqUFI0aGxrQkdBfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
      )`,
    ];

    this.components.boardDialog.addEventListener('click', (event) => {
      if (event.target.classList.contains('select-background')) {
        if (this.components.selectionImg.children.length == 1) {
          backgrounds.forEach((item) => {
            const newBackground = document.createElement('div');
            newBackground.classList.add('background-img');
            newBackground.style.backgroundImage = item;

            this.components.selectionImg.append(newBackground);
          });
        }

        this.components.selectionImg.classList.remove('hide');
      }
      if (event.target.classList.contains('close-board-icon')) {
        if (document.getElementById('newBoard')) {
          this.revertAddingBoard();
        } else {
          this.resetValuesBoard();
        }
      }
      if (event.target.classList.contains('save-button')) {
        if (
          this.components.boardTitle.value == '' &&
          this.components.boardBackground.style.backgroundImage == ''
        ) {
          this.revertAddingBoard();
        } else if (document.getElementById('newBoard')) {
          this.saveNewBoard();
        } else {
          this.saveOldBoard();
        }
      }
    });

    this.components.selectionImg.addEventListener('click', (event) => {
      if (event.target.classList.contains('close-board-icon')) {
        this.components.selectionImg.classList.add('hide');
        this.components.boardBackground.classList.remove('hide');
      }
      if (event.target.classList.contains('background-img')) {
        this.components.selectionImg.classList.add('hide');
        this.components.boardBackground.classList.remove('hide');
        this.components.boardBackground.style.backgroundImage =
          event.target.style.backgroundImage;
      }
    });
  }
}
customElements.define('board-dialog', BoardDialog);
