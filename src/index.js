import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const color = props.value==='X' ? '#192' : '#b23';
  let bkgr;
  if (props.winner) {
    bkgr = '#fff'
  } else {
    bkgr = props.xIsNext ? 'rgba(17,153,34,.2)' : 'rgba(187,34,51,.2)';
  }
  return (
    <button className="square" 
      style = {{color:color, background:bkgr}} 
      onClick={props.onClick}
    >
       {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        xIsNext = {this.props.xIsNext}
        winner = {this.props.winner}
      />
    );
  }

  render() {
    const winner = this.props.winner;
    const color = winner === 'X' ? '#192' : ('O' ? '#b23' : '#fff');
    return(
      <div className="board">
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
          {winner && winner !== 'draw' &&
            <div className="board-winner">
              <p className="board-winner-text" style = {{color:color}}>
                {winner}
              </p>  
            </div>
          }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, 
                           this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([squares]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current);
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current}
            onClick = {(i) => this.handleClick(i)}
            winner = {winner}
            xIsNext = {this.state.xIsNext}
          />
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
  for (const line of lines ) {
    const [a,b,c] = line;
    if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
      return squares[a];
    }
  }
  if (squares.every((x)=>x)) {
    return 'draw';
  }
  return null;
}
