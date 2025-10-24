# Custom Hooks

## Overview

Custom Hooks are JavaScript functions that start with "use" and can call other Hooks. They allow you to extract and reuse stateful logic across multiple components without changing your component hierarchy.

## Why Custom Hooks?

### Problems They Solve

- **Code Duplication**: Same logic repeated across components
- **Complex Components**: Too much logic in one component
- **Hard to Test**: Logic tightly coupled with component
- **Poor Reusability**: Can't share logic between components easily

### Benefits

✅ **Reusability**: Share logic across components  
✅ **Composition**: Combine multiple hooks  
✅ **Testability**: Test logic in isolation  
✅ **Cleaner Code**: Extract complex logic  
✅ **Better Organization**: Separate concerns

## Creating Custom Hooks

### Basic Structure

```javascript
function useCustomHook(initialValue) {
  // 1. Use built-in hooks (useState, useEffect, etc.)
  const [state, setState] = useState(initialValue);

  // 2. Define helper functions
  const doSomething = () => {
    // logic here
  };

  // 3. Return what the component needs
  return [state, doSomething];
  // or return { state, doSomething };
}
```

### Rules for Custom Hooks

1. **Name must start with "use"** (useMyHook, not myHook)
2. **Can call other Hooks** (useState, useEffect, etc.)
3. **Must follow Hook rules** (top level, only in functions)
4. **Can return anything** (values, functions, objects, arrays)

## Essential Custom Hooks

### 1. useLocalStorage

```javascript
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // State to store value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Usage
function TodoApp() {
  const [todos, setTodos] = useLocalStorage("todos", []);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };

  return (
    <div>
      {/* Todos automatically persist to localStorage */}
      <TodoList todos={todos} onAdd={addTodo} />
    </div>
  );
}
```

### 2. useFetch

```javascript
import { useState, useEffect } from "react";

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const {
    data: user,
    loading,
    error,
  } = useFetch(`https://api.example.com/users/${userId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### 3. useDebounce

```javascript
import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Only search 500ms after user stops typing
      searchAPI(debouncedSearchTerm).then(setResults);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 4. useToggle

```javascript
import { useState, useCallback } from "react";

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}

// Usage
function Modal() {
  const [isOpen, toggle, open, close] = useToggle(false);

  return (
    <div>
      <button onClick={open}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### 5. usePrevious

```javascript
import { useRef, useEffect } from "react";

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
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 6. useWindowSize

```javascript
import { useState, useEffect } from "react";

function useWindowSize() {
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>
        Window size: {width} x {height}
      </p>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### 7. useOnClickOutside

```javascript
import { useEffect, useRef } from "react";

function useOnClickOutside(callback) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}

// Usage
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useOnClickOutside(() => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Dropdown</button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )}
    </div>
  );
}
```

### 8. useForm

```javascript
import { useState } from "react";

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (validate) {
      const fieldErrors = validate({ [name]: values[name] });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);

    // Validate all fields
    if (validate) {
      const allErrors = validate(values);
      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

// Usage
function LoginForm() {
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const form = useForm({ email: "", password: "" }, validate);

  const onSubmit = async (values) => {
    await loginUser(values);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit);
      }}
    >
      <input
        type="email"
        value={form.values.email}
        onChange={(e) => form.handleChange("email", e.target.value)}
        onBlur={() => form.handleBlur("email")}
      />
      {form.touched.email && form.errors.email && (
        <span className="error">{form.errors.email}</span>
      )}

      <input
        type="password"
        value={form.values.password}
        onChange={(e) => form.handleChange("password", e.target.value)}
        onBlur={() => form.handleBlur("password")}
      />
      {form.touched.password && form.errors.password && (
        <span className="error">{form.errors.password}</span>
      )}

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### 9. useAsync

```javascript
import { useState, useEffect, useCallback } from "react";

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setStatus("pending");
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus("success");
        return response;
      } catch (err) {
        setError(err);
        setStatus("error");
        throw err;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  };
}

// Usage
function UserProfile({ userId }) {
  const fetchUser = useCallback(
    () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    [userId]
  );

  const {
    data: user,
    isPending,
    isError,
    error,
    execute,
  } = useAsync(fetchUser, true);

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={execute}>Refresh</button>
    </div>
  );
}
```

### 10. useMediaQuery

```javascript
import { useState, useEffect } from "react";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (e) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

// Usage
function ResponsiveLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

## Advanced Custom Hooks

### 11. useIntersectionObserver (Lazy Loading)

```javascript
import { useState, useEffect, useRef } from "react";

function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);

  return [targetRef, isIntersecting];
}

// Usage
function LazyImage({ src, alt }) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder">Loading...</div>
      )}
    </div>
  );
}
```

### 12. useKeyPress

```javascript
import { useState, useEffect } from "react";

function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKey]);

  return keyPressed;
}

// Usage
function Game() {
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const spacePress = useKeyPress(" ");

  return (
    <div>
      <p>Press arrow keys and space</p>
      <p>Left: {leftPress ? "Pressed" : "Not pressed"}</p>
      <p>Right: {rightPress ? "Pressed" : "Not pressed"}</p>
      <p>Space: {spacePress ? "Pressed" : "Not pressed"}</p>
    </div>
  );
}
```

### 13. useCopyToClipboard

```javascript
import { useState } from "react";

function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);
  const [error, setError] = useState(null);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      setError("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setCopiedText(null);
      return false;
    }
  };

  return { copiedText, error, copy };
}

// Usage
function CopyButton({ text }) {
  const { copiedText, error, copy } = useCopyToClipboard();

  return (
    <div>
      <button onClick={() => copy(text)}>
        {copiedText === text ? "Copied!" : "Copy"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

## Composing Custom Hooks

Custom hooks can use other custom hooks!

```javascript
// Compose multiple hooks
function useAuthenticatedFetch(url) {
  const { user } = useAuth(); // Custom hook
  const { data, loading, error } = useFetch(url, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  return { data, loading, error };
}

// Usage
function ProtectedData() {
  const { data, loading, error } = useAuthenticatedFetch("/api/protected");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>{JSON.stringify(data)}</div>;
}
```

## Best Practices

1. **Name with "use"**: Always start with "use" prefix
2. **One Responsibility**: Each hook should do one thing well
3. **Return Useful Data**: Return what components actually need
4. **Document**: Add JSDoc comments explaining usage
5. **Error Handling**: Handle errors gracefully
6. **TypeScript**: Add types for better DX (if using TS)
7. **Test**: Write tests for custom hooks
8. **Keep Pure**: Avoid side effects in hook creation

## Testing Custom Hooks

```javascript
import { renderHook, act } from "@testing-library/react-hooks";
import useCounter from "./useCounter";

describe("useCounter", () => {
  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement counter", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});
```

## Summary

Custom Hooks are one of React's most powerful features. They allow you to extract and reuse logic, making your code more maintainable and testable. Start by identifying repeated patterns in your code, then extract them into custom hooks.

**Key Takeaway**: Custom Hooks let you compose and reuse stateful logic. They're just JavaScript functions that use other Hooks. Build a library of custom hooks for your common use cases!
