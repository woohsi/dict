import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

export default function Demo() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <Button variant='text' color='default'></Button>
    </div>
  );
}
