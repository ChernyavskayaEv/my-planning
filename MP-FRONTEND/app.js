const boardCollection = document.querySelector('.board-collection');
const boardDialog = document.querySelector('board-dialog');
const columnDialog = document.querySelector('column-dialog');
const formRegister = document.querySelector('.form-register');
const formLogin = document.querySelector('.form-login');
const errorBlock = document.querySelector('.error-block');

document.querySelector('header').addEventListener('click', (event) => {
  if (event.target.classList.contains('make-user')) {
    formRegister.classList.remove('hide');
    addBlurContainer();
  }
  if (event.target.classList.contains('go-in')) {
    formLogin.classList.remove('hide');
    addBlurContainer();
  }
  if (event.target.classList.contains('go-out')) {
    document.querySelector('.login').classList.add('hide');
    document.querySelector('.register').classList.remove('hide');
    document.querySelector('.user-name').id = '';
    document.querySelector('.user-name').innerHTML = '';
    window.localStorage.removeItem('token');
    document.querySelectorAll('.board').forEach((board) => board.remove());
    document
      .querySelectorAll('.board-box')
      .forEach((boardBox) => boardBox.remove());
    showPatternContainer();
  }
});

formRegister.addEventListener('submit', createUser);
formLogin.addEventListener('submit', authUser);

document.querySelectorAll('.close-form').forEach((closeIcon) => {
  closeIcon.addEventListener('click', () =>
    closeForm(closeIcon.closest('.form-body'))
  );
});

async function createUser(event) {
  event.preventDefault();
  let form = event.target;

  let formData = new FormData(form);
  let body = {};
  for (let [key, value] of formData.entries()) {
    body[key] = value;
  }
  await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(body),
  }).then(async (res) => {
    document
      .querySelectorAll('.helper')
      .forEach((item) => item.classList.add('opacity'));
    document
      .querySelectorAll('.input-register')
      .forEach((item) => item.classList.remove('error'));
    const result = await res.json();
    if (res.status == 200) {
      window.localStorage.setItem('token', result.token);
      successfulAuthorization(result);
      closeForm(form);
      showUserContainer();
    } else if (res.status == 400) {
      const helpers = result.map(({ param }) => param);
      helpers.forEach((helper) => {
        document.getElementById(`${helper}Help`).classList.remove('opacity');
        document.getElementById(`${helper}Form`).classList.add('error');
      });
    } else {
      const msg = result.message;
      errorBlock.classList.remove('hide');
      document.querySelector('.error-msg').innerHTML = msg;
      form.classList.add('blur');
    }
  });
}

async function authUser(event) {
  event.preventDefault();
  let form = event.target;

  let formData = new FormData(form);
  let body = {};
  for (let [key, value] of formData.entries()) {
    body[key] = value;
  }
  await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(body),
  }).then(async (res) => {
    document
      .querySelectorAll('.helper-login')
      .forEach((item) => item.classList.add('opacity'));
    document
      .querySelectorAll('.input-login')
      .forEach((item) => item.classList.remove('error'));
    const result = await res.json();
    if (res.status == 200) {
      window.localStorage.setItem('token', result.token);
      successfulAuthorization(result);
      closeForm(form);
      showUserContainer();
      loadingUserData();
    } else if (res.status == 400) {
      const helpers = result.map(({ param }) => param);
      helpers.forEach((helper) => {
        document
          .getElementById(`${helper}HelpLogin`)
          .classList.remove('opacity');
        document.getElementById(`${helper}FormLogin`).classList.add('error');
      });
    } else {
      const msg = result.message;
      errorBlock.classList.remove('hide');
      document.querySelector('.error-msg').innerHTML = msg;
      form.classList.add('blur');
    }
  });
}

errorBlock.addEventListener('click', (event) => {
  if (event.target.classList.contains('ok')) {
    document.querySelectorAll('form').forEach((form) => {
      closeForm(form);
    });
    errorBlock.classList.add('hide');
    removeBlurContainer();
  }
});

function successfulAuthorization(user) {
  document.querySelector('.register').classList.add('hide');
  document.querySelector('.login').classList.remove('hide');
  document.querySelector('.user-name').id = user.id;
  document.querySelector('.user-name').innerHTML = `${user.full_name}`;
}

function closeForm(form) {
  form.reset();
  form.classList.remove('blur');
  form.classList.add('hide');
  removeBlurContainer();
}

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
    const newOrderliness = event.target.closest('.placeholder').children.length;
    const newColumnid = event.target.closest('.column').id.split('-')[1];
    updatingCardPlace(
      event.target.id.split('-')[1],
      newOrderliness,
      newColumnid
    );
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

async function updatingCardPlace(id, newOrderliness, newColumnid) {
  await myFetch(`/placeForCard/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ id, newOrderliness, newColumnid }),
  });
}

function addBlurContainer() {
  document.querySelector('.pattern-container').classList.add('blur');
}

function removeBlurContainer() {
  document.querySelector('.pattern-container').classList.remove('blur');
}

function addBlurBoardBox() {
  const boardBoxs = document.querySelectorAll('.board-box');
  boardBoxs.forEach((item) => {
    item.classList.add('blur');
  });
}

function removeBlurBoardBox() {
  const boardBoxs = document.querySelectorAll('.board-box');
  boardBoxs.forEach((item) => {
    item.classList.remove('blur');
  });
}

async function updateActiveBoard(activeBoard) {
  const userid = document.querySelector('.user-name').id;
  const id = activeBoard.id.split('-')[1];
  const boards = document.querySelectorAll('.board');
  boards.forEach((board) => {
    board.classList.remove('active');
    [...board.children].forEach((children) => {
      children.classList.remove('pointer');
    });
    board.children[0].classList.add('opacity');
    board.children[1].classList.add('pointer');
  });

  const boardBoxs = document.querySelectorAll('.board-box');
  boardBoxs.forEach((boardBox) => {
    setTimeout(() => {
      boardBox.classList.add('hide');
    }, 300);
    boardBox.classList.add('animate__bounceOutLeft');
    boardBox.classList.remove('animate__bounceInRight');
    if (boardBox.classList.contains(`${activeBoard.id}`)) {
      setTimeout(() => {
        boardBox.classList.remove('hide');
        boardBox.classList.add('animate__bounceInRight');
      }, 300);

      boardBox.classList.remove('animate__bounceOutLeft');
    }
  });

  await myFetch('/boards', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ userid, id }),
  });

  activeBoard.classList.add('active');
  activeBoard.children[0].classList.remove('opacity');
  activeBoard.children[0].classList.add('pointer');
  activeBoard.children[1].classList.remove('pointer');
}

async function removeActiveBoard(idBoard) {
  const id = idBoard.split('-')[1];

  await myFetch(`/boards/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });
}

async function removeActiveColumn(idColumn) {
  const id = idColumn.split('-')[1];

  await myFetch(`/columns/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });
}

async function removeActiveCard(idCard) {
  const id = idCard.split('-')[1];

  await myFetch(`/cards/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });
}

boardCollection.addEventListener('click', (event) => {
  if (
    event.target.parentElement.classList.contains('board') &&
    !event.target.parentElement.classList.contains('active') &&
    !event.target.classList.contains('board-edit')
  ) {
    const activeBoard = event.target.parentElement;
    updateActiveBoard(activeBoard);
  }
  if (
    event.target.parentElement.parentElement.classList.contains('active') &&
    event.target.classList.contains('board-edit')
  ) {
    const oldBoard = event.target.closest('.board');
    const orderBoard =
      [...document.querySelectorAll('.board')].findIndex((item) =>
        item.classList.contains('active')
      ) + 1;
    boardDialog.setOldBoard(
      oldBoard.id.split('-')[1],
      orderBoard,
      event.target.parentElement.nextElementSibling.textContent,
      oldBoard.style.backgroundImage
    );
    boardDialog.openBoardDialog();
  }
  if (
    event.target.parentElement.parentElement.classList.contains('active') &&
    event.target.classList.contains('board-remove')
  ) {
    const boardRemoving = event.target.closest('.board');
    const boardBoxRemoving = document.querySelector(`.${boardRemoving.id}`);
    if (boardBoxRemoving.children.length == 1) {
      boardRemoving.remove();
      boardBoxRemoving.remove();
      removeActiveBoard(boardRemoving.id);
      if (document.querySelectorAll('.board').length > 0) {
        const activeBoard = document.querySelectorAll('.board')[0];
        updateActiveBoard(activeBoard);
      }
    } else {
      addBlurBoardBox();
      document.querySelector('.question-block').classList.remove('hide');
      document.querySelector('.question-board').classList.remove('hide');
      checkBeforeDeleting(boardRemoving, boardBoxRemoving);
    }
  }
  if (event.target.classList.contains('add-board')) {
    boardDialog.setNewBoard();
    boardDialog.openBoardDialog();
    const newBoardScreen = document.createElement('div');
    newBoardScreen.id = 'newBoard';
    newBoardScreen.classList.add('board');

    const newBoardBox = document.createElement('div');
    newBoardBox.classList.add('board-box', 'new-board', 'animate__animated');
    newBoardBox.innerHTML = `<a href="#" class="add-column">Добавить колонку</a>`;
    boardDialog.before(newBoardBox);

    if (event.target.parentElement.children.length == 1) {
      newBoardScreen.classList.add('active');
      newBoardScreen.innerHTML = `
     <div class="board-icon pointer">
        <i class="fa-regular fa-pen-to-square board-edit"></i>
        <i class="fa-solid fa-xmark board-remove"></i>
      </div>
      <p class=""></p>`;
    } else {
      newBoardScreen.innerHTML = `
     <div class="board-icon opacity">
       <i class="fa-regular fa-pen-to-square board-edit"></i>
       <i class="fa-solid fa-xmark board-remove"></i>
     </div>
     <p class="pointer"></p>`;

      newBoardBox.classList.add('hide');
    }
    document.querySelector('.add-board').before(newBoardScreen);
    const addingColumns = document.querySelectorAll('.add-column');
    addingColumns.forEach((item) => {
      item.addEventListener('click', addColumn);
    });
  }
});

function addColumn(event) {
  if (event.target.classList.contains('add-column')) {
    const newColumn = document.createElement('div');
    newColumn.classList.add('column');
    newColumn.id = 'newColumn';
    newColumn.innerHTML = `
           <div class="column-icon">
              <i class="fa-regular fa-pen-to-square column-edit pointer"></i>
              <i class="fa-solid fa-xmark column-remove pointer"></i>
           </div>
           <p></p>
           <div class="placeholder"></div>
           <div class="add-card pointer">Добавить карточку</div>`;
    event.target.before(newColumn);

    columnDialog.setNewColumn();
    columnDialog.openColumnDialog();
    const columns = document.querySelectorAll('.column');
    columns.forEach((column) => {
      column.addEventListener('click', columnsEventHandler);
    });
  }
  dragDrop();
}

function addCard(event) {
  if (event.target.classList.contains('add-card')) {
    const cardDialog = document.querySelector('card-dialog');
    cardDialog.setNewCard();
    const cardModal = document.querySelector('.card-modal');
    cardModal.classList.remove('hide');
    addBlurBoardBox();
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
  if (
    document.querySelector('card-dialog').querySelector('.card-title').value ==
      '' &&
    document.querySelector('.textarea-description').value == '' &&
    document.querySelector('.list-title').value == '' &&
    document.querySelectorAll('.list-item-description').length == 0
  ) {
    document.getElementById('new').remove();
  } else {
    const cardModal = document.querySelector('card-dialog');
    if (document.querySelector('#new')) {
      cardModal.saveNewCard();
    } else {
      cardModal.saveOldCard();
    }
  }
}

function hideCardModal() {
  document.querySelector('.clarification-block').classList.add('hide');
  document.querySelector('.card-modal').classList.add('hide');
  document.querySelector('.card-modal').classList.remove('blur');
  removeBlurBoardBox();
}

function hideQuestionBlock() {
  document.querySelector('.question-block').classList.add('hide');
  document.querySelector('.question-board').classList.add('hide');
  document.querySelector('.question-column').classList.add('hide');
  document.querySelector('.question-card').classList.add('hide');
  removeBlurBoardBox();
}

function removingBoard(boardRemoving) {
  const boardBoxRemoving = document.querySelector(`.${boardRemoving.id}`);
  boardRemoving.remove();
  boardBoxRemoving.remove();
  removeActiveBoard(boardRemoving.id);
  if (document.querySelectorAll('.board').length > 0) {
    const activeBoard = document.querySelectorAll('.board')[0];
    updateActiveBoard(activeBoard);
  }
}

function removingColumn(removingColumn) {
  removingColumn.remove();
  removeActiveColumn(removingColumn.id);
}

function removingCard(removingCard) {
  removingCard.remove();
  removeActiveCard(removingCard.id);
}

function checkBeforeDeleting(removingObject) {
  document.querySelector('.question-block').addEventListener(
    'click',
    (event) => {
      if (event.target.classList.contains('yes')) {
        !document.querySelector('.question-board').classList.contains('hide')
          ? removingBoard(removingObject)
          : !document
              .querySelector('.question-column')
              .classList.contains('hide')
          ? removingColumn(removingObject)
          : removingCard(removingObject);
        hideQuestionBlock();
      }
      if (event.target.classList.contains('no')) {
        hideQuestionBlock();
      }
    },
    { once: true }
  );
}

function columnsEventHandler(event) {
  const activeColumn = event.target.closest('.column');
  const idActiveColumn = activeColumn.id.split('-')[1];
  const boardActiveColumn = document.querySelector('.active').id;
  const orderActiveColumn =
    [...document.querySelector(`.${boardActiveColumn}`).children].findIndex(
      (item) => item.id == activeColumn.id
    ) + 1;
  if (event.target.classList.contains('column-edit')) {
    columnDialog.setOldColumn(
      idActiveColumn,
      orderActiveColumn,
      event.target.parentElement.nextElementSibling.textContent,
      boardActiveColumn.split('-')[1]
    );
    columnDialog.openColumnDialog();
  }
  if (event.target.classList.contains('column-remove')) {
    if (activeColumn.children[2].children.length > 0) {
      addBlurBoardBox();
      document.querySelector('.question-block').classList.remove('hide');
      document.querySelector('.question-column').classList.remove('hide');
      checkBeforeDeleting(activeColumn);
    } else {
      activeColumn.remove();
      removeActiveColumn(activeColumn.id);
    }
  }
  if (event.target.classList.contains('add-card')) {
    addCard(event);
  }
}
