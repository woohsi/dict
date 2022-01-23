import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';

const Select = ({ select, onSelectChange }) => {
  console.log("Select comp: ", select);
  const [value, setValue] = useState(select);
  const location = useLocation();

  useEffect(() => {
    console.log("Select-useEffect........");
    setValue(location.pathname.split('/')[1]);
    onSelectChange(location.pathname.split('/')[1]);
  }, []);

  const handleRadioChange = (e) => {
    setValue(e.target.value);
    onSelectChange(e.target.value);
    console.log("selected: ", e.target.value);
  };

  return (
    <FormControl component='fieldset'>
      {/* <FormLabel component="legend">Lựa Chọn</FormLabel> */}
      <RadioGroup
        row
        aria-label='position'
        name='position'
        defaultValue='vietviet'
        value={value}
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value='viethan'
          control={<Radio color='primary' />}
          label='Việt-Hán'
        />
        <FormControlLabel
          value='vietviet'
          control={<Radio color='primary' />}
          label='Việt-Việt'
        />
        <FormControlLabel
          value='hanviet'
          control={<Radio color='primary' />}
          label='Hán-Việt'
        />
      </RadioGroup>
    </FormControl>
  );
};

export default Select;
