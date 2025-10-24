# React.js Basics - Part 2: State & Interactivity

## Introduction to State

In Part 1, we learned how props allow data to flow from parent to child components. But what happens when a component needs to remember something? What if a button needs to track how many times it's been clicked, or a form needs to store what the user is typing?

This is where **state** comes in. State is data that a component manages internally and can change over time. When state changes, React automatically re-renders the component to reflect those changes.

**Before we dive deeper, think about this:** Looking at your todo application assignment, what are some examples of data that changes based on user interaction? Take a moment to identify 3-4 pieces of data that your app needs to "remember."

---

## The useState Hook

The most common way to add state to function components is using the `useState` hook.

### Basic Syntax

```javascript
import { useState } from "react";

function Counter() {
  // useState returns an array with two elements:
  // 1. The current state value
  // 2. A function to update that state
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

**Let's break this down:**

- `useState(0)` - The argument (0) is the initial state value
- `[count, setCount]` - Array destructuring to get the state and setter function
- `setCount(count + 1)` - Calling the setter updates the state and triggers re-render

**Question for you:** In the counter above, what do you think would happen if we directly modified `count` like `count = count + 1` instead of using `setCount`? Why might that not work?

---

## Understanding State Updates

### State is Immutable

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ WRONG - Never modify state directly
  const handleClick = () => {
    count = count + 1; // This won't work!
  };

  // ✅ CORRECT - Always use the setter function
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

### Multiple State Variables

```javascript
function UserProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Age"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <label>
        <input
          type="checkbox"
          checked={isSubscribed}
          onChange={(e) => setIsSubscribed(e.target.checked)}
        />
        Subscribe to newsletter
      </label>
    </div>
  );
}
```

**Pause and consider:** In the example above, we have 4 separate state variables. Can you think of scenarios where it might make sense to group some of this data together instead? What would be the advantages?

---

## State with Objects and Arrays

### State as an Object

```javascript
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  // ❌ WRONG - This replaces the entire object
  const updateName = (newName) => {
    setUser({ name: newName }); // email and age are lost!
  };

  // ✅ CORRECT - Spread the existing state, then override
  const updateName = (newName) => {
    setUser({
      ...user, // Keep existing properties
      name: newName, // Override this one
    });
  };

  // Better: Generic update function
  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={user.age}
        onChange={(e) => handleChange("age", Number(e.target.value))}
        placeholder="Age"
      />

      <div>
        <h3>User Data:</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
```

### State as an Array

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Adding a new item
  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]); // Add to end
    setInputValue(""); // Clear input
  };

  // Removing an item
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Updating an item
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Enter a task"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
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

**Challenge question:** Look at the `toggleTodo` function above. Why do we use `.map()` instead of finding the todo and directly changing its `completed` property? What principle is this following?

---

## Event Handling in React

### Basic Event Handling

```javascript
function EventExamples() {
  const [message, setMessage] = useState("");

  // Method 1: Inline arrow function
  const handleClick1 = () => {
    setMessage("Button 1 clicked!");
  };

  // Method 2: Function with parameters
  const handleClick2 = (buttonName) => {
    setMessage(`${buttonName} clicked!`);
  };

  // Method 3: Event object
  const handleInput = (e) => {
    console.log("Input value:", e.target.value);
    console.log("Event type:", e.type);
  };

  return (
    <div>
      {/* Inline arrow function */}
      <button onClick={() => setMessage("Inline click!")}>
        Inline Handler
      </button>

      {/* Reference to function */}
      <button onClick={handleClick1}>Button 1</button>

      {/* Pass parameters using arrow function wrapper */}
      <button onClick={() => handleClick2("Button 2")}>Button 2</button>

      {/* Input events */}
      <input onChange={handleInput} placeholder="Type something" />

      <p>{message}</p>
    </div>
  );
}
```

### Common Events

```javascript
function EventTypes() {
  const [info, setInfo] = useState("");

  return (
    <div>
      {/* Click events */}
      <button onClick={() => setInfo("Single click")}>Click</button>
      <button onDoubleClick={() => setInfo("Double click")}>
        Double Click
      </button>

      {/* Mouse events */}
      <div
        onMouseEnter={() => setInfo("Mouse entered")}
        onMouseLeave={() => setInfo("Mouse left")}
        style={{ padding: "20px", background: "#f0f0f0" }}
      >
        Hover over me
      </div>

      {/* Form events */}
      <input
        onChange={(e) => setInfo(`Typing: ${e.target.value}`)}
        onFocus={() => setInfo("Input focused")}
        onBlur={() => setInfo("Input blurred")}
      />

      {/* Keyboard events */}
      <input
        onKeyDown={(e) => setInfo(`Key down: ${e.key}`)}
        onKeyUp={(e) => setInfo(`Key up: ${e.key}`)}
        placeholder="Press any key"
      />

      <p>Event info: {info}</p>
    </div>
  );
}
```

### Preventing Default Behavior

```javascript
function FormExample() {
  const [formData, setFormData] = useState({ username: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Form submitted:", formData);
    alert(`Submitted: ${formData.username}, ${formData.email}`);
  };

  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent navigation
    console.log("Link clicked but navigation prevented");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder="Username"
        />
        <input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <button type="submit">Submit</button>
      </form>

      <a href="https://example.com" onClick={handleLinkClick}>
        Click me (won't navigate)
      </a>
    </div>
  );
}
```

**Reflect on this:** When building forms, why is `e.preventDefault()` so important? What would happen in the form above if we removed that line?

---

## Practical Example: Building a Complete Feature

Let's build a shopping cart feature that combines multiple concepts:

```javascript
function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  // Add product to cart
  const addToCart = () => {
    if (!productName || !productPrice) {
      alert("Please enter both name and price");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName,
      price: parseFloat(productPrice),
      quantity: 1,
    };

    setCart([...cart, newProduct]);
    setProductName("");
    setProductPrice("");
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate total
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>

      {/* Add Product Form */}
      <div className="add-product">
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product name"
        />
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Price"
          step="0.01"
        />
        <button onClick={addToCart}>Add to Cart</button>
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>

                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <span className="item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <h3>Total: ${calculateTotal()}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
```

**Let's analyze together:**

1. Can you identify all the state variables in this component?
2. Which functions modify the state, and how do they do it?
3. Where are we using array methods like `.map()`, `.filter()`, and `.reduce()`?

---

## State Updates are Asynchronous

This is a crucial concept that often confuses beginners:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ This might not work as expected
  const incrementMultipleTimes = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Count only increases by 1, not 3!
  };

  // ✅ Use functional update form
  const incrementMultipleTimesCorrect = () => {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    // Count increases by 3!
  };

  // ❌ State is not immediately updated
  const logCount = () => {
    setCount(count + 1);
    console.log(count); // Logs the OLD value, not the new one!
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementMultipleTimes}>+3 (Wrong)</button>
      <button onClick={incrementMultipleTimesCorrect}>+3 (Correct)</button>
      <button onClick={logCount}>Increment & Log</button>
    </div>
  );
}
```

**Think about this:** Why do you think React batches state updates instead of applying them immediately? What might be the performance benefits?

---

## Lifting State Up

When multiple components need to share the same state, we move it to their common parent:

```javascript
// Parent component holds the shared state
function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");

  const handleCelsiusChange = (value) => {
    setCelsius(value);
  };

  const fahrenheit = celsius === "" ? "" : ((celsius * 9) / 5 + 32).toFixed(1);

  return (
    <div>
      <h2>Temperature Converter</h2>
      <TemperatureInput
        scale="Celsius"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="Fahrenheit"
        temperature={fahrenheit}
        onTemperatureChange={() => {}} // Read-only for now
      />

      {celsius !== "" && (
        <p>Water {celsius >= 100 ? "boils" : "does not boil"}</p>
      )}
    </div>
  );
}

// Child component receives state via props
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scale}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  );
}
```

**Discussion point:** In the example above, why does the state live in `TemperatureConverter` instead of in each `TemperatureInput`? What would be the problem if each input had its own state?

---

## Practice Exercises

Now it's time to apply what you've learned. Try building these:

### Exercise 1: Toggle Visibility

Create a component with a button that shows/hides a paragraph of text. Track the visibility state with `useState`.

**Starter questions:**

- What should the initial state be? (boolean)
- What happens when the button is clicked?
- How can you conditionally render the paragraph?

### Exercise 2: Form Validation

Build a login form with email and password fields. Show error messages if:

- Email doesn't contain "@"
- Password is less than 8 characters

**Consider:**

- How many state variables do you need?
- When should validation happen? (onChange, onBlur, onSubmit?)
- How will you display error messages?

### Exercise 3: Filterable List

Create a list of items with a search box. Display only items that match the search term.

**Think about:**

- What data needs to be in state?
- How will you filter the array?
- Where should the filtering logic live?

### Exercise 4: Enhance Your Todo App

Take your todo application from Day 3 and convert it to React:

- Use `useState` for the todos array
- Add state for the input field
- Implement add, delete, and toggle completion with state updates

**Challenge yourself:**

- Can you add an "Edit" feature?
- Can you filter todos by status (all/active/completed)?
- Can you count how many todos are incomplete?

---

## Lesson Task

- complete react lessons till 21

---

## Common Pitfalls to Avoid

**1. Mutating State Directly**

```javascript
// ❌ DON'T
todos.push(newTodo);
setTodos(todos);

// ✅ DO
setTodos([...todos, newTodo]);
```

**2. Using State Immediately After Setting**

```javascript
// ❌ Won't work as expected
setCount(count + 1);
console.log(count); // Old value!

// ✅ Use the parameter in setter for dependent updates
setCount((prevCount) => {
  console.log(prevCount + 1); // New value
  return prevCount + 1;
});
```

**3. Conditional Hooks**

```javascript
// ❌ NEVER call hooks conditionally
if (condition) {
  const [state, setState] = useState(0); // ERROR!
}

// ✅ Call hooks at the top level always
const [state, setState] = useState(0);
if (condition) {
  // Use the state here
}
```

---

## Key Takeaways

✓ State is for data that changes over time within a component  
✓ Always use the setter function from `useState` - never mutate state directly  
✓ When updating objects/arrays, create new copies with spread operator  
✓ State updates are asynchronous - use functional updates for dependent changes  
✓ Lift state up to share it between components  
✓ Event handlers in React use camelCase (onClick, onChange, etc.)  
✓ Use `e.preventDefault()` to stop default browser behavior

---

**Reflection Questions:**

1. What's the difference between props and state? When would you use each?
2. Why is state immutability important in React?
3. In your todo app, what pieces of data should be state vs props?

**Next Up:** In Part 3, we'll explore component lifecycle, side effects with `useEffect`, and how to fetch data from APIs. We'll also connect this to your todo assignment by fetching data from the DummyJSON API!
