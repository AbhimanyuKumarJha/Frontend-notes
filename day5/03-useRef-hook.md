# useRef Hook

## Overview

`useRef` returns a mutable ref object whose `.current` property persists across renders. Unlike state, updating a ref doesn't trigger a re-render. It's perfect for accessing DOM elements and storing mutable values.

## Syntax

```javascript
const refContainer = useRef(initialValue);
```

## When to Use

- Accessing DOM elements directly
- Storing mutable values that don't trigger re-renders
- Keeping track of previous values
- Storing timer IDs, subscription IDs, or any mutable data
- Implementing focus management
- Integrating with third-party DOM libraries

## Advantages

✅ **No Re-renders**: Updating ref doesn't cause component to re-render  
✅ **Persistent**: Value persists across renders (like instance variables)  
✅ **DOM Access**: Direct way to access and manipulate DOM elements  
✅ **Synchronous**: Unlike setState, ref updates are immediate  
✅ **Mutable**: Can be updated without following immutability rules

## Basic Examples

### Example 1: Accessing DOM Elements

```javascript
import { useRef } from "react";

function FocusInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    // Access the DOM node directly
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

### Example 2: Storing Previous Value

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  const prevCount = prevCountRef.current;

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Example 3: Storing Mutable Values

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

## useRef vs useState

### Key Differences

```javascript
function ComparisonExample() {
  // useState: Triggers re-render when updated
  const [stateValue, setStateValue] = useState(0);

  // useRef: Does NOT trigger re-render when updated
  const refValue = useRef(0);

  console.log("Component rendered");

  return (
    <div>
      <p>State: {stateValue}</p>
      <p>Ref: {refValue.current}</p>

      {/* This causes re-render */}
      <button onClick={() => setStateValue(stateValue + 1)}>
        Update State (Re-renders)
      </button>

      {/* This does NOT cause re-render */}
      <button
        onClick={() => {
          refValue.current += 1;
          console.log("Ref updated to:", refValue.current);
        }}
      >
        Update Ref (No Re-render)
      </button>
    </div>
  );
}
```

### When to Use Which?

```javascript
// ✅ Use useState when:
// - Value affects UI rendering
// - You want component to re-render when value changes
const [count, setCount] = useState(0);

// ✅ Use useRef when:
// - Value doesn't affect UI
// - You need immediate synchronous updates
// - Storing timer IDs, DOM elements, etc.
const renderCount = useRef(0);
```

## Advanced Patterns

### Pattern 1: Tracking Render Count

```javascript
function ComponentWithRenderCount() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return <div>This component has rendered {renderCount.current} times</div>;
}
```

### Pattern 2: Auto-Focus on Mount

```javascript
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

### Pattern 3: Measuring Element Size

```javascript
function ElementSize() {
  const divRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (divRef.current) {
        setSize({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={divRef}>
      Size: {size.width}px × {size.height}px
    </div>
  );
}
```

### Pattern 4: Scroll to Element

```javascript
function ScrollToSection() {
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      <button onClick={scrollToSection}>Scroll to Section</button>

      <div style={{ height: "100vh" }}>Spacer content...</div>

      <div ref={sectionRef}>
        <h2>Target Section</h2>
      </div>
    </div>
  );
}
```

### Pattern 5: Debounce with useRef

```javascript
function DebouncedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  const handleSearch = (value) => {
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      fetch(`/api/search?q=${value}`)
        .then((res) => res.json())
        .then(setResults);
    }, 500);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Pattern 6: Callback Ref (Advanced)

```javascript
function CallbackRefExample() {
  const [height, setHeight] = useState(0);

  // Callback ref - called when element is mounted/unmounted
  const measuredRef = (node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  };

  return (
    <div>
      <h1 ref={measuredRef}>Hello, world</h1>
      <p>The above header is {Math.round(height)}px tall</p>
    </div>
  );
}
```

### Pattern 7: Forwarding Refs

```javascript
import { forwardRef } from "react";

// Child component that accepts a ref
const FancyInput = forwardRef((props, ref) => (
  <div>
    <input ref={ref} {...props} className="fancy-input" />
  </div>
));

// Parent component using the child's ref
function Parent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

## Real-World Use Cases

### 1. Form with Auto-Focus Next Field

```javascript
function MultiStepForm() {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const handleInput1Complete = (e) => {
    if (e.target.value.length >= 3) {
      input2Ref.current?.focus();
    }
  };

  const handleInput2Complete = (e) => {
    if (e.target.value.length >= 3) {
      input3Ref.current?.focus();
    }
  };

  return (
    <form>
      <input
        ref={input1Ref}
        maxLength={3}
        onChange={handleInput1Complete}
        placeholder="First Name"
      />
      <input
        ref={input2Ref}
        maxLength={3}
        onChange={handleInput2Complete}
        placeholder="Last Name"
      />
      <input ref={input3Ref} placeholder="Email" />
    </form>
  );
}
```

### 2. Video Player Controls

```javascript
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={() => handleSeek(-10)}>-10s</button>
      <button onClick={() => handleSeek(10)}>+10s</button>
    </div>
  );
}
```

### 3. Click Outside Detector

```javascript
function ClickOutsideExample() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
      {isOpen && (
        <div ref={menuRef} className="menu">
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}
```

### 4. Canvas Drawing

```javascript
function Canvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: "1px solid black" }}
    />
  );
}
```

### 5. Previous Props/State Hook

```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

## Common Pitfalls

### ❌ Mistake 1: Using Ref Value in Render Logic

```javascript
// BAD: Using ref in conditional render
function BadComponent() {
  const ref = useRef(0);

  return (
    <div>
      {ref.current > 5 && <p>Greater than 5</p>}
      {/* This won't re-render when ref changes! */}
    </div>
  );
}

// GOOD: Use state for values that affect rendering
function GoodComponent() {
  const [value, setValue] = useState(0);

  return <div>{value > 5 && <p>Greater than 5</p>}</div>;
}
```

### ❌ Mistake 2: Accessing Ref Before It's Set

```javascript
// BAD
function BadComponent() {
  const ref = useRef(null);
  console.log(ref.current.value); // ❌ May be null!

  return <input ref={ref} />;
}

// GOOD
function GoodComponent() {
  const ref = useRef(null);

  useEffect(() => {
    console.log(ref.current.value); // ✅ Safe after mount
  }, []);

  return <input ref={ref} />;
}
```

### ❌ Mistake 3: Forgetting Cleanup

```javascript
// BAD
function BadTimer() {
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  };
  // ❌ No cleanup!
}

// GOOD
function GoodTimer() {
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // ✅ Cleanup
      }
    };
  }, []);
}
```

## Best Practices

1. **Don't Read/Write During Render**: Refs are for side effects
2. **Use for Non-Visual Data**: If it affects rendering, use state
3. **Always Check for null**: DOM refs might not be ready
4. **Cleanup Side Effects**: Clear intervals, remove listeners
5. **Optional Chaining**: Use `ref.current?.method()` for safety

## Performance Considerations

- Refs don't cause re-renders (unlike state)
- Perfect for frequently updated values that don't affect UI
- Accessing DOM directly can be faster than state updates
- Use for third-party library integration

## When NOT to Use useRef

- ❌ Don't use for values that should trigger re-renders (use useState)
- ❌ Don't manipulate DOM when React can handle it declaratively
- ❌ Don't use to store derived values (calculate during render)
- ❌ Don't use for server-side rendering (no DOM available)

## Summary

`useRef` is perfect for accessing DOM elements and storing mutable values without triggering re-renders. It's essential for focus management, animations, third-party library integration, and tracking values across renders.

**Key Takeaway**: Use `useRef` when you need a mutable value that persists across renders but doesn't need to trigger a re-render when it changes.
