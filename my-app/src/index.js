import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

function ListedItem(props) {
	return (
		<li key={props.move} className="listedItem">
				<button 
					onClick={() => props.onClick(props.move)}>{props.desc}
				</button>
				{" " + props.history[props.move].colRow}
			</li>
	);
}

class Board extends React.Component {


  renderSquare(i) {
	return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
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
		history : [{squares: Array(9).fill(null), colRow: 'N/A',  currSelected: false,}],
		xIsNext: true,
		stepNumber: 0,
	}
  }

  jumpTo(step, history) {
  	//loop through the move list and set currSelected to be false.
  	for (let i=0; i < history.length; i++) {
  		history[i].currSelected = false;
  	}
  	history[step].currSelected = true;
	this.setState({
		stepNumber: step,
		xIsNext: (step % 2) == 0, 
	});
  }

  renderListItem(move, history, desc, jumpTo) {
  	return (
		<li key={this.move} className="listedItem">
				<button 
					onClick={() => this.jumpTo(this.move)}>{this.desc}
				</button>
				{" " + this.history[this.move].colRow}
			</li>
	);
 	//return (<ListedItem move={this.move} history={this.history} desc={this.desc} onClick={() => Game.jumpTo(this.move)}/>);
  }

  handleClick(i) {
	const history = this.state.history.slice(0, this.state.stepNumber + 1);
	const current = history[history.length - 1];
	const squares = current.squares.slice(); 
	const colRow = [i%3, Math.floor(i/3)];
	if (calculateWinner(squares) || squares[i]) {
		return;
	}
	squares[i] = this.state.xIsNext ? 'X' : 'O';
	this.setState({
		history: history.concat([{
			squares: squares,
			colRow: colRow,
		}]),
		xIsNext: !this.state.xIsNext,
		stepNumber: history.length,
	});
  }
	
  render() {
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner = calculateWinner(current.squares);

	const moves = history.map((step, move) => {
		const desc = move ? 'Go to move #' + move : 'Go to game start';
		return(
			<li key={move} className="listedItem">
		       <button 
		        	onClick={() => {this.jumpTo(move, history);}}
		       		style={{fontWeight: history[move].currSelected ? 'bold' : 'normal'}}
				>
		       		{desc}
		       </button>
		       {" " + history[move].colRow}
			</li>
		);
	});

	let status;
	if(winner) {
		status = 'Winner: ' + winner; 
	} else if (calculateTie(current.squares)) {
		status = 'Tie!!!';
	} else {
		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	}

	return (
	  <div className="game">
		<div className="game-board">
		  <Board 
			squares = {current.squares} 
			onClick={(i) => this.handleClick(i)}
		  />
		</div>
		<div className="game-info">
		  <div>{ status }</div>
		  <ol>{moves}</ol>
		</div>
	  </div>
	);
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateTie(squares) {
	for (let i = 0; i < squares.length; i++) {
		if (squares[i] == null) {
			return;
		} 
	}
	return 'Tie';
}

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
	  return squares[a];
	}
  }
  return null;
}
