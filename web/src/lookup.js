import { useState } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './Home'
import SearchBar from './searchbar';
import WordCard from './wordcard';

import './style.css';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& > .MuiTextField-root': {
//       margin: theme.spacing(2),
//     },
//     '& > .MuiButton-root': {
//       margin: theme.spacing(2),
//     },
//   },
// }));

const LookupWordComponent = () => {
  const [inputText, setInputText] = useState("");
  const [select, setSelect] = useState("");
  const [page, setpage] = useState(-1);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const handleInputChange = (inputText) => {
    setInputText(inputText);
    console.log("handleInputChange in lookup.js: ", inputText);
    // if (inputText === '') {
    //   this.setState({ suggestions: [] });
    //   return;
    // }
    // inputText = inputText.trim()
    // const request = `https://wcors.herokuapp.com/http://tratu.soha.vn/extensions/curl_suggest.php?search=${encodeURI(
    //   inputText
    // )}&dict=vn_vn`;
    // console.log(request);
    // fetch(request)
    //   .then((response) => response.text())
    //   .then(
    //     (result) => {
    //       //console.log(result);
    //       // const dom = new DOMParser().parseFromString(text, 'application/xml')
    //       // console.log(dom.getElementsByTagName('results')[0].innerHTML)
    //       const convert = require('xml-js');
    //       const json = convert.xml2json(result, { compact: true, spaces: 4 });
    //       //console.log(json);
    //       const { results } = JSON.parse(json);
    //       if (results) {
    //         console.log("results", results)
    //         if (Object.keys(results).length === 0) {
    //           this.setState({ suggestions: [] });
    //           return;
    //         }
    //         const rs = results.rs;
    //         this.setState({
    //           suggestions: Array.isArray(rs) ? rs.map((item) => item._text) : [rs._text],
    //         });
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  };

  const handleSelectChange = (select) => {
    setSelect(select);
    console.log("select change: ", select);
  }

  return (
    <Router>
      <div className='lookup'>
        <div className='content'>
          <Switch>
            <Route exact path='/'>
              <SearchBar
                word={inputText}
                select="viethan"
                onSelectChange={handleSelectChange}
              />
              <Home />
            </Route>
            <Route path='/vietviet/:word'>
              <SearchBar
                word={inputText}
                select={select}
                onSelectChange={handleSelectChange}
              />
              <WordCard select={select} onInputChange={handleInputChange} />
            </Route>
            <Route path='/viethan/:word'>
              <SearchBar
                word={inputText}
                select={select}
                onSelectChange={handleSelectChange}
              />
              <WordCard select={select} onInputChange={handleInputChange} />
            </Route>
            <Route path='/hanviet/:word'>
              <SearchBar
                word={inputText}
                select={select}
                onSelectChange={handleSelectChange}
              />
              <WordCard select={select} onInputChange={handleInputChange} />
            </Route>
          </Switch>
          {/* <WordCard select={this.state.select} showLearnMore={this.state.showLearnMore} word={this.state.inputText} data={this.state.data} record={this.state.record} record2={this.state.record2} record3={this.state.record3} page={this.state.page} /> */}
        </div>
        {/* <Suggestions
          suggestions={this.state.suggestions}
          onSearch={this.handleSearch}
        /> */}
      </div>
    </Router>
  );
}

export default LookupWordComponent;
