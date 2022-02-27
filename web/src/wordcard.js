import React, { useEffect, useRef } from 'react';
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

import PDF from './pdf';
import useFetch from './useFetch';

import './style.css';
import ColumnGroup from 'antd/lib/table/ColumnGroup';

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

const vieviet = (data, classes) => {
  if (data === null) {
    return null;
  }
  const { data1, data2 } = data;
  console.log('vietviet-data1: ', data1);
  console.log('vietviet-data2: ', data2);
  let defs1 = null;
  let defs2 = null;

  if (data1 !== undefined && data1 !== null) {
    defs1 = data1.definitions;
  }

  if (data2 !== undefined && data2 !== null) {
    defs2 = data2.items;
  }

  if (defs1 === null && defs2 === null) {
    //TODO
    return <div>No this word in the dictionary :(</div>;
  }

  let preType = null;
  let content = null;
  if (defs1 !== null) {
    content = defs1.map((def, index) => {
      let badge = null;
      if (def.type !== preType) {
        badge = <Chip component='span' size='small' label={def.type} />;
        preType = def.type;
      }

      const meaning = (
        <Typography className={classes.meaning} variant='body2' component='p'>
          {badge}
          {def.meaning}
        </Typography>
      );

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
        );
      });
      return (
        <div key={index}>
          {meaning} {examples}
        </div>
      );
    });
  }

  let content2 = null;
  if (defs2 !== null) {
    content2 = defs2.map((item, index) => {
      const badge = <Chip component='span' size='small' label={''} />;
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
      );
    });
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
    );
  } else if (data1 !== null && data2 === null) {
    return (
      <>
        <Typography variant='h5' component='h2'>
          {data1.title}
        </Typography>
        {content}
      </>
    );
  } else if (data1 === null && data2 !== null) {
    return (
      <>
        <Typography variant='h5' component='h2'>
          {data2.title}
        </Typography>
        {content2}
      </>
    );
  } else {
    return <>No this word in the dictionary :(</>;
  }
};

const viethan = (data) => {
  if (data === null) {
    return null;
  }
  const { page } = data;
  if (page === -1) return <>No this word in the dictionary :(</>;
  return <PDF page={page} />;
};

const createMarkup = (s) => {
  return { __html: s };
};

const MyComponent = (props) => {
  return <div dangerouslySetInnerHTML={createMarkup(props.str)} />;
};

const hanviet = (data_t, classes) => {
  if (data_t === null) {
    return null;
  }
  const { data } = data_t;
  console.log('hanviet-data: ', data);
  if (data === null || data === undefined) {
    return null;
  }
  const defs = data.definition;
  if (defs === '') {
    //TODO
    return <div>No this word in the dictionary :(</div>;
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
  );

  return (
    <>
      <Typography variant='h5' component='h2'>
        {data.title}
      </Typography>
      {content}
    </>
  );
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const WordCard = ({ onInputChange, showLearnMore }) => {
  const { word } = useParams();
  const location = useLocation();
  const select = location.pathname.split('/')[1];
  console.log('wordcard.js, word1:', word, 'select: ', select);

  const classes = useStyles();

  useEffect(() => {
    console.log('wordcard.js, word:', word);
    onInputChange(word);
  }, []);

  let url = '';
  let body = null;
  let learnmore = true;
  switch (select) {
    case 'vi-vi':
      url = `http://localhost/api/records/vietviet/${encodeURI(word)}`;
      break;
    case 'vi-zh':
      url = `http://localhost/api/pages/${encodeURI(word)}`;
      break;
    case 'zh-vi':
      url = `http://localhost/api/records/hanviet/${encodeURI(word)}`;
      break;
    default:
  }

  const { data, error, isPending } = useFetch(url);
  switch (select) {
    case 'vi-vi':
      // const { data1, data2 } = data;
      body = vieviet(data, classes);
      break;
    case 'vi-zh':
      body = viethan(data);
      break;
    case 'zh-vi':
      body = hanviet(data, classes);
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
      {isPending && <div>Loading</div>}
      {error && <div>{error}</div>}
      {body && (
        <Card className={classes.root} variant='outlined'>
          <CardContent>{body}</CardContent>
          <CardActions>{learnmore}</CardActions>
        </Card>
      )}
    </div>
  );
};

export default WordCard;
