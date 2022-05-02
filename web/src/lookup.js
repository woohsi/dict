import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BackTop } from 'antd';
import SearchBar from 'search/Searchbar';
import Home from 'card/Home';
import WordCard from 'card/Wordcard';
import History from 'card/History';
import 'css/style.css';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

const LookupWordComponent = () => {
  // const [page, setpage] = useState(-1);
  // const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <Router>
      <div className='lookup'>
        <div className='content'>
          <Switch>
            <Route exact path='/'>
              <SearchBar
              />
              <Home />
            </Route>
            <Route path='/vi-vi/:word'>
              <SearchBar
              />
              <WordCard
              />
            </Route>
            <Route path='/vi-zh/:word'>
              <SearchBar
              />
              <WordCard
              />
            </Route>
            <Route path='/zh-vi/:word'>
              <SearchBar
              />
              <WordCard
              />
            </Route>
            <Route path='/history'>
              <History />
            </Route>
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
          <BackTop>
            <div style={style}>UP</div>
          </BackTop>
        </div>
      </div>
    </Router>
  );
};

export default LookupWordComponent;
