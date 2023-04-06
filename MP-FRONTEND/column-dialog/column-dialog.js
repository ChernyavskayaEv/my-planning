class ColumnDialog extends HTMLElement {
  #template;
  #initialState = {};
  #data = {
    orderliness: '',
    title: '',
    board: '',
  };

  setNewColumn() {
    this.#data = {
      orderliness: '',
      title: '',
      board: '',
    };
    this.#initialState = { ...this.#data };
  }

  async saveNewColumn() {
    const idActiveBoard = document.querySelector('.active').id;
    const activeBoardBox = document.querySelector(`.${idActiveBoard}`);
    const column = document.querySelector('#newColumn');
    column.children[1].textContent = this.#data.title =
      this.components.columnTitle.value;
    this.#data.board = idActiveBoard.split('-')[1];
    this.#data.orderliness = activeBoardBox.children.length - 1;

    const { result: id } = await fetch('/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ ...this.#data }),
    }).then((res) => res.json());

    column.id = id;

    this.resetValuesColumn();
  }

  async setOldColumn(id, orderliness, title, board) {
    this.#data = {
      id: id,
      orderliness: orderliness,
      title: title,
      board: board,
    };

    this.#initialState = { ...this.#data };
    this.components.columnTitle.value = this.#data.title;
  }

  async saveOldColumn() {
    const updatedColumn = document.getElementById(`cl-${this.#data.id}`);
    updatedColumn.children[1].textContent = this.#data.title =
      this.components.columnTitle.value;

    await fetch(`/columns/${this.#data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ ...this.#data }),
    });

    this.resetValuesColumn();
  }

  openColumnDialog() {
    this.components.columnDialog.classList.remove('hide');
    addBlurBoardBox();
  }

  resetValuesColumn() {
    this.components.columnTitle.value = '';
    this.components.columnDialog.classList.add('hide');
    removeBlurBoardBox();
  }

  constructor() {
    super();
    this.#template = fetch('/column-dialog/column-dialog.html').then((res) =>
      res.text()
    );
  }

  async connectedCallback() {
    this.innerHTML = await this.#template;
    this.components = {
      columnDialog: this.querySelector('.column-dialog'),
      columnTitle: this.querySelector('.column-title'),
    };

    this.components.columnDialog.addEventListener('click', (event) => {
      if (event.target.classList.contains('close-column-icon')) {
        if (document.getElementById('newColumn')) {
          document.getElementById('newColumn').remove();
          this.resetValuesColumn();
        } else {
          this.resetValuesColumn();
        }
      }
      if (event.target.classList.contains('save-button')) {
        if (this.components.columnTitle.value == '') {
          document.getElementById('newColumn').remove();
        } else if (document.getElementById('newColumn')) {
          this.saveNewColumn();
        } else {
          this.saveOldColumn();
        }
      }
    });
  }
}
customElements.define('column-dialog', ColumnDialog);
