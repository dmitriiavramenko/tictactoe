import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
        className='square'
        onClick={props.onClick}
        >
        {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square // Uses state as props inside of child components and passes onClick
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} //  Binds square props.onClick with board props.onClick received from Game
      />                                    
    );
  }

 render() {
   return (
     <div>
       <div className="board-row">
         {this.renderSquare(0)}
         {this.renderSquare(1)}
         {this.renderSquare(2)}
       </div>
       <div className="board-row">
         {this.renderSquare(3)}
         {this.renderSquare(4)}
         {this.renderSquare(5)}
       </div>
       <div className="board-row">
         {this.renderSquare(6)}
         {this.renderSquare(7)}
         {this.renderSquare(8)}
       </div>
     </div>
   );
 }
}
 
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ // History to change a move (Time travel)
        squares: Array(9).fill(null) // To create array inside of a state
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0 // If step % 2 isn't equal to 0, it mean it's odd number, odd numbers are circles
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // Makes copy of the array, immutability is important!
    if (calculateWinner(squares) || squares[i]) {
      return; // Doesn't allow to change if winner was selected or square isn't null 
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // Changes state each click
    this.setState({
      history: history.concat([{ // concat() instead of push() for immutability (push changes an array itself), concat just adds
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const history = this.state.history; // Immutability is still important
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares); 

    const moves = history.map((step, move) => { // Go through whole history creating a button for new state
      const desc = move ? 'Go back to the move  #' + move : 'Go back to the beginning';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) { // If winner was received
      status = 'Player ' + winner + ' is a winner!';
    }
    else { // Null  was received 
      if (current.squares.every(function(i) {return i != null})) { // If all squares are filled, but winner is null - it's a tie
        status = `Sorry, it's a tie!`;
      }
      else {
        status = 'Next turn: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} // Reacts asks to provide "on" for event name and "handle" for method name
          />                                    
        </div> 
        <div className="game-info"> 
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }    
}
  
// Helper functions
function calculateWinner(squares) {
  const lines = [ // Successful lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) { // Goes through array of lines
    const [a, b, c] = lines[i]; 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { // If successful lines filled only with 'X' or 'O' 
      return squares[a]; // Returns winner name
    }  
  }
  
}
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);