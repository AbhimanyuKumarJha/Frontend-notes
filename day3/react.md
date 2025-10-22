# React.js Basics - Part 1: Foundation & Core Concepts

## Introduction to React

React is a JavaScript library created by Facebook (now Meta) for building user interfaces. Instead of directly manipulating the DOM (which becomes complex in large applications), React uses a **declarative approach** where you describe what your UI should look like, and React efficiently handles the updates.

**Think about this:** If you were building a todo list app the traditional way, you'd need to write code like "find the list element, create a new li element, set its text, append it to the list" every time a user adds a task. With React, you simply describe "here's my list of tasks" and React figures out how to update the DOM efficiently.

---

## Understanding Components

Components are the building blocks of React applications. They're self-contained pieces of UI that combine structure, behavior, and logic.

### Function Components (Modern Approach)

```javascript
// A simple function component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Using the component
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}
```

### Class Components (Legacy but still encountered)

```javascript
import React, { Component } from "react";

class Welcome extends Component {
  render() {
    return <h1>Hello, World!</h1>;
  }
}
```

**Question for you:** Looking at both examples above, which approach seems more straightforward? Can you see how the function component is just a regular JavaScript function that returns JSX?

---

## JSX: Writing HTML in JavaScript

JSX looks like HTML but it's actually JavaScript. During the build process, it gets transformed into function calls.

### Basic JSX Examples

```javascript
// Simple JSX
function Greeting() {
  return <h1>Hello!</h1>;
}

// JSX with JavaScript expressions (use curly braces)
function Greeting() {
  const name = "Sarah";
  const time = new Date().getHours();

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Current hour: {time}</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  );
}
```

### JSX vs HTML: Key Differences

```javascript
// HTML uses "class", JSX uses "className"
function Button() {
  return <button className="primary-btn">Click me</button>;
}

// HTML uses "for", JSX uses "htmlFor"
function Form() {
  return (
    <div>
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" />
    </div>
  );
}

// Inline styles in JSX are objects, not strings
function StyledDiv() {
  const styles = {
    backgroundColor: "blue", // camelCase, not kebab-case
    fontSize: "20px",
    padding: "10px",
  };

  return <div style={styles}>Styled content</div>;
}

// Self-closing tags must have the slash
function Image() {
  return <img src="photo.jpg" alt="A photo" />; // Notice the />
}
```

### JSX Must Return a Single Parent Element

```javascript
// ❌ Wrong - multiple root elements
function Wrong() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ Correct - wrapped in a div
function Correct() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}

// ✅ Also correct - using React Fragment (doesn't add extra DOM node)
function AlsoCorrect() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
```

**Try this yourself:** What would happen if you wanted to display three paragraphs side by side? How would you structure the JSX?

---

## Props: Passing Data to Components

Props make components reusable by allowing you to pass data from parent to child components.

### Basic Props Usage

```javascript
// Component that receives props
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Using the component with different props
function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}
```

### Destructuring Props (Cleaner Syntax)

```javascript
// Instead of props.name, props.age, etc.
function UserCard(props) {
  return (
    <div className="user-card">
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

// Better: destructure in the parameter
function UserCard({ name, age, email }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Using it
function App() {
  return <UserCard name="Alice Johnson" age={28} email="alice@example.com" />;
}
```

### Different Types of Props

```javascript
function ComplexComponent({
  title, // string
  count, // number
  isActive, // boolean
  items, // array
  user, // object
  onClick, // function
}) {
  return (
    <div className={isActive ? "active" : "inactive"}>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>User: {user.name}</p>
      <button onClick={onClick}>Click me</button>
    </div>
  );
}

// Using it
function App() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <ComplexComponent
      title="My Component"
      count={42}
      isActive={true}
      items={["Apple", "Banana", "Orange"]}
      user={{ name: "John", age: 30 }}
      onClick={handleClick}
    />
  );
}
```

### Props are Read-Only

```javascript
function Greeting(props) {
  // ❌ NEVER do this - props should not be modified
  props.name = "Changed Name";

  return <h1>Hello, {props.name}!</h1>;
}

// ✅ Props should only be read
function Greeting({ name }) {
  // You can use props to compute new values
  const greeting = `Hello, ${name}!`;

  return <h1>{greeting}</h1>;
}
```

**Think about this:** Why do you think React makes props read-only? What problems might arise if child components could modify props passed from parents?

---

## Default Props and Props Validation

```javascript
// Setting default props
function Button({ text = "Click me", color = "blue" }) {
  return <button style={{ backgroundColor: color }}>{text}</button>;
}

// Usage
function App() {
  return (
    <div>
      <Button /> {/* Uses defaults: "Click me" and "blue" */}
      <Button text="Submit" /> {/* Uses default color */}
      <Button text="Delete" color="red" /> {/* Both customized */}
    </div>
  );
}
```

---

## Children Prop (Special Prop)

```javascript
// Components can receive children between opening and closing tags
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Using it
function App() {
  return (
    <div>
      <Card>
        <h2>Card Title</h2>
        <p>This is card content</p>
      </Card>

      <Card>
        <img src="photo.jpg" alt="Photo" />
        <p>A photo card</p>
      </Card>
    </div>
  );
}
```

---

## Composing Components

Real applications are built by composing multiple components together.

```javascript
// Small, reusable components
function Avatar({ url, alt }) {
  return <img src={url} alt={alt} className="avatar" />;
}

function UserName({ name, isOnline }) {
  return (
    <div>
      <h3>{name}</h3>
      {isOnline && <span className="online-badge">Online</span>}
    </div>
  );
}

function UserBio({ bio }) {
  return <p className="bio">{bio}</p>;
}

// Composing them together
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <Avatar url={user.avatarUrl} alt={user.name} />
      <UserName name={user.name} isOnline={user.isOnline} />
      <UserBio bio={user.bio} />
    </div>
  );
}

// Using it
function App() {
  const userData = {
    name: "Alice Johnson",
    avatarUrl: "https://example.com/avatar.jpg",
    isOnline: true,
    bio: "Software developer and React enthusiast",
  };

  return <UserProfile user={userData} />;
}
```

**Exercise:** Can you think of how you'd break down a blog post card into smaller components? What might be the individual pieces?

---

## Conditional Rendering

```javascript
// Using if statements
function Greeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return <h1>Welcome back, {username}!</h1>;
  }
  return <h1>Please sign in</h1>;
}

// Using ternary operator
function Greeting({ isLoggedIn, username }) {
  return (
    <h1>{isLoggedIn ? `Welcome back, ${username}!` : "Please sign in"}</h1>
  );
}

// Using && operator (for showing/hiding elements)
function Notification({ hasNewMessages, messageCount }) {
  return (
    <div>
      <h2>Notifications</h2>
      {hasNewMessages && <p>You have {messageCount} new messages!</p>}
    </div>
  );
}

// Complex conditional rendering
function Dashboard({ user }) {
  return (
    <div>
      {user.isAdmin ? (
        <AdminPanel />
      ) : user.isPremium ? (
        <PremiumDashboard />
      ) : (
        <BasicDashboard />
      )}
    </div>
  );
}
```

---

## Lists and Keys

```javascript
// Rendering a list
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// Using it
function App() {
  const todos = [
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build a project" },
    { id: 3, text: "Deploy app" },
  ];

  return <TodoList todos={todos} />;
}

// More complex example with a component for each item
function TodoItem({ todo }) {
  return (
    <li className={todo.completed ? "completed" : ""}>
      <span>{todo.text}</span>
      <span>{todo.completed ? "✓" : "○"}</span>
    </li>
  );
}

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

**Important:** The `key` prop helps React identify which items have changed, been added, or removed. Always use a unique, stable identifier (like an ID) as the key, not the array index when possible.

---

## Your First Complete Component

Let's build a practical component that brings everything together:

```javascript
// ProductCard.js
function ProductCard({ product }) {
  const { name, price, image, inStock, rating } = product;

  const displayPrice = `$${price.toFixed(2)}`;
  const stars = "⭐".repeat(rating);

  return (
    <div className="product-card">
      <img src={image} alt={name} />

      <h3>{name}</h3>

      <div className="product-info">
        <span className="price">{displayPrice}</span>
        <span className="rating">{stars}</span>
      </div>

      {inStock ? (
        <button className="buy-btn">Add to Cart</button>
      ) : (
        <button className="out-of-stock-btn" disabled>
          Out of Stock
        </button>
      )}
    </div>
  );
}

// App.js
function App() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 79.99,
      image: "headphones.jpg",
      inStock: true,
      rating: 4,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image: "watch.jpg",
      inStock: false,
      rating: 5,
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 34.99,
      image: "stand.jpg",
      inStock: true,
      rating: 3,
    },
  ];

  return (
    <div className="app">
      <h1>Our Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default App;
```

---

## Project Structure

When you create a React app with Create React App, you'll see this structure:

```
my-app/
├── node_modules/          # Dependencies (don't edit)
├── public/
│   ├── index.html        # Main HTML file
│   └── favicon.ico
├── src/
│   ├── App.js            # Main App component
│   ├── App.css           # Styles for App
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
├── package.json          # Project dependencies and scripts
└── README.md
```

**The index.js file** (entry point):

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Practice Exercises

Before moving to Part 2, try building these components:

1. **ProfileCard:** Create a component that displays a person's name, photo, job title, and a short bio. Use props to make it reusable for different people.

2. **WeatherWidget:** Build a component that receives weather data (temperature, condition, city) as props and displays it nicely. Include conditional rendering to show different icons for sunny/rainy/cloudy weather.

3. **BlogPostPreview:** Create a component for a blog post that shows the title, author, date, excerpt, and a "Read More" button. Practice composing smaller components (author info, date display) within it.

**Reflection questions:**

- How did you decide what should be a prop vs what should be hardcoded?
- Did you find opportunities to break your component into smaller ones?
- How would you make your component handle missing data gracefully?

---

## Key Takeaways

✓ Components are the building blocks - keep them focused and reusable  
✓ JSX blends markup with JavaScript logic seamlessly  
✓ Props flow downward from parent to child (one-way data flow)  
✓ Props are immutable - child components can't modify them  
✓ Always provide unique `key` props when rendering lists  
✓ Break complex UIs into smaller, manageable components

**Next up:** In Part 2, we'll explore **State**, which allows components to manage their own data and respond to user interactions, making your interfaces truly dynamic and interactive!
