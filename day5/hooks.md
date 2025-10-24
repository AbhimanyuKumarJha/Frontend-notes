# React.js Basics - Part 3: Hooks Deep Dive & Side Effects

## Revisiting What We Know

Before we explore new hooks, let's anchor ourselves. In Parts 1 and 2, you learned about `useState` for managing component data that changes over time.

**Quick reflection:** Think about your todo application. Right now with just `useState`, what happens to your todos when you refresh the page? What happens if you wanted to fetch todos from that API (`https://dummyjson.com/todos`) when your component first loads?

Take a moment to consider - what's missing from our current toolkit to handle these scenarios?

---

## Understanding Side Effects

A **side effect** is any operation that reaches outside your component's rendering logic. Let me give you some examples, and I want you to think about which of these you've needed in your projects:

- Fetching data from an API
- Directly manipulating the DOM
- Setting up subscriptions or timers
- Storing data in localStorage
- Logging to the console

**Question for you:** Looking at that list, which of these apply to your todo app assignment? Specifically, think about:

1. Fetching todos from the API
2. Persisting todos so they survive a page refresh

Got your answers? Good. Let's see how React handles these.

---

## The useEffect Hook

`useEffect` lets you perform side effects in function components. But before I show you the syntax, let me ask: **When do you think these side effects should run?**

Should they run:

- Every single time the component re-renders?
- Only once when the component first appears?
- Only when specific data changes?

Think about fetching todos from an API. Would you want to fetch them every time any state changes, or just once when the page loads?

### Basic Syntax

```javascript
import { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // This runs after every render
  useEffect(() => {
    console.log("Component rendered or updated");
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

**Pause here:** Run this code in your mind. How many times will that console.log run?

- Once when component mounts?
- After every button click?
- Both?

Try it in your code editor and observe. What did you discover?

---

## The Dependency Array

Now here's the crucial part. `useEffect` takes a second argument - the **dependency array**:

```javascript
// Pattern 1: Runs after EVERY render
useEffect(() => {
  console.log("I run after every render");
});

// Pattern 2: Runs ONCE after initial render
useEffect(() => {
  console.log("I run only once, when component mounts");
}, []);

// Pattern 3: Runs when specific values change
useEffect(() => {
  console.log("I run when count changes");
}, [count]);
```

**Challenge question:** Before reading further, can you predict what would happen if you have:

```javascript
const [count, setCount] = useState(0);
const [name, setName] = useState("");

useEffect(() => {
  console.log("Effect ran!");
}, [count]);
```

Would changing `name` trigger the effect? Why or why not?

---

## Fetching Data with useEffect

Let's tackle your assignment requirement - fetching todos from the API. Before I show you the code, think through the logic:

1. **When** should we fetch? (On mount, on every render, or...?)
2. **What state** do we need? (Just todos, or something else?)
3. **What if** the fetch is slow? Should we show anything to the user?

Here's one approach:

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This runs once when component mounts
    fetch("https://dummyjson.com/todos")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data.todos);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty array = run once

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} readOnly />
          {todo.todo}
        </li>
      ))}
    </ul>
  );
}
```

**Analyze this code:**

1. Why do we need THREE state variables (todos, loading, error)?
2. What's the purpose of that empty `[]` dependency array?
3. What would happen if we removed it?

Try removing the `[]` and see what happens. Can you explain the behavior you observe?

---

## Using async/await (Cleaner Syntax)

The code above works, but many developers prefer async/await. However, there's a gotcha:

```javascript
// ❌ This won't work - useEffect callback can't be async directly
useEffect(async () => {
  const response = await fetch("https://dummyjson.com/todos");
  const data = await response.json();
  setTodos(data.todos);
}, []);

// ✅ This is the correct pattern
useEffect(() => {
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dummyjson.com/todos");
      const data = await response.json();
      setTodos(data.todos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchTodos();
}, []);
```

**Question for you:** Why do you think React doesn't allow the useEffect callback to be async directly? What problems might that cause? (Hint: think about what async functions return...)

---

## Cleanup Functions

Some effects need cleanup. Let me show you an example, then you tell me why:

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log("Setting up timer");

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      console.log("Cleaning up timer");
      clearInterval(interval);
    };
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

**Think about this scenario:** What if this Timer component gets removed from the screen? What would happen to that `setInterval` if we didn't have the cleanup function?

Try this experiment:

1. Create a component that toggles the Timer on/off
2. Remove the cleanup function
3. Toggle the Timer multiple times
4. Watch what happens to the timer speed

What did you observe? Why does this happen?

---

## Common useEffect Patterns

### Pattern 1: Fetching Data Based on Props/State

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.example.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // Re-fetch when userId changes

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

**Question:** Why is `userId` in the dependency array? What would happen if we left the array empty?

### Pattern 2: Synchronizing with Local Storage

```javascript
function TodoAppWithPersistence() {
  const [todos, setTodos] = useState(() => {
    // Lazy initialization - only runs once
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ... rest of component
}
```

**Reflection:** This solves the "data disappears on refresh" problem. Can you trace through what happens:

1. On first load (no saved data)?
2. After adding a todo?
3. After refreshing the page?

### Pattern 3: Event Listeners

```javascript
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Window width: {width}px</p>;
}
```

**Challenge:** Why is cleanup important here? What would happen if we didn't remove the event listener?

---

## The useRef Hook

Before I explain `useRef`, let me ask you a question: Have you ever needed to:

- Focus an input field programmatically?
- Store a value that persists across renders but doesn't trigger re-renders when it changes?
- Access a DOM element directly?

If you answered yes to any of these, you need `useRef`.

### Accessing DOM Elements

```javascript
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

**Try this:** Create a todo app where the input automatically focuses after you add a todo. How would you use `useRef` for that?

### Storing Mutable Values

```javascript
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
```

**Compare and contrast:**

- What's the difference between storing the interval ID in `useRef` vs `useState`?
- What would happen if we used `useState` for the interval ID?

Try it both ways and observe the behavior!

---

## The useContext Hook

Imagine you have this component tree:

```
App
  └── Dashboard
      └── Sidebar
          └── UserMenu
              └── UserAvatar
```

If `UserAvatar` needs user data from `App`, you'd have to pass it through every level (this is called "prop drilling").

**Question:** Have you experienced this in your projects? How many levels deep have you had to pass props?

Context solves this:

```javascript
import { createContext, useContext, useState } from "react";

// 1. Create context
const UserContext = createContext();

// 2. Provider component
function App() {
  const [user, setUser] = useState({ name: "Alice", role: "Admin" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

// 3. Deeply nested component can access context
function UserAvatar() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}
```

**Exercise:** Think about your todo app. What data might you want to share across multiple components using context?

- Theme (light/dark mode)?
- User authentication status?
- Filter settings (show all/active/completed)?

---

## The useReducer Hook

`useReducer` is like `useState` on steroids. It's great for complex state logic. Before showing you how, let's think about when you'd use it.

**Scenario:** Your todo app state includes:

- List of todos
- Current filter (all/active/completed)
- Sort order (date/priority)
- Search term

Managing all these with separate `useState` calls gets messy. `useReducer` helps organize this.

```javascript
// Define possible actions
const initialState = {
  todos: [],
  filter: "all",
  sortBy: "date",
};

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = (text) => {
    dispatch({
      type: "ADD_TODO",
      payload: { id: Date.now(), text, completed: false },
    });
  };

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  return (
    <div>
      <button onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}>
        All
      </button>
      <button
        onClick={() => dispatch({ type: "SET_FILTER", payload: "active" })}
      >
        Active
      </button>
      {/* ... rest of UI */}
    </div>
  );
}
```

**Compare:** Look at this vs multiple `useState` calls. What are the advantages of the reducer pattern? When would you choose `useReducer` over `useState`?

---

## The useMemo Hook

`useMemo` is for **performance optimization**. It memoizes (caches) expensive calculations.

```javascript
function TodoList({ todos, filter }) {
  // Without useMemo - filters on every render
  const filteredTodos = todos.filter((todo) => {
    console.log("Filtering..."); // This runs on EVERY render
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // With useMemo - only re-filters when dependencies change
  const filteredTodos = useMemo(() => {
    console.log("Filtering..."); // Only runs when todos or filter changes
    return todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  }, [todos, filter]);

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**Experiment:**

1. Try both versions with 1000 todos
2. Add another piece of state that changes frequently (like a search term elsewhere)
3. Observe how many times "Filtering..." logs in each approach

When do you think the performance difference matters?

---

## The useCallback Hook

`useCallback` is similar to `useMemo`, but for **functions**:

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);

  // Without useCallback - new function on every render
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  // With useCallback - same function reference across renders
  const addTodo = useCallback((text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
  }, []); // No dependencies because we use functional update

  return <TodoForm onSubmit={addTodo} />;
}

// Child component can use React.memo to avoid re-rendering
const TodoForm = React.memo(({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
});
```

**Think about it:** Why does `useCallback` matter here? What happens if `TodoForm` is wrapped in `React.memo` but we don't use `useCallback` for `addTodo`?

---

## Custom Hooks

You can create your own hooks! They're just functions that use other hooks.

### Example: useFetch

```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function TodoApp() {
  const { data, loading, error } = useFetch("https://dummyjson.com/todos");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.todos.map((todo) => (
        <li key={todo.id}>{todo.todo}</li>
      ))}
    </ul>
  );
}
```

**Challenge:** Can you create a `useLocalStorage` hook that:

1. Reads from localStorage on mount
2. Saves to localStorage when value changes
3. Has the same API as `useState`

Try before looking at the solution below!

<details>
<summary>Solution</summary>

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function TodoApp() {
  const [todos, setTodos] = useLocalStorage('todos', []);

  // Use it just like useState!
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  return (/* ... */);
}
```

</details>

---

## Putting It All Together: Complete Todo App with Hooks

Now let's build a feature-rich todo app using multiple hooks:

```javascript
import { useState, useEffect, useReducer, useRef, useMemo } from "react";

// Reducer for complex state management
function todoReducer(state, action) {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload };
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
    searchTerm: "",
  });

  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("https://dummyjson.com/todos");
        const data = await response.json();
        dispatch({ type: "SET_TODOS", payload: data.todos });
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Persist todos to localStorage
  useEffect(() => {
    if (state.todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(state.todos));
    }
  }, [state.todos]);

  // Memoized filtered and searched todos
  const filteredTodos = useMemo(() => {
    let result = state.todos;

    // Apply filter
    if (state.filter === "active") {
      result = result.filter((todo) => !todo.completed);
    } else if (state.filter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    // Apply search
    if (state.searchTerm) {
      result = result.filter((todo) =>
        todo.todo.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    return result;
  }, [state.todos, state.filter, state.searchTerm]);

  const addTodo = (text) => {
    if (!text.trim()) return;

    const newTodo = {
      id: Date.now(),
      todo: text,
      completed: false,
      userId: 1,
    };

    dispatch({ type: "ADD_TODO", payload: newTodo });
    inputRef.current.focus();
  };

  if (loading) return <div>Loading todos...</div>;

  return (
    <div className="todo-app">
      <h1>Todo Application</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search todos..."
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH", payload: e.target.value })
        }
      />

      {/* Filter Buttons */}
      <div>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}
        >
          All ({state.todos.length})
        </button>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "active" })}
        >
          Active ({state.todos.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "completed" })}
        >
          Completed ({state.todos.filter((t) => t.completed).length})
        </button>
      </div>

      {/* Add Todo */}
      <TodoForm ref={inputRef} onSubmit={addTodo} />

      {/* Todo List */}
      <ul>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
            onDelete={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}
          />
        ))}
      </ul>
    </div>
  );
}

// Separate components for better organization
function TodoForm({ onSubmit }, ref) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={ref}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={onToggle} />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
      >
        {todo.todo}
      </span>
      <button onClick={onDelete}>Delete</button>
    </li>
  );
}
```

---

## Practice Challenges

Now it's your turn to explore! Try these exercises:

### Challenge 1: Debug the Effect

```javascript
function BrokenComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  }, [count]);

  return <div>Count: {count}</div>;
}
```

**Question:** What's wrong with this code? What will happen when it runs? How would you fix it?

### Challenge 2: Build a Timer with Pause

Create a timer that:

- Counts up every second
- Has start/pause/reset buttons
- Persists the time to localStorage
- Resumes from saved time on page refresh

Which hooks will you need? Sketch out your approach before coding.

### Challenge 3: Create a useDebounce Hook

Build a custom hook that delays updating a value until the user stops typing:

```javascript
function SearchComponent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // This only runs 500ms after user stops typing
    console.log("Searching for:", debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

Can you implement `useDebounce`? Think about what hooks you'll need inside it.

---

## Common Mistakes & How to Avoid Them

### Mistake 1: Missing Dependencies

```javascript
// ❌ ESLint will warn about this
useEffect(() => {
  console.log(count);
}, []); // count is missing from dependencies

// ✅ Include all dependencies
useEffect(() => {
  console.log(count);
}, [count]);
```

**Why does this matter?** Try creating a component where you ignore this warning. What unexpected behavior do you see?

### Mistake 2: Infinite Loops

```javascript
// ❌ Infinite loop
useEffect(() => {
  setCount(count + 1);
}, [count]); // Updates count, which triggers effect, which updates count...

// ✅ Think carefully about dependencies
useEffect(() => {
  // Only run on mount
  setCount(0);
}, []);
```

### Mistake 3: Async Effect Functions

```javascript
// ❌ Don't make the effect callback async
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);

// ✅ Define async function inside
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  };
  loadData();
}, []);
```

---

## Key Takeaways

✓ **useEffect**: Run side effects at the right time with dependency arrays  
✓ **useRef**: Access DOM elements and store mutable values that don't trigger renders  
✓ **useContext**: Share data across components without prop drilling  
✓ **useReducer**: Manage complex state with predictable state transitions  
✓ **useMemo**: Cache expensive calculations  
✓ **useCallback**: Cache function references for performance  
✓ **Custom Hooks**: Extract and reuse stateful logic

---

## Final Reflection Questions

Before moving forward, take some time to think deeply:

1. **For your todo app:** Which hooks have you used so far? Which additional hooks could improve it?

2. **Compare approaches:** When would you choose `useReducer` over `useState`? Can you think of a scenario from your own projects?

3. **Performance:** When does memoization (`useMemo`, `useCallback`) actually matter? Have you tried measuring the difference?

4. **Custom hooks:** What repeated logic in your code could be extracted into a custom hook?

5. **Side effects:** Can you list 5 different side effects your app might need and explain which hook pattern you'd use for each?

---

**Next Steps:**

Now that you understand hooks deeply, you're ready to:

- Complete your todo app with API fetching
- Add localStorage persistence
- Implement advanced features like search and filtering
- Create your own custom hooks

In **Part 4**, we'll explore:

- Component composition patterns
- Performance optimization strategies
- Testing React components
- Preparing for production deployment

But before that - go build something! The best way to solidify this knowledge is to apply it. What will you create? 🚀
