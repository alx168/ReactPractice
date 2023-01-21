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
                    onClick={() => Game.jumpTo(props.move)}>{props.desc}
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
//      for(let x = 0; x < 3; x++) {
//            for(let y = 0; y < 3; y++) {
//                this.renderSquare(x,y)
//            }
//        }


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
        history : [{squares: Array(9).fill(null), colRow: 'N/A'}],
        xIsNext: true,
        stepNumber: 0,
    }
  }

  jumpTo(step, listItem) {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) == 0, 
    });
    
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
    console.log(history);
    this.setState({
        history: history.concat([{
            squares: squares,
            colRow: colRow
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
    });
  }
//new approach: make list item a class and store the state of whether or not it should be bolded.
//then we write code that bolds it based on whether or not it should be bolded
   // listedItem(move, desc, history, isBolded) {
   //     let listItem = <li key={move} className="listedItem">
   //             <button 
   //                 onClick={() => this.jumpTo(move)}>{desc}
   //             </button>
   //             {" " + history[move].colRow}
   //         </li>
   //     if (isBolded) {
   //         return(
   //         <b>
   //             listItem
   //         </b>
   //         );
   //     } else {
   //         return(listItem);
   //     }
   // }
    

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start';
        return <ListedItem move={this.move} history={this.history} desc={this.desc} onClick={() => this.jumpTo}/>;
           // <li key={move} className="listedItem">
           //     <button 
           //         onClick={() => this.jumpTo(move)}>{desc}
           //     </button>
           //     {" " + history[move].colRow}
           // </li>
            
            //this.listedItem(move, desc, history, true)
        
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
