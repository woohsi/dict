import { useState, useEffect } from 'react'

import axios from 'axios';
import 'css/datepick.css'

const History = () => {
  const [historyList, setHistoryList] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost/api/history')
      .then(function (response) {
        console.log(response)
        const { data } = response;
        if (data.code === 0) {
          setHistoryList(data.data.filter((element, index, arr) => {
            for (let i = 0; i < index; i++) {
              if (arr[i].title === element.title) {
                return false;
              }
            }
            return true;
          }));
          console.log('historyList: ', historyList);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className='container'>
      <div className='date-pick'>
        <span className='arrow left'>
          <span className='triangle'></span>
        </span>
        <span id='date-indicator'>2022-3-27</span>
        <span className='arrow right'>
          <span className='triangle'></span>
        </span>
        <div id='dateWrapper' className='tooltip'>
          <div id='dates'>
            <span className='date-marker'>1</span>
            <span className='date-marker'>2</span>
            <span className='date-marker'>3</span>
            <span className='date-marker'>4</span>
            <span className='date-marker'>5</span>
            <span className='date-marker'>6</span>
            <span className='date-marker'>7</span>
            <span className='date-marker'>Today</span>
          </div>
        </div>
      </div>
      <div className='word-history'>
        <ul>
          {historyList && historyList.map((hisItem) => <li key={hisItem.id}>{hisItem.title}</li>)}
        </ul>
      </div>
    </div>
  );
}
 
export default History;