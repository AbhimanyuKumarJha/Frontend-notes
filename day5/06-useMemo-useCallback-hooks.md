# useMemo and useCallback Hooks

## Overview

`useMemo` and `useCallback` are performance optimization hooks that memoize (cache) values and functions, respectively. They prevent unnecessary recalculations and re-creations during re-renders.

## useMemo Hook

### Syntax

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### When to Use useMemo

- Expensive calculations that don't need to run on every render
- Creating objects or arrays that are used as dependencies
- Filtering or transforming large datasets
- Complex computations based on props or state
- Preventing unnecessary re-renders of child components

### Advantages

✅ **Performance**: Avoids expensive recalculations  
✅ **Referential Equality**: Returns same reference if dependencies haven't changed  
✅ **Optimization**: Helps with React.memo optimization  
✅ **Controlled**: Only recomputes when dependencies change

## useCallback Hook

### Syntax

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### When to Use useCallback

- Passing callbacks to optimized child components (wrapped in React.memo)
- Callbacks used as dependencies in other hooks
- Event handlers passed to many child components
- Preventing recreation of functions on every render

### Advantages

✅ **Stable Reference**: Same function reference across renders  
✅ **Optimization**: Prevents child re-renders when used with React.memo  
✅ **Dependency Optimization**: Stable dependencies for other hooks  
✅ **Event Handler Reuse**: Avoids recreating event handlers

## useMemo Examples

### Example 1: Expensive Calculation

```javascript
import { useState, useMemo } from "react";

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function FibonacciCalculator() {
  const [number, setNumber] = useState(10);
  const [dark, setDark] = useState(false);

  // ❌ Without useMemo: Recalculates on EVERY render (even theme change)
  // const fib = fibonacci(number);

  // ✅ With useMemo: Only recalculates when 'number' changes
  const fib = useMemo(() => {
    console.log("Calculating fibonacci...");
    return fibonacci(number);
  }, [number]);

  const theme = {
    backgroundColor: dark ? "#333" : "#FFF",
    color: dark ? "#FFF" : "#333",
  };

  return (
    <div style={theme}>
      <p>
        Fibonacci of {number} is {fib}
      </p>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      <button onClick={() => setDark(!dark)}>Toggle Theme</button>
    </div>
  );
}
```

### Example 2: Filtering Large Lists

```javascript
function ProductList({ products, category, searchTerm }) {
  // Without useMemo, filtering runs on every render
  // With useMemo, only runs when dependencies change
  const filteredProducts = useMemo(() => {
    console.log("Filtering products...");

    return products
      .filter((product) => {
        if (category && product.category !== category) return false;
        if (
          searchTerm &&
          !product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [products, category, searchTerm]);

  return (
    <ul>
      {filteredProducts.map((product) => (
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}
```

### Example 3: Memoizing Objects

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // ❌ Without useMemo: New object every render
  // This would cause useEffect to run every time!
  // const options = { userId, includeDetails: true };

  // ✅ With useMemo: Same reference unless userId changes
  const options = useMemo(
    () => ({
      userId,
      includeDetails: true,
      timestamp: Date.now(),
    }),
    [userId]
  );

  useEffect(() => {
    fetchUser(options).then(setUser);
  }, [options]); // Now only runs when options actually changes

  return <div>{user?.name}</div>;
}
```

### Example 4: Complex Calculations

```javascript
function DataDashboard({ data }) {
  const statistics = useMemo(() => {
    console.log("Calculating statistics...");

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;
    const max = Math.max(...data.map((item) => item.value));
    const min = Math.min(...data.map((item) => item.value));

    return { total, average, max, min };
  }, [data]);

  return (
    <div>
      <p>Total: {statistics.total}</p>
      <p>Average: {statistics.average.toFixed(2)}</p>
      <p>Max: {statistics.max}</p>
      <p>Min: {statistics.min}</p>
    </div>
  );
}
```

## useCallback Examples

### Example 1: Preventing Child Re-renders

```javascript
import { useState, useCallback, memo } from "react";

// Child component wrapped in React.memo
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log("TodoItem rendered:", todo.id);

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build an app", completed: false },
  ]);

  // ❌ Without useCallback: New function every render
  // Child components re-render even with React.memo
  // const handleToggle = (id) => {
  //   setTodos(todos.map(todo =>
  //     todo.id === id ? { ...todo, completed: !todo.completed } : todo
  //   ));
  // };

  // ✅ With useCallback: Same function reference
  // Child components don't re-render unnecessarily
  const handleToggle = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // Empty deps because we use functional update

  const handleDelete = useCallback((id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

### Example 2: Stable Event Handlers

```javascript
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Memoized search function
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const response = await fetch(`/api/search?q=${searchQuery}`);
    const data = await response.json();
    setResults(data);
  }, []); // No dependencies needed

  // Can be safely used in useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]); // handleSearch won't cause re-runs

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ResultsList results={results} />
    </div>
  );
}
```

### Example 3: Callback as Dependency

```javascript
function UserData({ userId }) {
  const [user, setUser] = useState(null);

  // Stable function reference
  const fetchUser = useCallback(async () => {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    setUser(data);
  }, [userId]); // Only changes when userId changes

  // Safe to use as dependency
  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // Won't cause infinite loops

  // Can pass to child components
  return <UserProfile user={user} onRefresh={fetchUser} />;
}
```

### Example 4: Form Handlers

```javascript
function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  // Create stable handler for each field
  const createChangeHandler = useCallback((field) => {
    return (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  }, []); // Empty deps - returns new handler function but useCallback itself is stable

  // Better approach: Single memoized handler
  const handleChange = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Submitting:", formData);
    },
    [formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={handleChange("name")}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={handleChange("email")}
        placeholder="Email"
      />
      <input
        value={formData.age}
        onChange={handleChange("age")}
        placeholder="Age"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Combined Example: Optimized Data Table

```javascript
import { useState, useMemo, useCallback, memo } from "react";

// Memoized row component
const TableRow = memo(({ item, onEdit, onDelete }) => {
  console.log("Row rendered:", item.id);

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>${item.price}</td>
      <td>
        <button onClick={() => onEdit(item)}>Edit</button>
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </td>
    </tr>
  );
});

function DataTable({ data }) {
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize filtered and sorted data
  const processedData = useMemo(() => {
    console.log("Processing data...");

    let result = [...data];

    // Filter by category
    if (filterCategory) {
      result = result.filter((item) => item.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [data, sortKey, sortOrder, filterCategory, searchTerm]);

  // Memoize unique categories
  const categories = useMemo(() => {
    return [...new Set(data.map((item) => item.category))];
  }, [data]);

  // Memoized callbacks
  const handleEdit = useCallback((item) => {
    console.log("Editing:", item);
    // Edit logic here
  }, []);

  const handleDelete = useCallback((id) => {
    console.log("Deleting:", id);
    // Delete logic here
  }, []);

  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    },
    [sortKey]
  );

  return (
    <div>
      {/* Filters */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("category")}>Category</th>
            <th onClick={() => handleSort("price")}>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      <p>
        Showing {processedData.length} of {data.length} items
      </p>
    </div>
  );
}
```

## Common Patterns

### Pattern 1: Memoizing Context Value

```javascript
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);

  // ❌ Creates new object every render
  // return (
  //   <MyContext.Provider value={{ state, setState }}>
  //     {children}
  //   </MyContext.Provider>
  // );

  // ✅ Memoized context value
  const value = useMemo(() => ({ state, setState }), [state]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

### Pattern 2: Memoizing Styles

```javascript
function StyledComponent({ color, size }) {
  // Prevents creating new style object on every render
  const style = useMemo(
    () => ({
      color,
      fontSize: `${size}px`,
      padding: "10px",
      border: `2px solid ${color}`,
    }),
    [color, size]
  );

  return <div style={style}>Styled Content</div>;
}
```

### Pattern 3: Custom Hooks with useMemo

```javascript
function useFilteredData(data, filters) {
  return useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key] === value;
      });
    });
  }, [data, filters]);
}

// Usage
function Component({ data }) {
  const [filters, setFilters] = useState({ category: "", status: "" });
  const filteredData = useFilteredData(data, filters);

  return <DataList data={filteredData} />;
}
```

## Common Pitfalls

### ❌ Mistake 1: Overusing Memoization

```javascript
// BAD: Memoizing everything unnecessarily
function SimpleComponent({ name }) {
  // Unnecessary for simple concatenation
  const greeting = useMemo(() => `Hello, ${name}!`, [name]);

  return <div>{greeting}</div>;
}

// GOOD: Just calculate it
function SimpleComponent({ name }) {
  const greeting = `Hello, ${name}!`;
  return <div>{greeting}</div>;
}
```

### ❌ Mistake 2: Wrong Dependencies

```javascript
// BAD: Missing dependencies
function Component({ items, filter }) {
  const filtered = useMemo(() => {
    return items.filter((item) => item.category === filter);
  }, [items]); // ❌ Missing 'filter'!

  // GOOD: All dependencies included
  const filtered = useMemo(() => {
    return items.filter((item) => item.category === filter);
  }, [items, filter]); // ✅ Correct
}
```

### ❌ Mistake 3: Callback with Wrong Dependencies

```javascript
// BAD: Stale closure
function Component() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count); // Always logs initial count!
  }, []); // ❌ Missing 'count' dependency

  // GOOD: Use functional update
  const handleClick = useCallback(() => {
    setCount((c) => c + 1); // ✅ No need for count in deps
  }, []);
}
```

### ❌ Mistake 4: Premature Optimization

```javascript
// BAD: Optimizing before measuring
function Component() {
  // Is this calculation actually slow? Probably not.
  const doubled = useMemo(() => props.number * 2, [props.number]);

  // GOOD: Optimize when you have proof it's slow
  const doubled = props.number * 2;
}
```

## When to Use (Decision Tree)

### Use useMemo when:

✅ Calculation is computationally expensive  
✅ Filtering/sorting large arrays (1000+ items)  
✅ Creating objects/arrays used as dependencies  
✅ Expensive data transformations  
✅ You've profiled and found a performance issue

### Use useCallback when:

✅ Passing callbacks to memoized child components  
✅ Callbacks used as dependencies in useEffect  
✅ Creating custom hooks that return functions  
✅ Event handlers passed to many children  
✅ Preventing infinite loops in effects

### DON'T use when:

❌ Calculation is simple (addition, concatenation)  
❌ Array has < 100 items  
❌ Component renders infrequently  
❌ No child components use React.memo  
❌ Just guessing it might help performance

## Performance Profiling

```javascript
// Use React DevTools Profiler to measure before optimizing
function ExpensiveComponent({ data }) {
  // Add console.time to measure
  console.time('calculation');

  const result = useMemo(() => {
    return data.map(item => /* expensive transformation */)
      .filter(item => /* complex filter */)
      .sort((a, b) => /* complex sort */);
  }, [data]);

  console.timeEnd('calculation');

  return <div>{/* render result */}</div>;
}
```

## Best Practices

1. **Measure First**: Profile before optimizing
2. **Don't Overuse**: Not every value needs memoization
3. **Include All Dependencies**: Listen to ESLint warnings
4. **Use Functional Updates**: Avoid dependencies when possible
5. **Combine with React.memo**: For maximum benefit
6. **Test Performance**: Verify optimization actually helps

## Summary

`useMemo` and `useCallback` are powerful optimization tools, but should be used judiciously. They add complexity and have their own overhead. Always measure performance before and after to ensure they're helping.

**Key Takeaway**: Use `useMemo` for expensive calculations and `useCallback` for stable function references. But remember: premature optimization is the root of all evil. Profile first, optimize later!
