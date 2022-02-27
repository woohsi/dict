import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router';
import { Row, Col, Input, Layout } from 'antd';

import Select from './Select'
import './style.css';

const { Search } = Input;

const SearchBar = ({ word, select, onSelectChange, onInputChange }) => {
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  console.log('Searchbar, word:', word, 'select: ', select);
  const [inputText, setInputText] = useState('');
  const prevSelect = usePrevious(select);
  const inputEl = useRef(null);
  const history = useHistory();
  const location = useLocation();

  //select = location.pathname.split('/')[1];

  const nextUrl = () => {
    let url = '';
    switch (select) {
      case 'vi-vi':
        url = '/vi-vi/' + encodeURI(inputText);
        break;
      case 'vi-zh':
        url = '/vi-zh/' + encodeURI(inputText.trim().toLowerCase());
        break;
      case 'zh-vi':
        url = '/zh-vi/' + encodeURI(inputText);
        break;
      default:
    }
    history.push(url);
  };

  if (prevSelect !== undefined && prevSelect !== '' && prevSelect !== select) {
    console.log('test: ', prevSelect);
    nextUrl();
  }

  const handleSearchIconClick = () => {
    // onSearch(inputText);
    nextUrl();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(e.target[0].getAttribute("value"))
    //onSearch(inputText);
    nextUrl();
  };

  useEffect(() => {
    setInputText(word);
    inputEl.current.focus();
  }, [word, select]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Search
            size='large'
            placeholder='Input search word'
            onSearch={handleSearchIconClick}
            onChange={(e) => {
              setInputText(e.target.value);
              onInputChange(e.target.value);
            }}
            ref={inputEl}
            enterButton
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Select select={select} onSelectChange={onSelectChange} />
        </Col>
      </Row>
    </>
  );
}; 

export default SearchBar;