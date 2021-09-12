import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import PDF from './pdf';
import './style.css'
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

const vieviet = (record, record2, classes) => {

  const defs = record.definitions;
  const defs2 = record2.items;
  console.log("defs", defs)
  console.log("defs2", defs2)
  if (defs === undefined && defs2 === undefined) {
    //TODO
    return <div></div>;
  }

  let preType = null;

  const content = defs.map((def, index) => {
    let badge = null;
    if (def.type !== preType) {
      badge = <Chip size='small' label={def.type} />;
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
      <>
        {meaning} {examples}
      </>
    );
  });

  const content2 = defs2.map((item, index) => {
    const badge = <Chip size='small' label={""} />;
    return (
      <Typography
        key={index}
        className={classes.example}
        color='textSecondary'
        gutterBottom
      >
        {badge}{item}
      </Typography>
    );
  });

  return (
    <>
      <Typography variant='h5' component='h2'>
        {record.title}
      </Typography>
      {content}
      <hr/>
      <Typography variant='h5' component='h2'>
        {record2.title}
      </Typography>
      {content2}
    </>
  );
};

const viethan = (page) => {
  if (page === -1) return <></>
  return <PDF page={page} />;
};

function createMarkup(s) {
  return {__html: s};
}

function MyComponent(props) {
  return <div dangerouslySetInnerHTML={createMarkup(props.str)} />;
}

const hanviet = (record3, classes) => {
  const defs = record3.definition;
  if (defs === undefined) {
    //TODO
    return <div dangerouslySetInnerHTML={{__html: defs}}></div>;
  }

  const content =  (
      <Typography
        className={classes.example}
        color='textSecondary'
        gutterBottom
      >
        <MyComponent str={defs}/>
      </Typography>
    );

  return (
    <>
      <Typography variant='h5' component='h2'>
        {record3.title}
      </Typography>
      {content}
    </>
  );
};

export default function WordCard(props) {
  const classes = useStyles();

  let record = null;
  let record2 = null;
  let record3 = null;
  let page = 1;
  let body = null;
  let learnmore = null;
  //debugger;
  if (props.select === '') {
    body = <></>
  }

  if (props.select === 'vietviet') {
    record = props.record;
    record2 = props.record2;
    body = vieviet(record, record2, classes);
  }

  if (props.select === 'viethan') {
    page = props.page;
    body = viethan(page);
  }

  if (props.select === 'hanviet') {
    record3 = props.record3;
    body = hanviet(record3, classes);
  }

  if (props.showLearnMore === true) {
    learnmore = <Button size='small' onClick={(e) => { e.preventDefault(); window.open("https://www.google.com/search?q=" + props.word, "_blank");}}>Learn More</Button>
  } else {
    learnmore = <></>
  }

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>{body}</CardContent>
      <CardActions>{learnmore}</CardActions>
    </Card>
  );
}
