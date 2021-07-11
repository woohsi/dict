import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Component, useState } from 'react';

import './style.css';

export default function SearchBar(props) {
  const inputText = props.inputText;
  //setInputText(props.inputText);

  const handleInputChange = (e) => {
    props.onInputchange(e.target.value);
  };

  const handleSearchIconClick = () => {
    props.onSearch(inputText);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log(e.target[0].getAttribute("value"))
    props.onSearch(inputText);
  };

  const handleSuggestionClick = (e) => {
    const word = e.target.getAttribute('value');
    console.log('You clicked ', word);
    props.onSearch(word);
  };

  const sugestList = props.suggestions.map((s, i) => (
    <div key={i} value={s} className='sugg' onClick={handleSuggestionClick}>
      {s}
    </div>
  ));

  return (
    <div>
      <form onSubmit={ handleSubmit} noValidate autoComplete='off'>
        <FormControl fullWidth>
          <FormLabel></FormLabel>
          <OutlinedInput
            value={inputText}
            //   className={classes.input}
            placeholder='Nhập từ để tra cứu ...'
            onChange={handleInputChange}
            endAdornment={
              <InputAdornment position='end'>
                <SearchIcon onClick={handleSearchIconClick} />
              </InputAdornment>
            }
          />
          <FormHelperText></FormHelperText>
        </FormControl>

        {/* <Button variant='outlined' size='middle' color='primary'>
          Search
        </Button> */}
      </form>
      <div id='suggs' style={{ textAlign: 'left' }}>
        {sugestList}
      </div>
    </div>
  );
}