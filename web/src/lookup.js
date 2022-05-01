import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BackTop } from 'antd';
import SearchBar from 'search/Searchbar';
import Home from 'card/Home';
import WordCard from 'card/Wordcard';
import History from 'card/History';
import 'css/style.css';

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
  const [inputText, setInputText] = useState('');
  const [select, setSelect] = useState('');
  // const [page, setpage] = useState(-1);
  // const [showLearnMore, setShowLearnMore] = useState(false);

  const handleInputChange = (inputText) => {
    setInputText(inputText);
    console.log('handleInputChange in lookup.js: ', inputText);
  };

  const handleSelectChange = (select) => {
    setSelect(select);
    console.log('select change: ', select);
  };

  return (
    <Router>
      <div className='lookup'>
        <div className='content'>
          <Switch>
            <Route exact path='/'>
              <SearchBar
                word={inputText}
                select='vi-zh'
                onSelectChange={handleSelectChange}
                onInputChange={handleInputChange}
              />
              <Home />
            </Route>
            <Route path='/vi-vi/:word'>
              <SearchBar
                word={inputText}
                select={select}
                onSelectChange={handleSelectChange}
                onInputChange={handleInputChange}
              />
              <WordCard select={select} onInputChange={handleInputChange} />
            </Route>
            <Route path='/vi-zh/:word'>
              <SearchBar
                word={inputText}
                select={select}
                onSelectChange={handleSelectChange}
                onInputChange={handleInputChange}
              />
              <WordCard select={select} onInputChange={handleInputChange} />
            </Route>
            <Route path='/zh-vi/:word'>
              <SearchBar
                word={inputText}
                select={select}
                onSelectChange={handleSelectChange}
                onInputChange={handleInputChange}
              />
              <WordCard select={select} onInputChange={handleInputChange} />
            </Route>
            <Route path='/history'>
              <History />
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
