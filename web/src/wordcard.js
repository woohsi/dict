import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

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
    fontSize: 12,
    marginLeft: '10px',
  },
  meaning: {},
  pos: {
    marginBottom: 12,
  },
});

export default function WordCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const record = props.record;
  const defs = record.definitions;
  let preType = null;
  if (defs === undefined) {
    //TODO
    return <div></div>
  }
  const body = defs.map((def, index) => {
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

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography variant='h5' component='h2'>
          {record.title}
        </Typography>

        {body}

        {/* <Typography className={classes.meaning} variant='body2' component='p'>
          <Chip size='small' label='đg.' />
          không còn nữa, sau một quá trình tiêu hao, mất dần
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          1. hết tiền
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          2. hết hạn sử dụng
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          3. súng hết đạn
        </Typography>

        <Typography className={classes.meaning} variant='body2' component='p'>
        
          không còn nữa, sau một quá trình tiêu hao, mất dần
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          1. hết tiền
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          2. hết hạn sử dụng
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          3. súng hết đạn
        </Typography>

        <Typography className={classes.meaning} variant='body2' component='p'>
          <Chip size='small' label='p.' />
          từ biểu thị ý kết thúc, không còn tiếp tục, tiếp diễn hay tồn tại một
          hoạt động, trạng thái, tính chất nào đó
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          1. trời hết mưa
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          2. hết giận
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          3. Còn duyên kẻ đón người đưa, Hết duyên đi sớm về trưa mặc lòng.
          (Cdao)
        </Typography>

        <Typography className={classes.meaning} variant='body2' component='p'>
          <Chip size='small' label='tr.' />
          từ biểu thị ý nhấn mạnh về phạm vi không hạn chế của điều vừa phủ định
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          1. không có đi đâu hết!
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          2. chẳng làm sao hết!
        </Typography>
        <Typography
          className={classes.example}
          color='textSecondary'
          gutterBottom
        >
          3. không còn gì nữa hết!
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
}
