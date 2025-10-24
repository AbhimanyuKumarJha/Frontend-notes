# React Hooks - Complete Reference Guide

## Table of Contents

This directory contains comprehensive notes on all React Hooks and custom hooks. Each file provides in-depth explanations, examples, use cases, and best practices.

## Files Overview

### 1. **01-useState-hook.md**

Core hook for managing component state.

- **When to use**: Local component state, forms, toggles, counters
- **Key concepts**: State updates, functional updates, lazy initialization
- **Best for**: Simple to moderate state management

### 2. **02-useEffect-hook.md**

Handle side effects in functional components.

- **When to use**: API calls, subscriptions, DOM manipulation, timers
- **Key concepts**: Dependency array, cleanup functions, effect timing
- **Best for**: Synchronizing with external systems

### 3. **03-useRef-hook.md**

Access DOM elements and store mutable values.

- **When to use**: DOM access, storing mutable values without re-renders
- **Key concepts**: Ref object, .current property, DOM manipulation
- **Best for**: Focus management, storing timer IDs, previous values

### 4. **04-useContext-hook.md**

Consume context values without prop drilling.

- **When to use**: Global state, theme, authentication, configuration
- **Key concepts**: Context creation, Provider, Consumer patterns
- **Best for**: Sharing data across component tree

### 5. **05-useReducer-hook.md**

Manage complex state with reducer pattern.

- **When to use**: Complex state logic, multiple related actions
- **Key concepts**: Reducer function, actions, dispatch
- **Best for**: Complex state with predictable transitions

### 6. **06-useMemo-useCallback-hooks.md**

Performance optimization hooks.

- **When to use**: Expensive calculations, preventing re-renders
- **Key concepts**: Memoization, referential equality, dependencies
- **Best for**: Performance optimization (use sparingly!)

### 7. **07-custom-hooks.md**

Create reusable stateful logic.

- **When to use**: Extracting repeated logic, code reusability
- **Key concepts**: Hook composition, returning values, naming convention
- **Best for**: Sharing logic across components

## Quick Hook Selection Guide

### For State Management

| Scenario                               | Hook to Use                 |
| -------------------------------------- | --------------------------- |
| Simple state (string, number, boolean) | `useState`                  |
| Complex state with multiple actions    | `useReducer`                |
| Global state (theme, auth)             | `useContext`                |
| Form with many fields                  | `useReducer` or custom hook |

### For Side Effects

| Scenario                    | Hook to Use                      |
| --------------------------- | -------------------------------- |
| Fetch data on mount         | `useEffect` with `[]`            |
| Update on prop/state change | `useEffect` with `[deps]`        |
| Cleanup subscriptions       | `useEffect` with return function |
| Debounce user input         | `useEffect` + custom hook        |

### For Performance

| Scenario                 | Hook to Use                  |
| ------------------------ | ---------------------------- |
| Expensive calculation    | `useMemo`                    |
| Prevent child re-renders | `useCallback` + `React.memo` |
| Cache filtered list      | `useMemo`                    |
| Stable event handler     | `useCallback`                |

### For DOM/References

| Scenario            | Hook to Use            |
| ------------------- | ---------------------- |
| Focus input         | `useRef`               |
| Access DOM element  | `useRef`               |
| Store mutable value | `useRef`               |
| Previous prop/state | `useRef` + `useEffect` |

## Common Hook Combinations

### Pattern 1: Fetch Data with Loading State

```javascript
function useDataFetch(url) {
  const [data, setData] = useState(null); // useState
  const [loading, setLoading] = useState(true); // useState
  const [error, setError] = useState(null); // useState

  useEffect(() => {
    // useEffect
    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [url]);

  return { data, loading, error };
}
```

### Pattern 2: Form with Context

```javascript
// useContext + useReducer
const FormContext = createContext();

function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}
```

### Pattern 3: Optimized List

```javascript
function TodoList({ todos }) {
  // useMemo for filtering
  const filtered = useMemo(() => todos.filter((t) => !t.completed), [todos]);

  // useCallback for handlers
  const handleToggle = useCallback((id) => {
    // toggle logic
  }, []);

  return <List items={filtered} onToggle={handleToggle} />;
}
```

## Hook Rules (IMPORTANT!)

### ✅ Do:

- Call hooks at the top level
- Call hooks from React functions
- Name custom hooks with "use" prefix
- Include all dependencies in useEffect/useMemo/useCallback

### ❌ Don't:

- Call hooks inside loops, conditions, or nested functions
- Call hooks from regular JavaScript functions
- Mutate state directly (use setState functions)
- Forget cleanup in useEffect

## Learning Path

### Beginner

1. Start with `useState` and `useEffect`
2. Master dependency arrays in `useEffect`
3. Learn `useRef` for DOM access
4. Understand when to use each hook

### Intermediate

5. Learn `useContext` for global state
6. Understand `useReducer` for complex state
7. Create your first custom hooks
8. Combine hooks effectively

### Advanced

9. Master `useMemo` and `useCallback` (when to use, when not to)
10. Build advanced custom hooks
11. Optimize performance with profiling
12. Compose complex hook patterns

## Real-World Application

### Complete Todo App Using Multiple Hooks

```javascript
// Custom hook for localStorage
function useTodoStorage() {
  const [todos, setTodos] = useLocalStorage("todos", []);

  const addTodo = useCallback((text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo };
}

// Context for global access
const TodoContext = createContext();

function TodoProvider({ children }) {
  const todoData = useTodoStorage();

  return (
    <TodoContext.Provider value={todoData}>{children}</TodoContext.Provider>
  );
}

// Custom hook to use context
function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return context;
}
```

## Performance Tips

1. **Don't optimize prematurely** - Measure first!
2. **Use React DevTools Profiler** - See what actually renders
3. **Memoize expensive calculations** - Use `useMemo` for heavy operations
4. **Stable callbacks** - Use `useCallback` for props to memoized children
5. **Split contexts** - Don't put everything in one context

## Common Mistakes

### Mistake 1: Unnecessary useEffect

```javascript
// ❌ BAD: Don't use useEffect for calculations
function Component({ items }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);
}

// ✅ GOOD: Calculate during render
function Component({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
}
```

### Mistake 2: Missing Dependencies

```javascript
// ❌ BAD: Missing dependencies
useEffect(() => {
  console.log(count); // Uses 'count'
}, []); // But doesn't list it!

// ✅ GOOD: Include all dependencies
useEffect(() => {
  console.log(count);
}, [count]);
```

### Mistake 3: Over-memoization

```javascript
// ❌ BAD: Memoizing simple operations
const doubled = useMemo(() => value * 2, [value]);

// ✅ GOOD: Just calculate it
const doubled = value * 2;
```

## Debugging Hooks

### Use React DevTools

- See component state and props
- Profile render performance
- Track hook values

### Console Logging

```javascript
useEffect(() => {
  console.log("Effect ran", { dependency1, dependency2 });
}, [dependency1, dependency2]);
```

### Custom Hook Debugger

```javascript
function useDebugValue(value, label) {
  useEffect(() => {
    console.log(`${label}:`, value);
  }, [value, label]);
}
```

## Additional Resources

### Official Documentation

- [React Hooks Documentation](https://react.dev/reference/react)
- [Hooks API Reference](https://react.dev/reference/react/hooks)

### Recommended Libraries

- **usehooks-ts**: TypeScript-ready hooks
- **react-use**: Large collection of hooks
- **ahooks**: Comprehensive hooks library

### Tools

- **React DevTools**: Browser extension for debugging
- **ESLint Plugin**: `eslint-plugin-react-hooks`

## Summary

Hooks are the foundation of modern React development. Master the built-in hooks first, then create custom hooks to extract and reuse logic. Remember:

1. **useState** - Local state
2. **useEffect** - Side effects
3. **useContext** - Global state
4. **useReducer** - Complex state
5. **useRef** - DOM & mutable values
6. **useMemo/useCallback** - Performance (sparingly!)
7. **Custom Hooks** - Reusable logic

Start simple, add complexity only when needed, and always measure before optimizing!

---

## Quick Reference Card

```javascript
// State
const [state, setState] = useState(initial);

// Effects
useEffect(() => {
  /* effect */ return () => {
    /* cleanup */
  };
}, [deps]);

// Context
const value = useContext(MyContext);

// Reducer
const [state, dispatch] = useReducer(reducer, initial);

// Ref
const ref = useRef(initial);

// Memoization
const value = useMemo(() => compute(), [deps]);
const fn = useCallback(() => {
  /* ... */
}, [deps]);

// Custom Hook
function useMyHook() {
  // Use other hooks
  return value;
}
```

Happy coding! 🚀
