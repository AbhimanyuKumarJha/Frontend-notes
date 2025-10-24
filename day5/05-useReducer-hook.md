# useReducer Hook

## Overview

`useReducer` is an alternative to `useState` for managing complex state logic. It uses the reducer pattern (similar to Redux) where state transitions are defined in a reducer function based on dispatched actions.

## Syntax

```javascript
const [state, dispatch] = useReducer(reducer, initialState, init);
```

## When to Use

- Complex state logic with multiple sub-values
- Next state depends on previous state
- State transitions need to be predictable and testable
- Multiple related actions update the same state
- Need to optimize performance for components with deep updates
- State logic needs to be extracted and tested separately

## Advantages

✅ **Predictable**: Clear state transitions based on actions  
✅ **Centralized Logic**: All state updates in one place  
✅ **Testable**: Reducer is a pure function, easy to test  
✅ **Performance**: Can optimize with `useCallback` for dispatch  
✅ **Scalable**: Better for complex state than multiple `useState` calls  
✅ **Debugging**: Actions provide clear history of what happened

## Basic Example

```javascript
import { useReducer } from "react";

// 1. Define reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    case "SET":
      return { count: action.payload };
    default:
      return state;
  }
}

// 2. Use in component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      <button onClick={() => dispatch({ type: "SET", payload: 100 })}>
        Set to 100
      </button>
    </div>
  );
}
```

## Reducer Pattern Explained

### Anatomy of a Reducer

```javascript
function reducer(state, action) {
  // state: current state object
  // action: object with 'type' and optional 'payload'

  switch (action.type) {
    case "ACTION_TYPE":
      // Return NEW state (don't mutate!)
      return { ...state, property: newValue };
    default:
      return state; // Always return current state for unknown actions
  }
}
```

### Action Objects

```javascript
// Simple action
{ type: 'INCREMENT' }

// Action with payload
{ type: 'ADD_TODO', payload: { id: 1, text: 'Learn React' } }

// Action with multiple data
{ type: 'UPDATE_USER', payload: { id: 123, name: 'John', email: 'john@example.com' } }
```

## useState vs useReducer

### When to Use useState

```javascript
// ✅ Simple state (single value)
const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [isOpen, setIsOpen] = useState(false);

// ✅ Independent state pieces
function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
}
```

### When to Use useReducer

```javascript
// ✅ Complex state object
const [state, dispatch] = useReducer(formReducer, {
  email: "",
  password: "",
  remember: false,
  errors: {},
  isSubmitting: false,
  submitCount: 0,
});

// ✅ Related actions
dispatch({ type: "SET_FIELD", field: "email", value: "test@test.com" });
dispatch({ type: "SUBMIT_START" });
dispatch({ type: "SUBMIT_SUCCESS" });
dispatch({ type: "SUBMIT_ERROR", payload: { message: "Failed" } });
```

## Real-World Examples

### Example 1: Todo App

```javascript
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
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

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    case "SET_SEARCH":
      return {
        ...state,
        searchTerm: action.payload,
      };

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

  const addTodo = (text) => {
    dispatch({ type: "ADD_TODO", payload: text });
  };

  const toggleTodo = (id) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  // Filter todos based on state
  const filteredTodos = state.todos
    .filter((todo) => {
      if (state.filter === "active") return !todo.completed;
      if (state.filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH", payload: e.target.value })
        }
      />

      <div>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}
        >
          All
        </button>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "active" })}
        >
          Active
        </button>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "completed" })}
        >
          Completed
        </button>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 2: Form with Validation

```javascript
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };

    case "SUBMIT_START":
      return {
        ...state,
        isSubmitting: true,
        submitError: null,
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        submitCount: state.submitCount + 1,
        values: action.resetForm ? { email: "", password: "" } : state.values,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        isSubmitting: false,
        submitError: action.payload,
      };

    case "RESET":
      return initialFormState;

    default:
      return state;
  }
}

const initialFormState = {
  values: {
    email: "",
    password: "",
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  submitError: null,
  submitCount: 0,
};

function LoginForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const validate = () => {
    const errors = {};

    if (!state.values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(state.values.email)) {
      errors.email = "Email is invalid";
    }

    if (!state.values.password) {
      errors.password = "Password is required";
    } else if (state.values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    dispatch({ type: "SET_ERRORS", payload: errors });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch({ type: "SUBMIT_START" });

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.values),
      });

      if (response.ok) {
        dispatch({ type: "SUBMIT_SUCCESS", resetForm: true });
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      dispatch({ type: "SUBMIT_ERROR", payload: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={state.values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email"
        />
        {state.touched.email && state.errors.email && (
          <span className="error">{state.errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          value={state.values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Password"
        />
        {state.touched.password && state.errors.password && (
          <span className="error">{state.errors.password}</span>
        )}
      </div>

      {state.submitError && <div className="error">{state.submitError}</div>}

      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? "Logging in..." : "Login"}
      </button>

      <button type="button" onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>
    </form>
  );
}
```

### Example 3: Shopping Cart

```javascript
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.payload,
        discount: calculateDiscount(state.items, action.payload),
      };

    case "REMOVE_COUPON":
      return {
        ...state,
        coupon: null,
        discount: 0,
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        coupon: null,
        discount: 0,
      };

    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    coupon: null,
    discount: 0,
  });

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal - state.discount;

  return (
    <div>
      <h2>Shopping Cart</h2>

      {state.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {state.items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>${item.price}</span>
                <input
                  type="number"
                  value={item.quantity}
                  min="0"
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_QUANTITY",
                      payload: {
                        id: item.id,
                        quantity: parseInt(e.target.value),
                      },
                    })
                  }
                />
                <button
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_ITEM",
                      payload: item.id,
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            {state.discount > 0 && (
              <p>Discount: -${state.discount.toFixed(2)}</p>
            )}
            <p>
              <strong>Total: ${total.toFixed(2)}</strong>
            </p>
          </div>

          <button onClick={() => dispatch({ type: "CLEAR_CART" })}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
```

## Advanced Patterns

### Pattern 1: Lazy Initialization

```javascript
function init(initialCount) {
  // Expensive computation
  return { count: initialCount * 2 };
}

function Counter({ initialCount }) {
  // Third parameter is init function
  const [state, dispatch] = useReducer(counterReducer, initialCount, init);

  return <div>Count: {state.count}</div>;
}
```

### Pattern 2: Action Creators

```javascript
// Action creators for type safety and reusability
const actions = {
  addTodo: (text) => ({ type: "ADD_TODO", payload: text }),
  toggleTodo: (id) => ({ type: "TOGGLE_TODO", payload: id }),
  deleteTodo: (id) => ({ type: "DELETE_TODO", payload: id }),
  setFilter: (filter) => ({ type: "SET_FILTER", payload: filter }),
};

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <div>
      <button onClick={() => dispatch(actions.addTodo("New todo"))}>
        Add Todo
      </button>
      <button onClick={() => dispatch(actions.setFilter("active"))}>
        Show Active
      </button>
    </div>
  );
}
```

### Pattern 3: Combining with Context

```javascript
const TodoContext = createContext();

function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return context;
}

// Usage
function TodoList() {
  const { state, dispatch } = useTodos();

  return (
    <ul>
      {state.todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
      ))}
    </ul>
  );
}
```

### Pattern 4: Middleware Pattern

```javascript
function createReducerWithMiddleware(reducer, middleware) {
  return (state, action) => {
    // Run middleware before reducer
    middleware(action);

    // Run reducer
    const newState = reducer(state, action);

    // Log state change
    console.log("Action:", action);
    console.log("New State:", newState);

    return newState;
  };
}

// Logger middleware
const logger = (action) => {
  console.log(`[${new Date().toISOString()}] ${action.type}`, action.payload);
};

// Usage
const reducerWithMiddleware = createReducerWithMiddleware(todoReducer, logger);
const [state, dispatch] = useReducer(reducerWithMiddleware, initialState);
```

## Best Practices

1. **Keep Reducers Pure**: No side effects, same input = same output
2. **Don't Mutate State**: Always return new state objects
3. **Use Action Types**: Define constants for action types
4. **Structure Actions**: Use `{ type, payload }` convention
5. **Default Case**: Always include default case returning current state
6. **Split Reducers**: For very complex state, split into multiple reducers
7. **Test Reducers**: Pure functions are easy to test

## Common Pitfalls

### ❌ Mistake 1: Mutating State

```javascript
// BAD: Mutating state directly
function badReducer(state, action) {
  state.count++; // ❌ Mutation!
  return state;
}

// GOOD: Return new state
function goodReducer(state, action) {
  return { ...state, count: state.count + 1 }; // ✅ New object
}
```

### ❌ Mistake 2: Side Effects in Reducer

```javascript
// BAD: Side effects in reducer
function badReducer(state, action) {
  if (action.type === "SAVE") {
    localStorage.setItem("data", JSON.stringify(state)); // ❌ Side effect!
    return state;
  }
}

// GOOD: Side effects in useEffect
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state)); // ✅ In effect
  }, [state]);
}
```

### ❌ Mistake 3: Missing Default Case

```javascript
// BAD: No default case
function badReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    // ❌ No default!
  }
}

// GOOD: Always include default
function goodReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    default:
      return state; // ✅ Return current state
  }
}
```

## Testing Reducers

```javascript
describe("todoReducer", () => {
  it("should add a todo", () => {
    const state = { todos: [] };
    const action = { type: "ADD_TODO", payload: "Learn React" };
    const newState = todoReducer(state, action);

    expect(newState.todos).toHaveLength(1);
    expect(newState.todos[0].text).toBe("Learn React");
  });

  it("should toggle a todo", () => {
    const state = {
      todos: [{ id: 1, text: "Test", completed: false }],
    };
    const action = { type: "TOGGLE_TODO", payload: 1 };
    const newState = todoReducer(state, action);

    expect(newState.todos[0].completed).toBe(true);
  });
});
```

## When NOT to Use useReducer

- ❌ Simple state (single values) - use `useState`
- ❌ No complex logic - use `useState`
- ❌ State doesn't have multiple related values - use `useState`
- ❌ Overkill for 2-3 state values - use `useState`

## Summary

`useReducer` is perfect for complex state logic with multiple related actions. It provides predictable state transitions, makes code more maintainable, and is easy to test. Use it when `useState` becomes unwieldy.

**Key Takeaway**: Use `useReducer` when you have complex state logic with multiple related actions, or when the next state depends on the previous state in non-trivial ways.
