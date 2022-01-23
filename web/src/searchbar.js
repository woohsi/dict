import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router';
import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@material-ui/core';
import Select from './Select'
import './style.css';

const SearchBar = ({ word, select, onSelectChange, onSearch }) => {
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  
  console.log("Searchbar, word:", word, "select: ", select);
  const [inputText, setInputText] = useState("");
  const prevSelect = usePrevious(select);
  const inputEl = useRef(null)
  const history = useHistory();
  const location = useLocation();

  //select = location.pathname.split('/')[1];
  
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


  // if (prevSelect !== select) {
  //   nextUrl();
  // }

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

  useEffect(() => {
    setInputText(word);
    inputEl.current.focus();
  }, [word, select]);

  return (
    <>
      {location.pathname.split('/')[1]}
      <form onSubmit={handleSubmit} noValidate autoComplete='off'>
        <FormControl fullWidth>
          <FormLabel></FormLabel>
          <OutlinedInput
            value={inputText}
            //   className={classes.input}
            placeholder='Nhập từ để tra cứu ...'
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            endAdornment={
              <InputAdornment position='end'>
                <SearchIcon onClick={handleSearchIconClick} />
              </InputAdornment>
            }
            ref={inputEl}
          />
          <FormHelperText component='div'>
            <Select select={select} onSelectChange={onSelectChange} />
          </FormHelperText>
        </FormControl>
      </form>
    </>
  );
} 

export default SearchBar;