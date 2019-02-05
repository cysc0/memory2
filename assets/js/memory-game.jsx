import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}

class Memory extends React.Component {
  // Define our initial state (unordered board, 0 clicks, storedGuess null)
  // Scramble the board
  constructor(props) {
    super(props);
    this.state = {
      board: [
        {letter: "A", display: false}, {letter: "A", display: false},
        {letter: "B", display: false}, {letter: "B", display: false},
        {letter: "C", display: false}, {letter: "C", display: false},
        {letter: "D", display: false}, {letter: "D", display: false},
        {letter: "E", display: false}, {letter: "E", display: false},
        {letter: "F", display: false}, {letter: "F", display: false},
        {letter: "G", display: false}, {letter: "G", display: false},
        {letter: "H", display: false}, {letter: "H", display: false}
      ],
      storedGuess: null,
      clickCount: 0,
      sleeping: false
    };
    this.state.board = this.shuffle(this.state.board);
  }
  
  // Define a temporary default state, shuffle, and set as state
  initializeBoard() {
    let defaultState = {
      board: [{letter: "A", display: false}, {letter: "A", display: false},
      {letter: "B", display: false}, {letter: "B", display: false},
      {letter: "C", display: false}, {letter: "C", display: false},
      {letter: "D", display: false}, {letter: "D", display: false},
      {letter: "E", display: false}, {letter: "E", display: false},
      {letter: "F", display: false}, {letter: "F", display: false},
      {letter: "G", display: false}, {letter: "G", display: false},
      {letter: "H", display: false}, {letter: "H", display: false}],
      storedGuess: null,
      clickCount: 0,
      sleeping: false
    };
    defaultState.board = this.shuffle(defaultState.board);
    this.setState(defaultState)
  }

  flicker(item) {
    this.state.board[item["idx"]].display = true;
    this.state.board[this.state.storedGuess["idx"]].display = true;
    this.setState(this.state);
  }

  // Sleep promise implementation from: https://davidwalsh.name/javascript-sleep-function
  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  // summoned by user clicking a tile. if its a first guess, reveal the tile
  // if its a second guess
  //   if its correct, reveal second tile and continue
  //   else, reveal both tiles briefly, block input, then hide both again
  // this could have been cleaner if i realized the sleep operates on a callback
  //   but i didn't have time to refactor
  guess(item) {
    // block input on discovered pairs or while sleeping to elim edge cases
    if (!this.state.board[item["idx"]].display && !this.state.sleeping) {
      if (this.state.storedGuess !== null) {
        // guess 2 block
        if (this.state.storedGuess.letter === item.letter) {
          // if we have a match, mark new one as displayed
          this.state.board[item["idx"]].display = true;
        } else {
          // otherwise flash the newly clicked tile briefly, then reset both
          // current guess and previous guess to non-displayed
          // this.state.board[item["idx"]].display = true;
          this.state.clickCount = this.state.clickCount + 1;
          this.flicker(item);
          this.state.sleeping = true;
          this.sleep(1000).then(() => {
            this.state.board[item["idx"]].display = false;
            this.state.board[this.state.storedGuess["idx"]].display = false;
            this.state.storedGuess = null; // reset our guess register
            this.state.sleeping = false;
            this.setState(this.state);
          })
          return
        }
        this.state.storedGuess = null; // reset our guess register
      } else {
        this.state.board[item["idx"]].display = true;
        this.state.storedGuess = item;
      }
      this.state.clickCount = this.state.clickCount + 1;
      this.setState(this.state);
    }
  }
  
  // Fisher-Yates shuffle: https://stackoverflow.com/a/6274381
  // Shuffle the array of tiles to randomize
  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  
  // generate tiles and root page
  render() {
    // Define elements for restart button and click counter
    let menuRow =
      <div className="gameMenu">
        <button className="gameRestart" onClick={this.initializeBoard.bind(this)}>Restart</button>
        <p className="gameCounter">
          &nbsp;Click Count: <input readOnly={true} type="text" id="gameCounter" value={this.state.clickCount}></input>
        </p>
      </div>;

    let tileGrid = _.map(this.state.board, (item, ii) => {
      item["idx"] = ii; // insert index for comparing the clicked elem to its data counterpart
      return <GameTile item={item} guess={this.guess.bind(this)} key={ii} />;
    });

    // return tiles, restart button, and counter
    return (
      <div>
        <div className="row" id="tileContainer">
          <div className="column">
            {tileGrid}
          </div>
          <div className="column">
            {menuRow}
          </div>
        </div>
      </div>
    );
  }
}

// Binding logic taken from Nat Tuck:
// http://khoury.neu.edu/~ntuck/courses/2019/01/cs4550/notes/06-more-react/todo.jsx
function GameTile(props) {
  let item = props.item;
  if (item.display) {
    // if this tile is flagged as revealed, show its letter, via CSS disable pointer events
    return <button className="gameButton discovered" onClick={() => props.guess(item)}>{item.letter}</button>;
  }
  else {
    // otherwise render a blank button
    return <button className="gameButton" onClick={() => props.guess(item)}>&nbsp;</button>;
  }
}