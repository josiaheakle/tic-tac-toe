
// Game Tile Object
// Stores ID and if the tile has been marked

const GameTile = (idIn) => {
    const id = idIn;
    let marked;
    let markStr;

    const getId = () => {
        return id;
    };
    const isMarked = () => {
        return marked;
    };
    const setMark = (str) => {
        if(!marked) {
            markStr = str;
            marked = true;
            return true;
        } return false;
    };
    const getMarkStr = () => {
        return markStr;
    };
    return {getId, isMarked, setMark, getMarkStr}
};


const Player = (playerName, playerNum) => {

    const _name = playerName;
    const _num = playerNum;

    const getName = () => {
        return _name;
    };
    const getNum = () => {
        return _num;
    };

    return { getName, getNum }

}

// GameBoard Module
// gameDiv - HTML element used to draw game on screen
// gameboard array of gametiles
// _getTileIndexById() - used by markTile to get gameboardTileIndex
// _makeBoardArray() - creates the gameboard array
// markTile(tileId, player) - marks requested tile x or o
//      if player1 - x | if player2 - o
//      calls gameTile setMark and isMark


const GameBoard = (function() {

    const gameDiv = document.querySelector('#game-container')
    const gameboard = _makeBoardArray();

    function _getTileIndexById(ID) {
        for(let index = 0; index < 9; index++) {
            let tile = gameboard[index]
            console.log(`TILE ID: ${tile.getId()} index: ${index}`)
            if(tile.getId() == ID) { 
                console.log(`TILE FOUND ${ID}`);
                return index;
            }
        }

    }

    function _makeBoardArray() {
        console.log(`CREATING GAME BOARD`)
        let gb = [];
        let columnCounter = -1;
        let rowCounter = 0;
        for(let i=0; i<9; i++) {
            if(i%3 == 0) columnCounter++;
            rowCounter = i%3;
            gameTile = GameTile(`${columnCounter}-${rowCounter}`)
            gb.push(gameTile);
        }
        return gb;
    }

    function markTile(tileId, player) {
        // If player == 1 : draw an X 
        // If player == 2 : draw a  O
        let mark = '';
        if      (player == 1) mark = 'X'
        else if (player == 2) mark = 'O'
        else                  console.log(`ERROR: PLAYER NOT PROPERLY DECLARED`)
        const index = _getTileIndexById(tileId);
        gameTiles.forEach(tile => {
            if(tile.id == tileId && !gameboard[index].isMarked()) {
                gameboard[index].setMark(mark);
                GraphicController.markTile(tileId, mark)
                return true;
            } else if (tile.id == tileId && gameboard[index].isMarked()) {
                console.log(`TILE (${tileId}) already marked!`)
                return false;
            }
        });
    }

    function playerTurn(playerNum) {
        gameTiles = gameDiv.querySelectorAll('div')
        gameTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                if(markTile(tile.id, playerNum)) console.log(`NEXT TURN`);
                else console.log(`AGAIN`);
            });
        });
    }

    return {

        gameboard: gameboard,
        markTile: markTile,
        playerTurn: playerTurn,
        
    };

})();

// Creates gameboard on HTML document
// markTile() - marks the proper tile on the html element

const GraphicController = (function() {
    const gameDiv = document.querySelector('#game-container')
    function drawBoard(gameboard) {
        // Draws tic tac toe lines
        console.log(`Drawing Board`)
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
            gameDiv.appendChild(tile);
        });
    }

    function markTile(tileId, mark) {
        const gameTiles = gameDiv.querySelectorAll('div');
        gameTiles.forEach(tile => {
            if(tile.id == tileId) {
                markPara = document.createElement('p');
                markPara.style.fontSize = '5em';
                markPara.style.margin = '0'
                markPara.style.alignSelf = 'center'
                markPara.style.justifySelf = 'center'
                markPara.textContent = mark;
                tile.appendChild(markPara);
            }
        });
    }


    return {
        drawBoard: drawBoard,
        markTile: markTile,
    }

})();

function playGame() {

    GraphicController.drawBoard(GameBoard.gameboard);
    const player1 = Player('me', 1)
    GameBoard.playerTurn(player1.getNum());

}

playGame();