import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  function getClass(props) {
    if (props.isWinner) {
      return 'square square-winner';
    }
    return 'square';
  }

  return (
    <button className={getClass(props)} onClick={props.onClick}>
      {props.value}
    </button>
    );
}

class Board extends React.Component {
  isWinner(i) {
    if (this.props.winner) {
      return this.props.winner.line.includes(i);
    }
    return false;
  }

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={this.isWinner(i)}
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
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // Ignore click if square is filled or winner determined
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // Update state
    this.setState({
      history: history.concat([{
        squares:squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reset() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Create a list of buttons for each move in history
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (this.state.stepNumber === 9) {
      status = "It's a draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let resetBtn;    
    if (this.state.stepNumber === 9 || winner) {
      resetBtn = (
        <button onClick={() => this.reset()}>
          New Game
        </button>
        );
    }

    return (
      <div className="game">
      <div className="game-board">
      <Board 
        squares={current.squares}
        onClick={(i) => this.handleClick(i)}
        winner={winner}
      />
      </div>
      <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol>
      <div>{resetBtn}</div>
      </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


//----- Helper Functions ------//

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i],
      };
    }
  }
  return null;
}