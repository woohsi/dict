/* eslint-disable semi */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Chip,
  makeStyles,
} from '@material-ui/core';
import { Spin } from 'antd';
import axios from 'axios';

import PDF from 'card/Pdf';
import 'css/style.css';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    textAlign: 'left',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  example: {
    fontSize: 16,
    marginLeft: '10px',
  },
  meaning: {},
  pos: {
    marginBottom: 16,
  },
});

const WordCard = ({ showLearnMore }) => {
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState(null)
  const [dt, setDt] = useState(null);
  const { word } = useParams();
  const location = useLocation();
  const select = location.pathname.split('/')[1];
  console.log('wordcard.js, word1:', word, 'select: ', select);

  const classes = useStyles();

  useEffect(() => {
    console.log('useEffect - wordcard.js, word:', word);
    let url = ''
    switch (select) {
      case 'vi-vi':
        url = `http://localhost/api/records/vietviet/${encodeURI(word)}`
        break
      case 'vi-zh':
        url = `http://localhost/api/pages/${encodeURI(word)}`
        break
      case 'zh-vi':
        url = `http://localhost/api/records/hanviet/${encodeURI(word)}`
        break
      default:
    }
    axios
      .get(url)
      .then(function (response) {
        setIsPending(false);
        // console.log(response);
        const { data } = response;
        setDt(data);
        setError(null);
        // console.log('get data: ', data)
      })
      .catch(function (error) {
        console.log(error);
        setError(error.message);
      });
    return () => {
      console.log('wordcard clean..');
      setDt(null);
      setIsPending(true);
    }
  }, [select, word]);

  const vieviet = (data, classes) => {
    if (data === undefined || data === null) {
      return null
    }

    const { data1, data2 } = data.data
    console.log('vietviet -data:', data)
    console.log('vietviet-data1: ', data1)
    console.log('vietviet-data2: ', data2)
    let defs1 = null
    let defs2 = null

    if (data1 !== undefined && data1 !== null) {
      defs1 = data1.definitions
    }

    if (data2 !== undefined && data2 !== null) {
      defs2 = data2.items
    }

    if (defs1 === null && defs2 === null) {
      //TODO
      return (
        <div style={{ textAlign: 'center' }}>
          Not found in the dictionary :(
        </div>
      )
    }

    let preType = null
    let content = null
    if (defs1 !== null) {
      content = defs1.map((def, index) => {
        let badge = null
        if (def.type !== preType) {
          badge = <Chip component='span' size='small' label={def.type} />
          preType = def.type
        }

        const meaning = (
          <Typography className={classes.meaning} variant='body2' component='p'>
            {badge}
            {def.meaning}
          </Typography>
        )

        const examples = def.examples.map((example, index) => {
          return (
            <Typography
              key={index}
              className={classes.example}
              color='textSecondary'
              gutterBottom
            >
              {example}
            </Typography>
          )
        })
        return (
          <div key={index}>
            {meaning} {examples}
          </div>
        )
      })
    }

    let content2 = null
    if (defs2 !== null) {
      content2 = defs2.map((item, index) => {
        const badge = <Chip component='span' size='small' label={''} />
        return (
          <Typography
            key={index}
            className={classes.example}
            color='textSecondary'
            gutterBottom
          >
            {badge}
            {item}
          </Typography>
        )
      })
    }

    if (data1 !== null && data2 !== null) {
      return (
        <>
          <Typography variant='h5' component='h2'>
            {data1.title}
          </Typography>
          {content}
          <hr />
          <Typography variant='h5' component='h2'>
            {data2.title}
          </Typography>
          {content2}
        </>
      )
    } else if (data1 !== null && data2 === null) {
      return (
        <>
          <Typography variant='h5' component='h2'>
            {data1.title}
          </Typography>
          {content}
        </>
      )
    } else if (data1 === null && data2 !== null) {
      return (
        <>
          <Typography variant='h5' component='h2'>
            {data2.title}
          </Typography>
          {content2}
        </>
      )
    } else if (data1 === null && data2 === null) {
      return (
        <div style={{ textAlign: 'center' }}>
          Not found in the dictionary :(
        </div>
      )
    } else {
      return null
    }
  }

  const viethan = (data) => {
    if (data === null || data.status === false) {
      return null
    }
    const { page } = data.data
    if (page === -1)
      return (
        <div style={{ textAlign: 'center' }}>
          Not found in the dictionary :(
        </div>
      )
    return <PDF page={page} />
  }

  const createMarkup = (s) => {
    return { __html: s }
  }

  const MyComponent = (props) => {
    return <div dangerouslySetInnerHTML={createMarkup(props.str)} />
  }

  const hanviet = (data_t, classes) => {
    if (data_t === null) {
      return null
    }
    const { data } = data_t.data
    console.log('hanviet- data_t: ', data_t, 'data: ', data)
    if (data === null || data === undefined) {
      return (
        <div style={{ textAlign: 'center' }}>
          Not found in the dictionary :(
        </div>
      )
    }
    const defs = data.definition
    if (defs === '') {
      //TODO
      return (
        <div style={{ textAlign: 'center' }}>
          Not found in the dictionary :(
        </div>
      )
    }

    const content = (
      <Typography
        className={classes.example}
        color='textSecondary'
        component='div'
        gutterBottom
      >
        <MyComponent str={defs} />
      </Typography>
    )

    return (
      <>
        <Typography variant='h5' component='h2'>
          {data.title}
        </Typography>
        {content}
      </>
    )
  }

  let body = null;
  let learnmore = true;
  
  // setDt(data);
  switch (select) {
    case 'vi-vi':
      // const { data1, data2 } = data;
      body = vieviet(dt, classes);
      break;
    case 'vi-zh':
      body = viethan(dt);
      break;
    case 'zh-vi':
      body = hanviet(dt, classes);
      break;
    default:
      body = <>wow</>;
  }

  if (showLearnMore === true) {
    learnmore = (
      <Button
        size='small'
        onClick={(e) => {
          e.preventDefault();
          window.open('https://www.google.com/search?q=' + word, '_blank');
        }}
      >
        Learn More
      </Button>
    );
  } else {
    learnmore = <></>;
  }

  return (
    <div className='wordcard'>
      {/* {isPending && <Spin tip='Loading'/>} */}
      <Spin tip='Loading' spinning={isPending} style={{ marginTop: 50 }}>
        {error && <div>{error}</div>}
        {!isPending && dt && (
          <Card className={classes.root} variant='outlined'>
            <CardContent>{body}</CardContent>
            <CardActions>{learnmore}</CardActions>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default WordCard;
