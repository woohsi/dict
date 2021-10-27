import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Component, useRef, useState } from 'react';

import './style.css';

export default function SearchBar(props) {
  const inputEl = useRef(null)
  const inputText = props.inputText;
  //setInputText(props.inputText);

  const handleInputChange = (e) => {
    props.onInputChange(e.target.value);
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

  useEffect(() => {
    inputEl.current.focus()
  })

  let sugestList = props.suggestions.map((s, i) => (
    <div key={i} value={s} className='sugg' onClick={handleSuggestionClick}>
      {s}
    </div>
  ));

  if (props.select === "viethan") {
    sugestList = <></>
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
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
            ref={inputEl}
          />
          <FormHelperText><Select onSelectChange={props.onSelectChange}/></FormHelperText>
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

function Select(props) {
  const [select, setSelect] = useState("viethan")

  const handleRadioChange = (event) => {
    setSelect(event.target.value);
    props.onSelectChange(event.target.value)
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