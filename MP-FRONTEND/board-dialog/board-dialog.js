class BoardDialog extends HTMLElement {
  #template;
  #initialState = {};
  #data = {
    boardId: '',
    boardTitle: '',
    boardBackground: '',
  };

  setNewBoard() {
    this.#data = {
      boardId: Date.now(),
      boardTitle: '',
      boardBackground: '',
    };
    this.#initialState = { ...this.#data };
  }

  saveNewBoard() {
    const board = document.querySelector('#newBoard');
    board.lastChild.textContent = this.#data.boardTitle =
      this.components.boardTitle.value;
    board.style.backgroundImage = this.#data.boardBackground =
      this.components.boardBackground.style.backgroundImage;
    board.id = this.#data.boardId;

    const boardBox = document.querySelector('.new-board');
    boardBox.classList.add(`${this.#data.boardId}`);
    boardBox.classList.remove('new-board');

    this.resetValues();
  }

  setOldBoard(boardId, boardBackground, boardTitle) {
    this.#data = {
      boardId: boardId,
      boardBackground: boardBackground,
      boardTitle: boardTitle,
    };
    this.#initialState = { ...this.#data };
    this.components.boardTitle.value = boardTitle;
    this.components.boardBackground.classList.remove('hide');
    this.components.boardBackground.style.backgroundImage = boardBackground;
  }

  saveOldBoard() {
    const board = document.getElementById(`${this.#data.boardId}`);
    board.lastElementChild.textContent = this.#data.boardTitle =
      this.components.boardTitle.value;
    board.style.backgroundImage = this.#data.boardBackground =
      this.components.boardBackground.style.backgroundImage;

    this.resetValues();
  }

  openBoardDialog() {
    this.components.boardDialog.classList.remove('hide');
    addBlurBoardBox();
  }

  revertAdding() {
    document.getElementById('newBoard').remove();
    document.querySelector('.new-board').remove();
    this.resetValues();
  }

  resetValues() {
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
      boardBackground: this.querySelector('.board-background'),
    };

    this.components.boardDialog.addEventListener('click', (event) => {
      if (event.target.classList.contains('select-background')) {
        this.components.selectionImg.classList.remove('hide');
      }
      if (event.target.classList.contains('close-board-icon')) {
        if (document.getElementById('newBoard')) {
          this.revertAdding();
        } else {
          this.resetValues();
        }
      }
      if (event.target.classList.contains('save-button')) {
        if (
          this.components.boardTitle.value == '' &&
          this.components.boardBackground.style.backgroundImage == ''
        ) {
          this.revertAdding();
        } else if (document.getElementById('newBoard')) {
          this.saveNewBoard();
        } else {
          this.saveOldBoard();
        }
        console.log('board', this.#data);
      }
    });

    this.components.selectionImg.addEventListener('click', (event) => {
      if (event.target.classList.contains('background-img'))
        this.components.selectionImg.classList.add('hide');
      this.components.boardBackground.classList.remove('hide');
      this.components.boardBackground.style.backgroundImage =
        event.target.style.backgroundImage;
    });
  }
}
customElements.define('board-dialog', BoardDialog);
