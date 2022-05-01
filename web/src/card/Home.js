import React from 'react';

const Home = () => {
  return (
    <div>
      <h4 style={{ marginTop: 50 }}>
        <Clock/> <br />
        Dictionaries for Vietnamese Learners
        <br />
        <br />
        ©2022 woohsi
      </h4>
    </div>
  );
};

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
        <h1>Welcome!</h1>
        <h2>Current Time：{this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

export default Home;