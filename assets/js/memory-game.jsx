import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
  // Define our initial state (unordered board, 0 clicks, storedGuess null)
  // Scramble the board
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = {
      skel: [],
      clickCount: 0
    };

    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });
  }

  // Sleep promise implementation from: https://davidwalsh.name/javascript-sleep-function
  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  got_view(view) {
    this.setState(view.game);
  }

  on_guess(ev) {
    this.channel.push("guess", { idx: ev.target.getAttribute("idx") })
        .receive("ok", this.got_view.bind(this));
  }
  
  // generate tiles and root page
  render() {
    // Define elements for restart button and click counter
    let menuRow =
      <div className="gameMenu">
        <button className="gameRestart">Restart</button>
        <p className="gameCounter">
          &nbsp;Click Count: <input readOnly={true} type="text" id="gameCounter" value={this.state.clickCount}></input>
        </p>
      </div>;

    let tileGrid = _.map(this.state.skel, (item, ii) => {
      return <GameTile item={item} idx={ii} key={ii} on_guess={this.on_guess.bind(this)}/>;
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
  let {item, idx, on_guess} = props;
  if (item !== " ") {
    return <button className="gameButton discovered">{item}</button>;
  } else {
    return <button className="gameButton" onClick={on_guess} idx={idx}>&nbsp;</button>;
  }
}