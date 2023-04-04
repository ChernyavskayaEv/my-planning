(async () => {
  const boards = await fetch('/boards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }).then((res) => res.json());

  boards.forEach((item) => {
    const receivedBoard = document.createElement('div');
    receivedBoard.id = `br-${item.id}`;
    receivedBoard.style.backgroundImage = item.background;

    const receivedBoardBox = document.createElement('div');
    receivedBoardBox.classList.add(
      'board-box',
      `br-${item.id}`,
      'animate__animated'
    );
    receivedBoardBox.innerHTML = `<div class="add-column pointer">Добавить колонку</div>`;

    if (item.active) {
      receivedBoard.classList.add('board', 'active');
      receivedBoard.innerHTML = `
            <div class="board-icon pointer">
            <i class="fa-regular fa-pen-to-square board-edit"></i>
            <i class="fa-solid fa-xmark board-remove"></i>
          </div>
            <p>${item.title}</p>`;
    } else {
      receivedBoard.classList.add('board');
      receivedBoard.innerHTML = `
            <div class="board-icon opacity">
            <i class="fa-regular fa-pen-to-square board-edit"></i>
            <i class="fa-solid fa-xmark board-remove"></i>
          </div>
            <p class="pointer">${item.title}</p>`;
      receivedBoardBox.classList.add('hide');
    }
    document.querySelector('.add-board').before(receivedBoard);
    document.querySelector('board-dialog').before(receivedBoardBox);
  });

  addColumn();
  // const addColumns = document.querySelectorAll('.add-column');
  // addColumns.forEach((item) => {
  //   item.addEventListener('click', addColumn);
  // });

  const gettingColumns = await fetch('/columns', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }).then((res) => res.json());

  gettingColumns.forEach((item) => {
    const receivedColumn = document.createElement('div');
    receivedColumn.classList.add('column');
    receivedColumn.id = `cl-${item.id}`;
    receivedColumn.innerHTML = `
               <div class="column-icon">
                  <i class="fa-regular fa-pen-to-square column-edit pointer"></i>
                  <i class="fa-solid fa-xmark column-remove pointer"></i>
               </div>
               <p>${item.title}</p>
               <div class="placeholder"></div>
               <div class="add-card pointer">Добавить карточку</div>`;

    document
      .querySelector(`.br-${item.board}`)
      .lastChild.before(receivedColumn);
  });

  const columns = document.querySelectorAll('.column');
  columns.forEach((column) => {
    column.addEventListener('click', columnsEventHandler);
  });
})();
