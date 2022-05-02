import React from 'react';
import 'css/style.css';
const Home = () => {
  return (
    <div className='footer'>
      <p>
        {/* <Clock /> <br /> */}
        Dictionaries for Vietnamese Learners
        <br />
        ©2022{' '}
        <a href='https://www.facebook.com/bohsiang111'>
          <span className='name'>woohsi</span>
        </a>
      </p>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
    console.log('Mount timerID: ', this.timerID);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
    console.log('Unmount timerID: ', this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h2>{this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

export default Home;