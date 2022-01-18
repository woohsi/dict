import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router';

import './style.css';

const SearchBar = ({word, suggestions, select, onInputChange, onSelectChange,  onSearch}) => {
  
  console.log("Searchbar, word:", word);
  const [inputText, setInputText] = useState(word);
  const inputEl = useRef(null)
  const history = useHistory();

  const handleInputChange = (e) => {
    onInputChange(e.target.value);
  };

  const nextUrl = () => {
    let nextUrl = ""
    switch(select) {
      case 'vietviet':
        nextUrl = '/vietviet/'+encodeURI(inputText);
        break;
      case 'viethan':
        nextUrl = '/viethan/'+encodeURI(inputText);
        break;
      case 'hanviet':
        nextUrl = '/hanviet/'+encodeURI(inputText)
        break;
      default:
    }
    history.push(nextUrl);
  };

  const handleSearchIconClick = () => {
    // onSearch(inputText);
    nextUrl();
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log(e.target[0].getAttribute("value"))
    //onSearch(inputText);
    nextUrl();
  };

  const handleSuggestionClick = (e) => {
    const word = e.target.getAttribute('value');
    console.log('You clicked ', word);
    onSearch(word);
  };

  useEffect(() => {
    inputEl.current.focus()
  })

  let sugestList = suggestions.map((s, i) => (
    <div key={i} value={s} className='sugg' onClick={handleSuggestionClick}>
      {s}
    </div>
  ));

  if (select === "viethan") {
    sugestList = <></>
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
        <FormControl fullWidth>
          <FormLabel></FormLabel>
          <OutlinedInput
            value={inputText}
            //   className={classes.input}
            placeholder='Nhập từ để tra cứu ...'
            onChange={(e) => {setInputText(e.target.value)}}
            endAdornment={
              <InputAdornment position='end'>
                <SearchIcon onClick={handleSearchIconClick} />
              </InputAdornment>
            }
            ref={inputEl} />
          <FormHelperText component='div'>
            <Select onSelectChange={onSelectChange}/>
          </FormHelperText>
        </FormControl>

        {/* <Button variant='outlined' size='middle' color='primary'>
          Search
        </Button> */}
      </form>
      <div id='suggs' style={{ textAlign: 'left' }}>
        {sugestList}
      </div>
    </>
  );
} 

const Select = ({onSelectChange}) => {
  const [select, setSelect] = useState("viethan")

  const handleRadioChange = (event) => {
    setSelect(event.target.value);
    onSelectChange(event.target.value)
  };

  return (
    <FormControl component="fieldset">
      {/* <FormLabel component="legend">Lựa Chọn</FormLabel> */}
      <RadioGroup row aria-label="position" name="position" defaultValue="vietviet" value={select} onChange={handleRadioChange}>
        <FormControlLabel value="viethan" control={<Radio color="primary" />} label="Việt-Hán" />
        <FormControlLabel value="vietviet" control={<Radio color="primary" />} label="Việt-Việt" />
        <FormControlLabel value="hanviet" control={<Radio color="primary" />} label="Hán-Việt" />
      </RadioGroup>
    </FormControl>
  );
}

export default SearchBar;