import { useState } from 'react';

// Simple counter component
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '8px' }}>Decrement</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: '8px' }}>Reset</button>
    </div>
  );
}

export default Counter;
