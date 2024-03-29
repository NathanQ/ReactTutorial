import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let color;
  if (!props.last) {
    color = props.mark === 'X' ? '#192' : '#b23';
  } else {
    color = props.mark === 'X' ? '#3e7' : '#f6f';
  }
  let bkgr;
  if (props.result) {
    bkgr = '#fff';
  } else {
    bkgr = props.turn === 'X' ? 'rgba(17,153,34,.2)' : 'rgba(187,34,51,.2)';
  }
  return (
    <button className="square" 
      style = {{color:color, background:bkgr}} 
      onClick={props.onClick}
    >
       {props.mark}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        mark = {this.props.current.cells[i]}
        last = {this.props.current.last === i}
        onClick = {() => this.props.onClick(i)}
        result = {this.props.result}
        turn = {this.props.turn}
      />
    );
  }

  render() {
    const result = this.props.result;
    const color = result === 'X' ? '#192' : ('O' ? '#b23' : '#fff');
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
          {result && result !== 'draw' &&
            <div className="board-winner">
              <p className="board-winner-text" style = {{color:color}}>
                {result}
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
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.newGame = this.newGame.bind(this);
    this.state = {
      history: [{
        cells: Array(9).fill(null),
        last: null,
      }],
      stepNumber: 0,
      turn: 'X',
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, 
                           this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.cells.slice();
    if (computeResult(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.turn;
    this.setState({
      history: history.concat({cells: squares, last: i}),
      stepNumber: history.length,
      turn: this.state.turn === 'X' ? 'O' : 'X',
    });
  }

  undo() {
    this.setState({
      stepNumber: this.state.stepNumber-1,
      turn: this.state.turn === 'X' ? 'O' : 'X',
    });
  }

  redo() {
    this.setState({
      stepNumber: this.state.stepNumber+1,
      turn: this.state.turn === 'X' ? 'O' : 'X',
    });
  }
  
  newGame() {
    this.setState({
      history: [{
        cells: Array(9).fill(null),
        last: null,
      }],
      stepNumber: 0,
      turn: 'X',
    });
  } 

  render() {
    const history = this.state.history;
    const step = this.state.stepNumber;
    const current = history[this.state.stepNumber];
    const result = computeResult(current.cells);
    console.log('step', step);
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            current = {current}
            onClick = {(i) => this.handleClick(i)}
            result = {result}
            turn = {this.state.turn}
          />
        </div>
        <div className = "btn-group">
          <button onClick={this.undo} 
            disabled = {step === 0}
          >
            Undo
          </button>
          <button onClick={this.redo} 
            disabled ={step === history.length-1}
          >
            Redo
          </button>
          <button onClick={this.newGame}>
            New Game
          </button>
          <button>Settings</button>
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

function computeResult(squares) {
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
