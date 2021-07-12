import { Component, useState, useEffect } from 'react';
import {
  TextField,
  OutlinedInput,
  Button,
  InputAdornment,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import SearchBar from './searchbar';
//import Suggestions from './suggestions';
import WordCard from './wordcard';

import './style.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > .MuiTextField-root': {
      margin: theme.spacing(2),
    },
    '& > .MuiButton-root': {
      margin: theme.spacing(2),
    },
  },
}));

class LookupWordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      suggestions: [],
      record: {},
    };
  }

  handleInputChange = (inputText) => {
    this.setState({
      inputText: inputText,
    });
    if (inputText === '') {
      this.setState({ suggestions: [] });
      return;
    }
    const request = `https://glacial-sea-66767.herokuapp.com/http://tratu.soha.vn/extensions/curl_suggest.php?search=${encodeURI(
      inputText
    )}&dict=vn_vn`;
    console.log(request);
    fetch(request)
      .then((response) => response.text())
      .then(
        (result) => {
          //console.log(result);
          // const dom = new DOMParser().parseFromString(text, 'application/xml')
          // console.log(dom.getElementsByTagName('results')[0].innerHTML)
          const convert = require('xml-js');
          const json = convert.xml2json(result, { compact: true, spaces: 4 });
          //console.log(json);
          const { results } = JSON.parse(json);
          if (results) {
            console.log("results", results)
            if (Object.keys(results).length === 0) {
              this.setState({ suggestions: [] });
              return;
            }
            const rs = results.rs;
            this.setState({
              suggestions: Array.isArray(rs) ? rs.map((item) => item._text) : [rs._text],
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  handleSearch = (word) => {
    //this.setState({ inputText: '' });
    this.setState({ suggestions: [] });
    console.log('searching ', word);

    const request = `http://192.168.31.205:8088/records/${encodeURI(word)}`;
    fetch(request)
      .then((response) => response.json())
        .then((result) => {
          console.log("result: ", result)
          const { data } = result
          if (data != null) {
            this.setState({record: data})
          }
      });
  };

  render() {
    return (
      <div>
        <SearchBar
          inputText={this.state.inputText}
          suggestions={this.state.suggestions}
          onInputchange={this.handleInputChange}
          onSearch={this.handleSearch}
        />
        {/* <Suggestions
          suggestions={this.state.suggestions}
          onSearch={this.handleSearch}
        /> */}
        <WordCard record={this.state.record} />
      </div>
    );
  }
}

export default LookupWordComponent;
