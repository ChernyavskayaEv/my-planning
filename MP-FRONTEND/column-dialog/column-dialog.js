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

  openColumnDialog() {
    this.components.columnDialog.classList.remove('hide');
    addBlurBoardBox();
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
      columnTitle: this.querySelector('.board-title'),
    };
  }
}
customElements.define('column-dialog', ColumnDialog);
