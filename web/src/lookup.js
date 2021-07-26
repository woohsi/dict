import { Component, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
      select: 'viethan',
      suggestions: [],
      record: {},
      page: -1,
      showLearnMore: false,
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
    if (this.state.select === "viethan") {
      return
    }
    inputText = inputText.trim()
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

  handleSelectChange = (select) => {
    this.setState({select: select})
  }

  handleSearch = (word) => {
    //this.setState({ inputText: '' });
    this.setState({ suggestions: [], showLearnMore: true });
    word = word.trim()
    if (this.state.select === "vietviet") {
      console.log('searching vietviet', word);
      const request = `http://woohsi.top:88/api/records/${encodeURI(word)}`;
      fetch(request)
        .then((response) => response.json())
          .then((result) => {
            console.log("result: ", result)
            const { data } = result
            if (data != null) {
              this.setState({record: data})
            }
        });
    }
    
    if (this.state.select === "viethan") {
      console.log('searching viethan', word);
      const request = `http://woohsi.top:88/api/pages/${encodeURI(word)}`;
      fetch(request)
        .then((response) => response.json())
          .then((result) => {
            console.log("result: ", result)
            const { page } = result
            if (page != null) {
              this.setState({page: page})
            }
        });
    }
  };

  render() {
    return (
      <div>
        <SearchBar
          inputText={this.state.inputText}
          suggestions={this.state.suggestions}
          select={this.state.select}
          onInputChange={this.handleInputChange}
          onSelectChange={this.handleSelectChange}
          onSearch={this.handleSearch}

        />
        {/* <Suggestions
          suggestions={this.state.suggestions}
          onSearch={this.handleSearch}
        /> */}
        <WordCard select={this.state.select} showLearnMore={this.state.showLearnMore} word={this.state.inputText} record={this.state.record} page={this.state.page}/>
      </div>
    );
  }
}

export default LookupWordComponent;
