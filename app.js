// GAME LOGIC

// const { get } = require("prompt");


// GAMEBOARD 

// Handles all gameboard functions like displaying the board
// and placing tokens from players

const Gameboard = (function(){
    const board = [];
    
    const rows = 3;
    const cols = 3;
    // let counter = 0

    for(let i = 0; i < rows; i++){
        for(let i = 0; i < cols; i++){
            board.push('')
            // counter ++;
        }
    }
    
    const getBoard = () => board;

    const placeToken = (player, position) => {
        const board = getBoard();
        board[position] = player.token;
        return board
    }

    const cellTaken = (board, cell) => {
        if (board[cell] != ''){
            return true;
        } else {
            return false;
        }
    }


    const allCellsFilled = (board) => {
        for(const cell of board) {
            if (cell === ""){
                return false;
            }
        }
        return true
    }

    const refreshBoard = () => {
        for (let i = 0; i < board.length; i++){
            board[i] = "";
        }
    }

    return {
        getBoard,
        placeToken,
        allCellsFilled,
        cellTaken,
        refreshBoard,
       
    }
})();



// PLAYERS
const Players = (name, token, score) => {
    return {name, token, score}
}

const playerX = Players('player X', 'x', 0);
const playerO = Players('player O', 'O', 0);




// CONTROLLER 
const GameController = (function(){     
    const board = Gameboard;

    const currentBoard = Gameboard.getBoard()

    let activePlayer = playerX;
    
    const switchActivePlayer = () => {
        activePlayer = activePlayer === playerX ? playerO : playerX;
    };

    const getActivePlayer = () => activePlayer;
    
    const win = (board, player) => {
        if (board[0] === player && board[1] === player && board[2] === player){
            return true;
        } else if (board[3] === player && board[4] === player && board[5] === player) {
            return true;
        } else if (board[6] === player && board[7] === player && board[8] === player) {
            return true;
        } else if (board[0] === player && board[3] === player && board[6] === player) {
            return true;
        } else if (board[1] === player && board[4] === player && board[7] === player) {
            return true;
        } else if (board[2] === player && board[5] === player && board[8] === player) {
            return true;
        } else if (board[4] === player && board[0] === player && board[8] === player) {
            return true;
        } else if (board[2] === player && board[4] === player && board[6] === player) {
            return true;
        } else {
            return false;
        }
    }

    const isWon = () => win(currentBoard, getActivePlayer().token);

    const isDraw = () => Gameboard.allCellsFilled(currentBoard);



    const scoreControl = (player) => {
        if(isWon) {
           return player.score += 1;
        } else {
            return player.score
        }
    }

    const getScore = () => scoreControl(getActivePlayer().score);
    
    const printNewTurn = () => {
    //    console.log (board.getBoard());
    //    console.log(`${getActivePlayer().name}'s turn`)
    }
    const inPlay = () => {
        if (isWon() || isDraw()) {
            // console.log('Game no longer in play')
            return false;
        }
        // console.log('still in play')
        return true;
    }

    const getInPlay = () => inPlay()


    const playRound = (position) => {

        const isCellTaken = Gameboard.cellTaken(currentBoard, position)
        

        if(!(isCellTaken)){
            board.placeToken(getActivePlayer(), position);
            if(isWon()){
                // console.log(board.getBoard());
                // console.log(`${getActivePlayer().name} Wins!!!`)
                scoreControl(getActivePlayer())
                inPlay();
                // board.refreshBoard();
            } else if (isDraw()){
                // console.log(board.getBoard());
                // console.log("TIE GAME")
                inPlay();
                // board.refreshBoard();
            }else {
                inPlay()
                switchActivePlayer();
                printNewTurn();
            }
        } else {
            console.log(`That cell is already occupied, play again`)
        } 
        
    }

   

   

    console.log("Welcome to Tic-Tac-Toe")
    console.log("")
    printNewTurn()


    return {
       playRound,
       getActivePlayer,
       currentBoard,
       getScore,
       getInPlay,
       isWon,

    };

})();


//UI Controller

const ScreenController = (function () {

    const game = GameController;
    const boardDiv = document.querySelector('.board');
    const overlayDiv = document.querySelector('.overlay');
    const winnerDiv = document.querySelector('.winner');  
    const xScore = document.querySelector(".x-score-figure");
    const oScore = document.querySelector(".o-score-figure");
    const playerTurnDiv = document.querySelector('.turn');

    function updateScoreBoard(){
        xScore.textContent = playerX.score;
        oScore.textContent = playerO.score;
    }

    function displayOverlay() {
       const status = game.isWon();
    //    console.log(status);

        overlayDiv.style.display = 'block';
        displayWinner(status)
    }

    function displayWinner(status){
        const activePlayer = game.getActivePlayer()

        if(status === true){
            winnerDiv.textContent = `${activePlayer.name} Wins`;
        } else {
            winnerDiv.textContent = `it's a TIE`;
        }
    }

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.currentBoard;
        const activePlayer = game.getActivePlayer();

        //console.log(board);
        // console.log(activePlayer)

        playerTurnDiv.textContent = `${activePlayer.name}`

        if (activePlayer.token === 'x') {
            playerTurnDiv.classList.add('white') 
            playerTurnDiv.classList.remove('blue')
        } else {
            playerTurnDiv.classList.add('blue') 
            playerTurnDiv.classList.remove('white')
        }
        

        //Render Board
        for(let i = 0; i < board.length; i++){
            const cellBox = document.createElement('div')
            cellBox.classList.add("square");
            cellBox.dataset.index = i;
            cellBox.textContent = board[i];
            boardDiv.appendChild(cellBox)

        }

        // update Scoreboard;
        // console.log(`inplay = ${game.getInPlay()}`)
        updateScoreBoard();


        //conditionally display overlay
        if(!game.getInPlay()){
            displayOverlay()
        } else {
            return 
        }
       
    }

    function boardClickHandler(e) {
        const clickedcell = e.target.dataset.index;
        
        
        // console.log(clickedcell)
    
        if (!clickedcell) return;
        game.playRound(clickedcell);
        
        updateScreen()
    }    

    function overlayClickHandler(){
        overlayDiv.style.display = 'none'
        Gameboard.refreshBoard()
        updateScreen()
        // console.log('yam')
        // game.resetGameStatus();
        //refresh board
    }


    overlayDiv.addEventListener('click', overlayClickHandler)
    boardDiv.addEventListener('click', boardClickHandler);

    updateScreen()
    updateScoreBoard();

   
})()










