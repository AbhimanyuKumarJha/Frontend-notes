# useState Hook

## Overview

`useState` is the most fundamental React Hook that allows you to add state to functional components. It returns a stateful value and a function to update it.

## Syntax

```javascript
const [state, setState] = useState(initialValue);
```

## When to Use

- Managing component-local data that changes over time
- Tracking form inputs
- Toggling UI elements (modals, dropdowns, etc.)
- Counting, tracking booleans, managing simple objects or arrays

## Advantages

✅ **Simplicity**: Easy to understand and use for simple state management  
✅ **Component-Scoped**: State is isolated to the component and its children  
✅ **Multiple States**: Can use multiple `useState` calls for different pieces of state  
✅ **Functional Updates**: Supports functional updates for reliable state transitions  
✅ **Lazy Initialization**: Can pass a function for expensive initial calculations

## Basic Examples

### Simple Counter

```javascript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Managing Different Data Types

#### Boolean State

```javascript
function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  return <button onClick={() => setIsOn(!isOn)}>{isOn ? "ON" : "OFF"}</button>;
}
```

#### String State

```javascript
function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

#### Array State

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Object State

```javascript
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  const updateField = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => updateField("email", e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={user.age}
        onChange={(e) => updateField("age", e.target.value)}
        placeholder="Age"
      />
    </form>
  );
}
```

## Advanced Patterns

### Functional Updates

Use when the new state depends on the previous state:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Not reliable in async operations
  const incrementBad = () => {
    setCount(count + 1);
    setCount(count + 1); // Won't add 2, only adds 1
  };

  // ✅ Reliable - uses the latest state
  const incrementGood = () => {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1); // Correctly adds 2
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementGood}>+2</button>
    </div>
  );
}
```

### Lazy Initialization

Use when initial state calculation is expensive:

```javascript
function ExpensiveComponent() {
  // ❌ Runs on every render (even though only used once)
  const [data, setData] = useState(expensiveCalculation());

  // ✅ Only runs once on mount
  const [data, setData] = useState(() => expensiveCalculation());

  return <div>{data}</div>;
}

function expensiveCalculation() {
  console.log("Running expensive calculation...");
  // Simulate heavy computation
  return Array.from({ length: 10000 }, (_, i) => i).reduce((a, b) => a + b, 0);
}
```

### Reading from localStorage

```javascript
function PersistentCounter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("count");
    return saved ? JSON.parse(saved) : 0;
  });

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("count", JSON.stringify(newCount));
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## Common Pitfalls

### ❌ Mutating State Directly

```javascript
// Don't do this
const [items, setItems] = useState([1, 2, 3]);
items.push(4); // This won't trigger re-render
setItems(items);

// Do this instead
setItems([...items, 4]); // Creates new array
```

### ❌ Batching Issue (Before React 18)

```javascript
function handleClick() {
  setCount(count + 1); // Re-renders
  setName("John"); // Re-renders
  setActive(true); // Re-renders
  // In React 18+, these are automatically batched
}
```

### ❌ State Update Timing

```javascript
function Component() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // Still shows old value!
    // State updates are asynchronous
  };

  // Use useEffect to see updated state
  useEffect(() => {
    console.log("Count updated:", count);
  }, [count]);
}
```

## Best Practices

1. **Keep state minimal**: Only store what you need
2. **Derive values**: Calculate values from state instead of storing them
3. **Use multiple states**: Separate unrelated state variables
4. **Use functional updates**: When new state depends on old state
5. **Initialize properly**: Use lazy initialization for expensive calculations

## Real-World Use Cases

### 1. Form Handling

```javascript
function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={(e) =>
          setFormData({
            ...formData,
            username: e.target.value,
          })
        }
      />
      {/* More fields */}
    </form>
  );
}
```

### 2. Modal Management

```javascript
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <div>
      <button onClick={() => openModal("Welcome!")}>Open Modal</button>
      {isModalOpen && (
        <Modal content={modalContent} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
```

### 3. Pagination

```javascript
function PaginatedList({ items, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div>
      <ul>
        {currentItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div>
  );
}
```

## Performance Considerations

- State updates trigger re-renders
- Multiple state updates in the same function are batched (React 18+)
- Consider `useReducer` for complex state logic
- Consider `useMemo` if derived values are expensive to calculate

## When NOT to Use useState

- ❌ Don't use for values that don't affect rendering (use `useRef`)
- ❌ Don't use for complex state logic (use `useReducer`)
- ❌ Don't use for global state shared across many components (use Context or state management library)
- ❌ Don't store derived values that can be calculated from existing state

## Summary

`useState` is your go-to hook for managing component-level state. It's perfect for simple state management, form inputs, toggles, and counters. For more complex scenarios, consider `useReducer` or state management libraries.

**Key Takeaway**: Use `useState` when you need to track values that change over time and trigger re-renders when they do.
