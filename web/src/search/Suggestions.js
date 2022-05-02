import { Component } from 'react';

import 'css/style.css';

export default class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (e) => {
    const word = e.target.getAttribute('value');
    console.log('You clicked ', word);
    this.props.onSearch(word);
  };

  render() {
    const sugestList = this.props.suggestions.map((s, i) => (
      <div key={i} value={s} className='sugg' onClick={this.handleClick}>
        {s}
      </div>
    ));
    return (
      <div id='suggs' style={{ textAlign: 'left' }}>
        {sugestList}
      </div>
    );
  }
}
