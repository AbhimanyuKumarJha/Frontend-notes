# useEffect Hook

## Overview

`useEffect` allows you to perform side effects in functional components. Side effects are operations that reach outside the component's rendering logic, such as API calls, subscriptions, or DOM manipulation.

## Syntax

```javascript
useEffect(() => {
  // Side effect code here

  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```

## When to Use

- Fetching data from APIs
- Setting up subscriptions or event listeners
- Manipulating the DOM directly
- Synchronizing with browser APIs (localStorage, etc.)
- Setting up timers or intervals
- Logging or analytics

## Advantages

✅ **Lifecycle Management**: Replaces componentDidMount, componentDidUpdate, and componentWillUnmount  
✅ **Conditional Execution**: Run effects only when specific values change  
✅ **Cleanup Support**: Automatically cleanup subscriptions and listeners  
✅ **Multiple Effects**: Organize related logic together  
✅ **Synchronization**: Keep component in sync with external systems

## The Dependency Array

### Pattern 1: No Dependency Array (Runs After Every Render)

```javascript
useEffect(() => {
  console.log("Runs after every render");
  document.title = `You clicked ${count} times`;
});
// ⚠️ Usually not what you want - can cause performance issues
```

### Pattern 2: Empty Dependency Array (Runs Once on Mount)

```javascript
useEffect(() => {
  console.log("Runs only once when component mounts");

  return () => {
    console.log("Cleanup when component unmounts");
  };
}, []); // ✅ Perfect for initial setup
```

### Pattern 3: With Dependencies (Runs When Dependencies Change)

```javascript
useEffect(() => {
  console.log("Runs when count or name changes");
}, [count, name]); // ✅ Most common pattern
```

## Basic Examples

### Example 1: Updating Document Title

```javascript
import { useState, useEffect } from "react";

function PageTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // Only update title when count changes

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### Example 2: Fetching Data on Mount

```javascript
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty array = run once on mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Fetching Data with Async/Await

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Can't make the effect callback async directly
    // Create async function inside instead
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Re-fetch when userId changes

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
}
```

## Cleanup Functions

### Example 1: Event Listeners

```javascript
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function - remove listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Only set up once

  return (
    <div>
      Window: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

### Example 2: Timers and Intervals

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup: clear interval when component unmounts
    // or when isRunning changes
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
```

### Example 3: Subscriptions (WebSocket)

```javascript
function LiveChat({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`wss://chat.example.com/${roomId}`);

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // Cleanup: close connection
    return () => {
      ws.close();
    };
  }, [roomId]); // Reconnect when room changes

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  );
}
```

## Advanced Patterns

### Pattern 1: Synchronizing with localStorage

```javascript
function PersistentTodos() {
  const [todos, setTodos] = useState(() => {
    // Lazy initialization - read from localStorage
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };

  return <div>{/* Todo UI */}</div>;
}
```

### Pattern 2: Debouncing API Calls

```javascript
function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Don't search for empty query
    if (!query) {
      setResults([]);
      return;
    }

    // Debounce: wait 500ms after user stops typing
    const timeoutId = setTimeout(() => {
      fetch(`https://api.example.com/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data));
    }, 500);

    // Cleanup: cancel previous timeout
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Pattern 3: Abort Controller for Fetch Cancellation

```javascript
function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.example.com/users/${userId}`,
          { signal: abortController.signal }
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Cleanup: abort fetch if userId changes
    return () => abortController.abort();
  }, [userId]);

  return loading ? <p>Loading...</p> : <div>{user?.name}</div>;
}
```

### Pattern 4: Multiple Effects for Separation of Concerns

```javascript
function Dashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Effect 1: Fetch user data
  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  // Effect 2: Fetch user posts
  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}/posts`)
      .then((res) => res.json())
      .then(setPosts);
  }, [userId]);

  // Effect 3: Update document title
  useEffect(() => {
    if (user) {
      document.title = `${user.name}'s Dashboard`;
    }
  }, [user]);

  return (
    <div>
      <h1>{user?.name}</h1>
      {posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}
```

## Common Pitfalls

### ❌ Mistake 1: Infinite Loop

```javascript
// BAD: Creates infinite loop
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // This triggers re-render
  }, [count]); // Which runs the effect again!

  return <div>{count}</div>;
}

// GOOD: Use appropriate dependencies
useEffect(() => {
  // Run once on mount
  setCount(0);
}, []); // Empty array
```

### ❌ Mistake 2: Missing Dependencies

```javascript
// BAD: ESLint will warn
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query); // Uses 'query' but not in deps
  }, []); // ❌ Missing 'query' dependency

  // GOOD: Include all dependencies
  useEffect(() => {
    fetchResults(query);
  }, [query]); // ✅ Correct
}
```

### ❌ Mistake 3: Not Cleaning Up

```javascript
// BAD: Memory leak
function BadTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    // ❌ No cleanup - interval keeps running!
  }, []);
}

// GOOD: Always cleanup
function GoodTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id); // ✅ Cleanup
  }, []);
}
```

### ❌ Mistake 4: Async Effect Callback

```javascript
// BAD: Effect callback can't be async
useEffect(async () => {
  const data = await fetchData(); // ❌ Won't work
  setData(data);
}, []);

// GOOD: Define async function inside
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData(); // ✅ Works
    setData(data);
  };
  loadData();
}, []);
```

## Best Practices

1. **One Effect, One Purpose**: Each effect should handle one concern
2. **Always Cleanup**: Remove listeners, clear timers, abort fetches
3. **Include All Dependencies**: Listen to ESLint warnings
4. **Use Async Functions Inside**: Don't make effect callback async
5. **Guard Against Race Conditions**: Use cleanup or flags for async operations
6. **Separate Effects**: Don't combine unrelated logic in one effect

## Real-World Use Cases

### 1. Auto-Save Form

```javascript
function AutoSaveForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSaveStatus("Saving...");

      fetch("/api/save", {
        method: "POST",
        body: JSON.stringify(formData),
      })
        .then(() => setSaveStatus("Saved!"))
        .catch(() => setSaveStatus("Error saving"));
    }, 1000); // Wait 1s after last change

    return () => clearTimeout(timeoutId);
  }, [formData]);

  return (
    <div>
      <input
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />
      <span>{saveStatus}</span>
    </div>
  );
}
```

### 2. Scroll to Top on Route Change

```javascript
function ScrollToTop({ pathname }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Scroll when route changes

  return null;
}
```

### 3. Authentication Check

```javascript
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch("/api/check-auth")
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}
```

## Performance Considerations

- Effects run **after** render, not during
- Cleanup runs **before** the next effect and on unmount
- Multiple effects run in the order they're defined
- Consider `useMemo` or `useCallback` for dependencies that are functions or objects

## When NOT to Use useEffect

- ❌ Don't use for calculations during render (do them inline)
- ❌ Don't use for event handlers (use event handlers instead)
- ❌ Don't use to transform data for rendering (do it during render)
- ❌ Don't use to initialize state (use useState initializer)

## Summary

`useEffect` is your tool for synchronizing React components with external systems. Master the dependency array, always cleanup side effects, and organize related logic together.

**Key Takeaway**: Use `useEffect` when you need to step outside React and interact with external systems or perform side effects that shouldn't happen during rendering.
