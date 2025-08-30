document.addEventListener('DOMContentLoaded', () => {
  // Parse JSON data from provided JS files
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Initial render
  generateUserList(userData, stocksData);

  // Buttons
  const saveButton = document.querySelector('#saveButton');
  const deleteButton = document.querySelector('#deleteButton');

  // Save user
  saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveUser(userData, stocksData);
  });

  // Delete user
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    deleteUser(userData, stocksData);
  });
});

/**
 * Loops through the users and renders a ul with li elements for each user
 */
function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  userList.innerHTML = ''; // clear old list

  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  // Event delegation: click user
  userList.addEventListener('click', (event) =>
    handleUserListClick(event, users, stocks)
  );
}

/**
 * Handles clicking a user in the list
 */
function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  const user = users.find(u => u.id == userId);

  if (user) {
    populateForm(user);
    renderPortfolio(user, stocks);
  }
}

/**
 * Populates the form with user data
 */
function populateForm(data) {
  const { user, id } = data;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

/**
 * Renders the portfolio items for the user
 */
function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  const portfolioDetails = document.querySelector('.portfolio-list');
  portfolioDetails.innerHTML = '';

  portfolio.map(({ symbol, owned }) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('portfolio-item');

    const symbolEl = document.createElement('p');
    symbolEl.innerText = symbol;

    const sharesEl = document.createElement('p');
    sharesEl.innerText = `Shares: ${owned}`;

    const actionEl = document.createElement('button');
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);

    wrapper.appendChild(symbolEl);
    wrapper.appendChild(sharesEl);
    wrapper.appendChild(actionEl);

    portfolioDetails.appendChild(wrapper);
  });

  // Event delegation: click stock "View" button
  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

/**
 * Displays stock info for the clicked stock
 */
function viewStock(symbol, stocks) {
  const stock = stocks.find(s => s.symbol == symbol);
  if (stock) {
    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;
    document.querySelector('#logo').src = `logos/${symbol}.svg`;
  }
}

/**
 * Saves updated user info
 */
function saveUser(users, stocks) {
  const id = document.querySelector('#userID').value;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      users[i].user.firstname = document.querySelector('#firstname').value;
      users[i].user.lastname = document.querySelector('#lastname').value;
      users[i].user.address = document.querySelector('#address').value;
      users[i].user.city = document.querySelector('#city').value;
      users[i].user.email = document.querySelector('#email').value;

      generateUserList(users, stocks);
      break;
    }
  }
}

/**
 * Deletes selected user
 */
function deleteUser(users, stocks) {
  const userId = document.querySelector('#userID').value;
  const index = users.findIndex(u => u.id == userId);

  if (index > -1) {
    users.splice(index, 1);
    generateUserList(users, stocks);

    // Clear form & portfolio
    document.querySelector('#userForm').reset();
    document.querySelector('.portfolio-list').innerHTML = '';
  }
}


