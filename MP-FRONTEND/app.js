const boardCollection = document.querySelector('.board-collection');
const boardDialog = document.querySelector('board-dialog');
const columnDialog = document.querySelector('column-dialog');

// function dragDrop() {
//   const cards = document.querySelectorAll('card-column');
//   const placeholders = document.querySelectorAll('.placeholder');

//   for (const card of cards) {
//     card.addEventListener('dragstart', dragstart);
//     card.addEventListener('dragend', dragend);
//   }

//   function dragstart(event) {
//     event.target.classList.add('hold');
//     setTimeout(() => event.target.classList.add('hide'), 0);
//   }

//   function dragend(event) {
//     event.target.classList.remove('hold');
//     event.target.classList.remove('hide');
//     event.target.showContent();
//   }

//   for (const placeholder of placeholders) {
//     placeholder.addEventListener('dragover', dragover);
//     placeholder.addEventListener('dragenter', dragenter);
//     placeholder.addEventListener('dragleave', dragleave);
//     placeholder.addEventListener('drop', dragdrop);
//   }

//   function dragover(event) {
//     event.preventDefault();
//   }

//   function dragenter(event) {
//     event.target.classList.add('hovered');
//   }

//   function dragleave(event) {
//     event.target.classList.remove('hovered');
//   }

//   function dragdrop(event) {
//     event.target.classList.remove('hovered');
//     const card = document.querySelector('.hold');
//     if (event.target.classList.contains('placeholder')) {
//       event.target.append(card);
//     } else {
//       event.target.closest('card-column').parentElement.append(card);
//     }
//   }
// }

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

async function updateActiveBoard(idBoard) {
  const id = idBoard.split('-')[1];
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
    if (boardBox.classList.contains(`${idBoard}`)) {
      setTimeout(() => {
        boardBox.classList.remove('hide');
        boardBox.classList.add('animate__bounceInRight');
      }, 300);

      boardBox.classList.remove('animate__bounceOutLeft');
    }
  });

  await fetch('/boards', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ id }),
  });
}

async function removeActiveBoard(idBoard) {
  const id = idBoard.split('-')[1];

  await fetch(`/boards/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });
}

async function removeActiveColumn(idColumn) {
  const id = idColumn.split('-')[1];

  await fetch(`/columns/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });
}

async function removeActiveCard(idCard) {
  const id = idCard.split('-')[1];

  await fetch(`/cards/${id}`, {
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
    updateActiveBoard(activeBoard.id);

    activeBoard.classList.add('active');
    activeBoard.children[0].classList.remove('opacity');
    activeBoard.children[0].classList.add('pointer');
    activeBoard.children[1].classList.remove('pointer');
  }
  if (
    event.target.parentElement.parentElement.classList.contains('active') &&
    event.target.classList.contains('board-edit')
  ) {
    const oldBoard = event.target.parentElement.parentElement;
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
    const boardRemoving = event.target.parentElement.parentElement;
    const boardBoxRemoving = document.querySelector(`.${boardRemoving.id}`);
    if (boardBoxRemoving.children.length == 1) {
      boardRemoving.remove();
      boardBoxRemoving.remove();
      removeActiveBoard(boardRemoving.id);
      console.log(document.querySelectorAll('.board').length);
      if (document.querySelectorAll('.board').length > 0) {
        const activeBoard = document.querySelectorAll('.board')[0];
        updateActiveBoard(activeBoard.id);

        activeBoard.classList.add('active');
        activeBoard.children[0].classList.remove('opacity');
        activeBoard.children[0].classList.add('pointer');
        activeBoard.children[1].classList.remove('pointer');
      }
    } else {
      addBlurBoardBox();
      document.querySelector('.question-block').classList.remove('hide');
      document.querySelector('.question-board').classList.remove('hide');
      removingBoard(boardRemoving, boardBoxRemoving);
      closing();
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
    addColumn();
  }
});

function addColumn() {
  const addingColumns = document.querySelectorAll('.add-column');
  addingColumns.forEach((item) => {
    item.addEventListener('click', (event) => {
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
        // dragDrop();
      }
    });
  });
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
  // dragDrop();
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

function removingBoard(boardRemoving, boardBoxRemoving) {
  document.querySelector('.yes').addEventListener('click', () => {
    boardRemoving.remove();
    boardBoxRemoving.remove();
    removeActiveBoard(boardRemoving.id);
    if (document.querySelectorAll('.board') == 0) {
      updateActiveBoard(document.querySelectorAll('.board')[0].id);

      const activeBoard = document.querySelectorAll('.board')[0];
      activeBoard.classList.add('active');
      activeBoard.children[0].classList.remove('opacity');
      activeBoard.children[0].classList.add('pointer');
      activeBoard.children[1].classList.remove('pointer');
    }
    hideQuestionBlock();
  });
}

function removingColumn(event) {
  document.querySelector('.yes').addEventListener('click', () => {
    const thisColumn = event.target.parentElement.parentElement;
    thisColumn.remove();
    removeActiveColumn(thisColumn.id);
    hideQuestionBlock();
  });
}

function removingCard(event) {
  document.querySelector('.yes').addEventListener('click', () => {
    const thisCard = event.target.parentElement.parentElement.parentElement;
    thisCard.remove();
    removeActiveCard(thisCard.id);
    hideQuestionBlock();
  });
}

function closing() {
  document.querySelector('.no').addEventListener('click', () => {
    hideQuestionBlock();
  });
}

function columnsEventHandler(event) {
  const activeColumn = event.target.parentElement.parentElement;
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
      removingColumn(event);
      closing();
    } else {
      activeColumn.remove();
      removeActiveColumn(activeColumn.id);
    }
  }
  if (event.target.classList.contains('add-card')) {
    addCard(event);
  }
}
