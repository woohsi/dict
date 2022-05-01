import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Radio } from 'antd';

// eslint-disable-next-line react/prop-types
const Select = ({ select, onSelectChange }) => {
  console.log('Select comp: ', select);
  const [, setValue] = useState(select);
  const location = useLocation();

  useEffect(() => {
    console.log('Select-useEffect........', location.pathname.split('/')[1]);
    setValue(location.pathname.split('/')[1] ? location.pathname.split('/')[1] : 'vi-zh');
    onSelectChange(location.pathname.split('/')[1] ? location.pathname.split('/')[1]: 'vi-zh');
  }, []);

  const handleRadioChange = (e) => {
    setValue(e.target.value);
    onSelectChange(e.target.value);
    console.log('selected: ', e.target.value);
  };

  return (
    <Radio.Group
      defaultValue='vi-zh'
      style={{ marginTop: 16 }}
      buttonStyle='solid'
      onChange={handleRadioChange}
    >
      <Radio.Button value='vi-zh'>Viet-Trung</Radio.Button>
      <Radio.Button value='vi-vi'>Viet-Viet</Radio.Button>
      <Radio.Button value='zh-vi'>Trung-Viet</Radio.Button>
    </Radio.Group>
  );
};

export default Select;
