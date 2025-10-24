# useContext Hook

## Overview

`useContext` allows you to consume context values in functional components without prop drilling. It provides a way to share data across the component tree without passing props through every level.

## Syntax

```javascript
const value = useContext(MyContext);
```

## When to Use

- Sharing global data (theme, authentication, user preferences)
- Avoiding prop drilling through multiple component levels
- Providing configuration to deeply nested components
- Managing application-wide state
- Internationalization (i18n) data
- Feature flags and settings

## Advantages

✅ **No Prop Drilling**: Pass data deep without intermediate components  
✅ **Cleaner Code**: No need to pass props through every level  
✅ **Centralized Data**: Single source of truth for shared data  
✅ **Easy Updates**: All consumers automatically receive updates  
✅ **Multiple Contexts**: Can use multiple contexts in same component

## Basic Setup

### Step 1: Create Context

```javascript
import { createContext } from "react";

// Create context with default value
const ThemeContext = createContext("light");
```

### Step 2: Provide Context

```javascript
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

### Step 3: Consume Context

```javascript
import { useContext } from "react";

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return <button className={`button-${theme}`}>Click me</button>;
}
```

## Complete Example: Theme Switcher

```javascript
import { createContext, useContext, useState } from "react";

// 1. Create Context
const ThemeContext = createContext();

// 2. Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook (Optional but recommended)
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// 4. App Structure
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

// 5. Consumer Components
function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={theme}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </header>
  );
}

function Main() {
  const { theme } = useTheme();

  return (
    <main className={theme}>
      <p>Main content in {theme} theme</p>
    </main>
  );
}
```

## Advanced Patterns

### Pattern 1: Authentication Context

```javascript
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Usage
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Pattern 2: Multiple Contexts

```javascript
import { createContext, useContext, useState } from "react";

// Theme Context
const ThemeContext = createContext();
const LanguageContext = createContext();
const UserContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Dashboard />
        </UserContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

// Component using multiple contexts
function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const { user } = useContext(UserContext);

  return (
    <div>
      <h2>Settings for {user?.name}</h2>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}
```

### Pattern 3: Context with Reducer

```javascript
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  });

  const addItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // Calculate total
  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items: state.items,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

// Usage
function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

function CartSummary() {
  const { items, total, clearCart } = useCart();

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### Pattern 4: Context Composition

```javascript
// Compose multiple providers
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}
```

## Real-World Use Cases

### 1. Internationalization (i18n)

```javascript
const LanguageContext = createContext();

const translations = {
  en: {
    welcome: "Welcome",
    logout: "Logout",
  },
  es: {
    welcome: "Bienvenido",
    logout: "Cerrar sesión",
  },
};

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}

// Usage
function Header() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <header>
      <h1>{t("welcome")}</h1>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </header>
  );
}
```

### 2. Toast Notifications

```javascript
const ToastContext = createContext();

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// Usage
function Form() {
  const { addToast } = useToast();

  const handleSubmit = async () => {
    try {
      await saveData();
      addToast("Data saved successfully!", "success");
    } catch (error) {
      addToast("Error saving data", "error");
    }
  };

  return <button onClick={handleSubmit}>Save</button>;
}
```

### 3. Modal Manager

```javascript
const ModalContext = createContext();

function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (component, props = {}) => {
    const id = Date.now();
    setModals((prev) => [...prev, { id, component, props }]);
    return id;
  };

  const closeModal = (id) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map(({ id, component: Component, props }) => (
        <Component key={id} onClose={() => closeModal(id)} {...props} />
      ))}
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}

// Usage
function ConfirmDialog({ message, onConfirm, onClose }) {
  return (
    <div className="modal">
      <p>{message}</p>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        Confirm
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

function DeleteButton({ itemId }) {
  const { openModal } = useModal();

  const handleDelete = () => {
    openModal(ConfirmDialog, {
      message: "Are you sure?",
      onConfirm: () => deleteItem(itemId),
    });
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Common Pitfalls

### ❌ Mistake 1: Creating New Objects in Provider

```javascript
// BAD: Creates new object on every render, causing all consumers to re-render
function BadProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// GOOD: Use useMemo or useState for the entire value
function GoodProvider({ children }) {
  const [state, setState] = useState({ user: null });

  const value = useMemo(
    () => ({
      user: state.user,
      setUser: (user) => setState({ user }),
    }),
    [state.user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
```

### ❌ Mistake 2: Using Context Without Provider

```javascript
// BAD: Using context without provider causes error
function BadComponent() {
  const value = useContext(MyContext); // ❌ Might be undefined!
  return <div>{value.data}</div>;
}

// GOOD: Custom hook with error checking
function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within MyProvider");
  }
  return context;
}

function GoodComponent() {
  const value = useMyContext(); // ✅ Safe
  return <div>{value.data}</div>;
}
```

### ❌ Mistake 3: Too Much in One Context

```javascript
// BAD: Everything in one massive context
function BadProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [cart, setCart] = useState([]);
  // Too much state in one context!

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,
        language,
        setLanguage,
        cart,
        setCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// GOOD: Separate contexts for different concerns
function GoodProvider({ children }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
```

## Performance Optimization

### Technique 1: Split Contexts

```javascript
// Instead of one context with everything
// Split into multiple focused contexts
<UserProvider>
  <SettingsProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </SettingsProvider>
</UserProvider>
```

### Technique 2: Memoize Context Value

```javascript
function OptimizedProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Memoize the context value
  const value = useMemo(
    () => ({
      state,
      updateState: setState,
    }),
    [state]
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

### Technique 3: Separate State and Dispatch

```javascript
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Components only re-render when they need to
function Counter() {
  const state = useContext(StateContext); // Re-renders on state change
  return <div>{state.count}</div>;
}

function IncrementButton() {
  const dispatch = useContext(DispatchContext); // Never re-renders
  return <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>;
}
```

## Best Practices

1. **Create Custom Hooks**: Wrap `useContext` in custom hooks
2. **Error Checking**: Always check if context exists
3. **Memoize Values**: Use `useMemo` for context values
4. **Split Contexts**: Don't put everything in one context
5. **Default Values**: Provide sensible defaults when creating context
6. **Co-location**: Keep provider close to where it's used

## When NOT to Use Context

- ❌ Don't use for frequently changing values (causes many re-renders)
- ❌ Don't use as a replacement for all props (prop drilling isn't always bad)
- ❌ Don't use for simple parent-child communication
- ❌ Don't use when props are clearer and simpler

## Context vs Props vs State Management

| Feature     | Context     | Props                   | Redux/Zustand |
| ----------- | ----------- | ----------------------- | ------------- |
| Scope       | Tree-wide   | Parent to child         | Global        |
| Performance | Good        | Best                    | Good          |
| Complexity  | Medium      | Low                     | High          |
| Best For    | Theme, auth | Component communication | Complex state |

## Summary

`useContext` eliminates prop drilling and provides a clean way to share data across your component tree. It's perfect for themes, authentication, localization, and other cross-cutting concerns.

**Key Takeaway**: Use Context for data that many components need, but don't need to change frequently. For complex global state, consider a dedicated state management library.
