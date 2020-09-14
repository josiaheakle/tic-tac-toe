
// Game Tile Object
// Stores ID and if the tile has been marked

const GameTile = (idIn) => {

    // console.log(`GAMETILE MAKE`)

    const id = idIn;
    let marked = false;
    let markStr = '0';
    
    const getId = () => {
        return id;
    };
    function isMarked() {
        return marked;
    };
    function setMark(str) {
        if(!marked) {
            markStr = str;
            marked = true;
            return true;
        } return false;
    };
    function getMarkStr() {
        return markStr;
    };
    return {getId, isMarked, setMark, getMarkStr}
};

// Player object 

const Player = (playerName, playerNum) => {
    const _name = playerName;
    const _num = playerNum;
    let _score = 0;
    const getName = () => {
        return _name;
    };
    const getNum = () => {
        return _num;
    };
    const getScore = () => {
        return _score;
    };
    const upScore = () => {
        _score++;
    }
    return { getName, getNum, getScore, upScore }
}

// Controls flow of modules

const PlayGame = (function() {

    // Array of up to 2 players
    let _players = [];
    let _playerAmt = 0;
    let _playerTurn = 2;
    let _turnNum = 0;
    let _winNum = 0;

    // Checks if game is ready to be played (proper amount of players)
    // If so run the proper game function
    function gameReady() {

        // console.log(`Players amt ${_players.length}\n_playerAmt: ${_playerAmt}`)
        _turnNum = 0;
        _winNum = 0;

        let oneOrTwo = Math.floor(Math.random() * 2) + 1

        _playerTurn = oneOrTwo;

        if(_players.length > 0) {
            if(_playerAmt == 1) _onePlayerGame();
            else if (_playerAmt == 2) {
                _twoPlayerGame();
            }
        } else {
            // console.log('not ready')
        }
    }

    function initPlayers(playerAmt) {
        _playerAmt = playerAmt;
        _players = [];
        GraphicController.clearNameElements();
        InputController.emptyPlayers();
        InputController.makePlayers(playerAmt);
        
    }

    function setPlayers(players) {
        for(let i=0; i<players.length; i++)
            _addPlayer(players[i])
    }

    function getPlayers() {
        return _players;
    }

    function nextTurn() {
        

        if(_turnNum > 4)
            _winNum = _checkWinner();

        if(_turnNum == 9 && _winNum == 0) {
            _winNum = -1
        }

        if(_winNum !== 0) {
            if(_winNum !== -1)
                _players[_winNum-1].upScore()
            GraphicController.declareWinner(_winNum)
        } else {

            (_playerTurn == 2) ? _playerTurn = 1: _playerTurn = 2;
            _turnNum ++;
            GraphicController.clearNameElements();
            GraphicController.printPlayerTurn(_playerTurn);
            if(_playerAmt == 1 && _playerTurn == 2) {
                _cpuTurn();
            } else {
                InputController.gameTileClick(_playerTurn);
            }

        }


    }

    function _addPlayer(player) {
        _players.push(player);
    }

    function _onePlayerGame() {
        GameBoard.resetBoard();
        gameWon = false;
        _addPlayer(Player('CPU', 2))
        GraphicController.showScores();
        GraphicController.drawBoard(GameBoard.gameboard);
        nextTurn();

    }

    function _twoPlayerGame() {

        GameBoard.resetBoard();
        gameWon = false;
        GraphicController.showScores();
        GraphicController.drawBoard(GameBoard.gameboard);
        nextTurn();


    }

    function _cpuTurn() {

        let availableTileAmt = (10 - _turnNum);
        let _possibleTiles = GameBoard.getAvailableTiles();
        let chosenTile = Math.floor(Math.random() * availableTileAmt)

        if(GameBoard.markTile(_possibleTiles[chosenTile], 2)) {
            // console.log(`CPU CHOSEN tile ${_possibleTiles[chosenTile]}`)
            PlayGame.nextTurn();
        } else {
            // console.log(`${_possibleTiles[chosenTile]} NOT AVAILABLE`)
        }



        
        // console.log(`CPU TURN ${chosenTile}`)
        // nextTurn();
    }

    function _checkWinner() {

        // console.log(`CHECKING WINNER`)

        // Horizontal
        for(let i=0; i<=6; i+=3) {
            let mark1 = GameBoard.getMarkByIndex(i);
            let mark2 = GameBoard.getMarkByIndex(i+1);
            let mark3 = GameBoard.getMarkByIndex(i+2);
            if(mark1 == mark2 && mark2 == mark3 && mark1 !== '0') {
                // console.log(`HORIZONTAL WIN STARTING WITH ${GameBoard.gameboard[i].getId()}`)

                if(mark1 == 'X') return 1
                else if(mark1 == 'O') return 2
            }
        }

        // Vertical
        for(let i=0; i<=2; i++) {
            let mark1 = GameBoard.getMarkByIndex(i);
            let mark2 = GameBoard.getMarkByIndex(i+3);
            let mark3 = GameBoard.getMarkByIndex(i+6);
            if(mark1 == mark2 && mark2 == mark3 && mark1 !== '0') {
                // console.log(`vertical WIN STARTING WITH ${GameBoard.gameboard[i].getId()}`)

                if(mark1 == 'X') return 1
                else if(mark1 == 'O') return 2
            }
        }


        // Diagonal
        if(GameBoard.getMarkByIndex(0) == GameBoard.getMarkByIndex(4)
            && GameBoard.getMarkByIndex(4) == GameBoard.getMarkByIndex(8)
            && GameBoard.getMarkByIndex(0) !== '0') {
                // console.log(`DIAGONAL WIN STARING WITH ${GameBoard.gameboard[0].getId()}`)

                if(GameBoard.getMarkByIndex(0) == 'X') return 1
                else if(GameBoard.getMarkByIndex(0) == 'O') return 2
        }

        else if(GameBoard.getMarkByIndex(2) == GameBoard.getMarkByIndex(4)
        && GameBoard.getMarkByIndex(4) == GameBoard.getMarkByIndex(6)
        && GameBoard.getMarkByIndex(2) !== '0') {
            // console.log(`DIAGONAL WIN STARING WITH ${GameBoard.gameboard[2].getId()}`)

            if(GameBoard.getMarkByIndex(2) == 'X') return 1
            else if(GameBoard.getMarkByIndex(2) == 'O') return 2
        }
        return 0;

    }

    return {
        initPlayers: initPlayers,
        setPlayers: setPlayers,
        getPlayers: getPlayers,
        gameReady: gameReady,
        nextTurn: nextTurn,
    }

})();

// InputController Module
// handles DOM input

const InputController = (function() {
    
    const _buttons = document.querySelector('#bottom-half').querySelectorAll('button');
    const _gameDiv = document.querySelector('#game-container')
    const _nameDiv = document.querySelector('#name-container')
    let _players = [];


    // Adds listeners to menu buttons (always active)
    const _buttonListener = (function() {
        _buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                switch(btn.id) {
                    case('one-player-button'):
                        PlayGame.initPlayers(1);
                        break;
                    case('two-player-button'):
                        PlayGame.initPlayers(2);
                        break;
                }
            });
        });
    })();

    function playAgainListener() {
        let againBtn = _nameDiv.querySelector('#play-again-btn')
        againBtn.addEventListener('click', function() {
            GraphicController.clearNameElements();
            PlayGame.gameReady();
        });
    }

    function emptyPlayers() {
        _playerNum = 1;
        _players = [];
    }

    // Creates a player object

    let _playerNum = 1;
    function makePlayers (playerAmt) {
        GraphicController.getName(_playerNum);

        const submit = _nameDiv.querySelector('#submit-name')
        submit.addEventListener('click', function() {

            const nameInput = _nameDiv.querySelector('#name-input').value;
            GraphicController.clearNameElements();
            if(nameInput == '' || nameInput == undefined) {
                makePlayers(playerAmt);
            } else {
                player = Player(nameInput, _playerNum)
                _players.push(player);
                _playerNum ++;
                if(_players.length == playerAmt) {
                    PlayGame.setPlayers(_players)
                    PlayGame.gameReady();
                } else {
                    makePlayers(playerAmt);
                }
            }
        });
    }

    function gameTileClick (playerNum) {
        let clicked = false;
        const gameTiles = _gameDiv.querySelectorAll('div')
        gameTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                if(!clicked) {
                    if(GameBoard.markTile(tile.id, playerNum)) {
                        clicked = true;
                        // console.log(`CLICK`)
                        PlayGame.nextTurn();
                    }
                }
            });
        });
    };

    return { 
        gameTileClick: gameTileClick,
        makePlayers: makePlayers,
        emptyPlayers: emptyPlayers,
        playAgainListener: playAgainListener,
    }


})();

// GameBoard Module
// gameDiv - HTML element used to draw game on screen
// gameboard array of gametiles
// _getTileIndexById() - used by markTile to get gameboardTileIndex
// _makeBoardArray() - creates the gameboard array
// markTile(tileId, player) - marks requested tile x or o
//      if player1 - x | if player2 - o
//      calls gameTile setMark and isMark


const GameBoard = (function() {

    const _gameDiv = document.querySelector('#game-container')
    let gameboard = _makeBoardArray();

    function _getTileIndexById(ID) {
        for(let index = 0; index < 9; index++) {
            let tile = gameboard[index]
            if(tile.getId() == ID) { 
                return index;
            }
        }

    }

    function _makeBoardArray() {
        // console.log(`CREATING GAME BOARD ARRAY`)
        const gb = [];
        let columnCounter = -1;
        let rowCounter = 0;
        for(let i=0; i<9; i++) {
            if(i%3 == 0) columnCounter++;
            rowCounter = i%3;
            const gameTile = GameTile(`${columnCounter}-${rowCounter}`)
            gb.push(gameTile);
        }
        return gb;
    }

    // Resets board array and calls clear board

    function resetBoard() {
        gameboard = _makeBoardArray();
        GraphicController.clearBoard();
    }

    function getAvailableTiles () {
        let tiles = [];
        gameboard.forEach(tile => {
            if(tile.getMarkStr() == '0') tiles.push(tile.getId());
        });
        return tiles;
    }

    // Marks repective tile as marked,
    // calls GraphicControler mark tile to show on DOM

    function markTile(tileId, player) {
        // If player == 1 : draw an X 
        // If player == 2 : draw a  O
        const gameTiles = _gameDiv.querySelectorAll('div')
        let mark = '';
        let markWork = false;
        if      (player == 1) mark = 'X'
        else if (player == 2) mark = 'O'
        // else                  console.log(`ERROR: PLAYER NOT PROPERLY DECLARED`)
        const index = _getTileIndexById(tileId);
        gameTiles.forEach(tile => {
            if(tile.id == tileId && !gameboard[index].isMarked()) {
                gameboard[index].setMark(mark);
                GraphicController.markTile(tileId, mark)
                markWork = true;
            } else if (tile.id == tileId && gameboard[index].isMarked()) {
                // console.log(`TILE (${tileId}) already marked!`)
            }
        });
        return markWork;
    }

    function getMarkByIndex(index) {
        return gameboard[index].getMarkStr();
    }

    function printGameBoardTiles() {
        gameboard.forEach(tile=> {
            // console.log(`${tile.getId()} has mark ${tile.getMarkStr()} and bool is ${tile.isMarked()} `)
        });
    }


    return {

        gameboard: gameboard,
        markTile: markTile,
        resetBoard: resetBoard,
        printGameBoardTiles: printGameBoardTiles,
        getMarkByIndex: getMarkByIndex,
        getAvailableTiles: getAvailableTiles,

    };

})();

// Creates gameboard on HTML document
// markTile() - marks the proper tile on the html element

const GraphicController = (function() {

    const _gameDiv = document.querySelector('#game-container')
    const _nameDiv = document.querySelector('#name-container')
    const _playerOneDiv = document.querySelector('#player-one-container')
    const _playerTwoDiv = document.querySelector('#player-two-container')

    // Parameter - gameboard array
    // Draws gameboard onto DOM
    function drawBoard(gameboard) {
        // Draws tic tac toe lines
        // console.log(`Drawing Board`)
        gameboard.forEach(gametile => {
            const tile = document.createElement('div')
            tile.id = gametile.getId();
            if(tile.id.includes('0-') || tile.id.includes('1-')) {
                tile.style.borderBottom = 'solid 1px #023047'
            }
            if(tile.id.includes('-0') || tile.id.includes('-1')) {
                tile.style.borderRight = 'solid 1px #023047'
            }
            tile.style.display = 'flex'
            tile.style.flexDirection = 'column'
            tile.style.justifyContent = 'center'
            tile.style.alignContent = 'center'
            _gameDiv.appendChild(tile);
        });
    }

    // Draws marked tile as X or O repectivly on DOM
    function markTile(tileId, mark) {
        const gameTiles = _gameDiv.querySelectorAll('div');
        gameTiles.forEach(tile => {
            if(tile.id == tileId) {
                markPara = document.createElement('p');
                // markPara.style.fontSize = '5em';
                markPara.style.margin = '0'
                markPara.style.alignSelf = 'center'
                markPara.style.justifySelf = 'center'
                markPara.textContent = mark;
                tile.appendChild(markPara);
            }
        });
    }

    // Prints whose turn it is in nameDiv
    function printPlayerTurn(playerNum) {
        const _players = PlayGame.getPlayers();
        playerName = _players[playerNum-1].getName();

        turnStr = document.createElement('h2');
        turnStr.textContent = `${playerName}, you're up!`;
        turnStr.className = 'name-input'
        turnStr.style.alignSelf = 'center'

        _nameDiv.appendChild(turnStr)


    }

    function declareWinner(playerNum) {

        clearNameElements();
        
        winStr = document.createElement('h2')
        if(playerNum !== -1)
            winStr.textContent = `${PlayGame.getPlayers()[playerNum-1].getName()} wins!`
        else
            winStr.textContent = 'Tie'
        winStr.className = 'name-input'
        winStr.style.alignSelf = 'center'
        winStr.style.marginBottom = '1vh'

        showScores();

        _nameDiv.appendChild(winStr)

        _playAgain()

    }

    function _removeOldScores() {
        let p1Delete = _playerOneDiv.querySelectorAll('h2')
        let p2Delete = _playerTwoDiv.querySelectorAll('h2')
        p1Delete.forEach(element => {
            _playerOneDiv.removeChild(element)
        });
        p2Delete.forEach(element => {
            _playerTwoDiv.removeChild(element)
        });
    }

    function showScores() {

        _removeOldScores();

        const _players = PlayGame.getPlayers();
        
        let p1Name = document.createElement('h2')
        p1Name.textContent = _players[0].getName();
        let p1Score = document.createElement('h2')
        p1Score.textContent = _players[0].getScore(); 
        // console.log(`PLAYER ONE : ${_players[0].getScore()}`)
        p1Name.style.alignSelf = 'center'
        p1Score.style.alignSelf = 'center'

        _playerOneDiv.appendChild(p1Name)
        _playerOneDiv.appendChild(p1Score)

        let p2Name = document.createElement('h2')
        p2Name.textContent = _players[1].getName();
        let p2Score = document.createElement('h2')
        p2Score.textContent = _players[1].getScore(); 
        // console.log(`PLAYER TWO : ${_players[1].getScore()}`)

        p2Name.style.alignSelf = 'center'
        p2Score.style.alignSelf = 'center'

        _playerTwoDiv.appendChild(p2Name)
        _playerTwoDiv.appendChild(p2Score)


    }

    // Creates name input form 
    function getName(playerNum) {
        let nameInput = document.createElement('input')
        let nameLabel = document.createElement('label')
        let submit    = document.createElement('button')

        nameLabel.for = 'name-input'
        nameLabel.className = 'name-input'
        nameLabel.textContent = `Player ${playerNum}`
        nameLabel.style.alignSelf = 'center'

        nameInput.id = 'name-input'
        nameInput.className = 'name-input'
        nameInput.type = 'text'
        nameInput.maxLength = '10'
        nameInput.style.width = '80%'
        nameInput.style.height = '4vh'
        nameInput.style.alignSelf = 'center'

        submit.id = 'submit-name'
        submit.className = 'name-input'
        submit.textContent = 'Submit'
        submit.style.width = '50%'

        _nameDiv.appendChild(nameLabel)
        _nameDiv.appendChild(nameInput)
        _nameDiv.appendChild(submit)

    }

    function _playAgain() {
        const playAgainBtn = document.createElement('button')
        playAgainBtn.id = 'play-again-btn'
        playAgainBtn.className = 'name-input'
        playAgainBtn.textContent = 'Play Again'
        playAgainBtn.style.width = '50%'
        playAgainBtn.style.marginTop = '2vh'

        _nameDiv.appendChild(playAgainBtn)
        InputController.playAgainListener()
    }

    // Removes board from DOM
    function clearBoard() {
        const tiles = _gameDiv.querySelectorAll('div');
        tiles.forEach(tile => {
            _gameDiv.removeChild(tile);
        });
    }

    // Removes Name input form
    function clearNameElements() {
        elements = _nameDiv.querySelectorAll('.name-input');
        elements.forEach(el => {
            _nameDiv.removeChild(el);
        });
    }

    // ALL METHODS PUBLIC
    return {
        drawBoard: drawBoard,
        markTile: markTile,
        getName: getName,
        printPlayerTurn: printPlayerTurn,
        showScores: showScores,
        clearBoard: clearBoard,
        clearNameElements: clearNameElements,
        declareWinner: declareWinner,
    }

})();
