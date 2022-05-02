/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Row, Col, Input, Modal, Badge, Alert } from 'antd';
import axios from 'axios';

import Select from 'search/Select';
import 'css/style.css';
import { useLocation } from 'react-router-dom';

const { Search, TextArea } = Input;

const SearchBar = () => {
  // const usePrevious = (value) => {
  //   const ref = useRef();
  //     useEffect(() => {
  //     ref.current = value;
  //   });
  //   return ref.current;
  // };
  const [select, setSelect] = useState('vi-zh');

  console.log('Searchbar, word:', 'select: ', select);
  const location = useLocation();
  const [inputText, setInputText] = useState(
    location.pathname.split('/')[2] ? location.pathname.split('/')[2] : ''
  );
  // const prevSelect = usePrevious(select);
  const inputEl = useRef(null);
  const history = useHistory();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [note, setNote] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  const showModal = () => {
    setVisible(true);
    axios
      .get('http://localhost/api/history/' + inputText)
      .then(function (response) {
        console.log('resp: ', response);
        const { data } = response;
        if (data.code === 0) {
          const { note } = data.data;
          console.log('note: ', note);
          setNote(note);
        }
      }).catch(function (error) {
        console.log(error);
      });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    console.log('ceshi: ', inputText, note);
    axios
      .post(
        'http://localhost/api/history',
        new URLSearchParams({
          title: inputText,
          note: note,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      ).then(function (response) {
        console.log(response);
        setVisible(false);
        setConfirmLoading(false);
      }).catch(function (error) {
        console.log(error);
        setShowErrorMsg(true);
        setConfirmLoading(false);
      });
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  //select = location.pathname.split('/')[1];

  const nextUrl = () => {
    let url = '/vi-zh/' + encodeURI(inputText.trim().toLowerCase());
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

  // if (prevSelect !== undefined && prevSelect !== '' && prevSelect !== select) {
  //   console.log('test: ', prevSelect);
  //   nextUrl();
  // }

  const handleSearchIconClick = () => {
    // onSearch(inputText);
    setNote('');
    nextUrl();
  };

  useEffect(() => {
    if (inputText != '') {
      nextUrl();
    }
    inputEl.current.focus();
  }, [select]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Search
            value={inputText}
            size='large'
            placeholder='Input search word'
            onSearch={handleSearchIconClick}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            ref={inputEl}
            enterButton
          />
        </Col>
      </Row>
      <Row>
        <Col span={20}>
          <Select onSelectChange={(e) => setSelect(e)} />
        </Col>
        <Col span={4}>
          <div className='note' onClick={showModal}>
            +
          </div>
          <Modal
            title='将该词添加到记忆库'
            okText='添加'
            cancelText='取消'
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div>
              <Badge.Ribbon text={inputText} color='volcano'>
                <TextArea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Badge.Ribbon>
              {showErrorMsg && <Alert message='Error' type='error' showIcon />}
            </div>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default SearchBar;
