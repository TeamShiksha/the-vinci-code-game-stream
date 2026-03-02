import './styles.css';
/*
1. Get the user's name
2. Show a menu
3. Menu items:
  a. Start New Game
  b. See Leaderboard
  c. Update Name
*/
const myGameContainer = document.getElementById('game');

class Game {
  constructor(container) {
    this.container = container;
    this.numberModal = document.getElementById('numberModal');
    this.numberDisplay = this.numberModal.querySelector('.number-display');
    this.inputInterface = document.getElementById('inputInterface');
    this.numberInputs = this.inputInterface.querySelector('.number-inputs');
    this.submitBtn = document.getElementById('inputSubmitBtn');
    this.nameModal = document.getElementById('nameModal');
    this.nameInput = document.getElementById('nameInput');
    this.nameSubmitBtn = document.getElementById('nameSubmitBtn');
    this.scoreModal = document.getElementById('scoreModal');
    this.scoreDisplay = this.scoreModal.querySelector('.score-display');
    this.playAgainBtn = document.getElementById('playAgainBtn');
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  async promptName(message) {
    return new Promise((resolve) => {
      this.nameModal.querySelector('h2').textContent = message;
      this.nameInput.value = '';
      this.nameModal.classList.add('active');

      const onSubmit = () => {
        const name = this.nameInput.value.trim() || 'Guest';
        this.nameModal.classList.remove('active');
        this.nameSubmitBtn.removeEventListener('click', onSubmit);
        this.nameInput.removeEventListener('keydown', onKeydown);
        resolve(name);
      };

      const onKeydown = (e) => {
        if (e.key === 'Enter') onSubmit();
      };

      this.nameSubmitBtn.addEventListener('click', onSubmit);
      this.nameInput.addEventListener('keydown', onKeydown);
    });
  }

  async start() {
    this.name = await this.promptName('Enter your name:');
    this.displayMenu();
  }

  handleMenuClick = function (event) {
    switch (event.target.dataset?.val) {
      case '1':
        this.updateLevel(1);
        this.gameLoop();
        break;
      case '2':
        console.log('Will Show Leaderboard Now...');
        break;
      case '3':
        this.promptName('Enter name to be updated:').then((name) => {
          this.name = name;
          this.displayMenu();
        });
    }
  }.bind(this);

  displayMenu() {
    document.querySelector('.username').innerText = `${this.name}`;
    this.container.addEventListener('click', this.handleMenuClick);
  }

  updateLevel(level = 1) {
    this.generatedNumbers = [];
    this.enteredNumbers = [];
    this.level = level;
  }

  generateNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      this.generatedNumbers.push(this.randomNumber());
    }
  }

  async showNumber(number) {
    return new Promise((resolve) => {
      this.numberDisplay.textContent = number;
      this.numberModal.classList.add('active');

      setTimeout(() => {
        this.numberModal.classList.remove('active');
        setTimeout(resolve, 500);
      }, 1000);
    });
  }

  async displayNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      await this.showNumber(this.generatedNumbers[i]);
    }
  }

  createInputFields() {
    this.numberInputs.innerHTML = '';
    for (let i = 0; i < this.level; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '9';
      input.required = true;
      input.dataset.index = i;
      this.numberInputs.appendChild(input);
    }
  }

  async getNumbersFromUser() {
    return new Promise((resolve) => {
      this.createInputFields();
      this.inputInterface.classList.add('active');

      const onSubmit = () => {
        const inputs = this.numberInputs.querySelectorAll('input');
        this.enteredNumbers = Array.from(inputs).map((input) => {
          const value = input.value;
          return value === '' ? NaN : Number(value);
        });
        this.submitBtn.removeEventListener('click', onSubmit);
        resolve();
      };

      this.submitBtn.addEventListener('click', onSubmit);
    });
  }

  verifyLevel() {
    for (let i = 0; i < this.level; i++) {
      if (this.enteredNumbers[i] !== this.generatedNumbers[i]) return false;
    }
    return true;
  }

  async showScore(score) {
    return new Promise((resolve) => {
      this.scoreDisplay.textContent = `Your score is: ${score}`;
      this.scoreModal.classList.add('active');

      const onPlayAgain = () => {
        this.scoreModal.classList.remove('active');
        this.playAgainBtn.removeEventListener('click', onPlayAgain);
        resolve();
      };

      this.playAgainBtn.addEventListener('click', onPlayAgain);
    });
  }

  async gameLoop() {
    this.generateNumbersForLevel();
    await this.displayNumbersForLevel();
    await this.getNumbersFromUser();
    this.inputInterface.classList.remove('active');
    if (this.verifyLevel()) {
      this.updateLevel(this.level + 1);
      await this.gameLoop();
    } else {
      await this.showScore(this.level);
    }
  }
}

let myGameInstance = new Game(myGameContainer);
myGameInstance.start();
document
  .querySelector('.fa-pen-to-square')
  .addEventListener('click', myGameInstance.handleMenuClick);
