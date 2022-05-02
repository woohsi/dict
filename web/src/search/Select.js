import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Radio } from 'antd';

// eslint-disable-next-line react/prop-types
const Select = ({ onSelectChange }) => {
  const location = useLocation();
  const [selectV, setSelectV] = useState(
    location.pathname.split('/')[1] ? location.pathname.split('/')[1] : 'vi-zh'
  );
  console.log('SelecVt comp: ', selectV);
  useEffect(() => {
    console.log('Select-useEffect........', location.pathname.split('/')[1]);
    onSelectChange(location.pathname.split('/')[1] ? location.pathname.split('/')[1]: 'vi-zh');
  }, []);

  const handleRadioChange = (e) => {
    setSelectV(e.target.value);
    onSelectChange(e.target.value);
    console.log('selected: ', e.target.value);
  };

  return (
    <Radio.Group
      defaultValue='vi-zh'
      value={selectV}
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
