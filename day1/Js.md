# JavaScript Complete Notes

## 1. Basics

### Variables
```javascript
var x = 5;        // function-scoped, can redeclare
let y = 10;       // block-scoped, can't redeclare
const z = 15;     // block-scoped, immutable reference
```

### Data Types
- **Primitive**: string, number, boolean, null, undefined, symbol, bigint
- **Reference**: object, array, function

```javascript
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object" (known bug)
```

### Type Conversion
```javascript
String(123)       // "123"
Number("456")     // 456
Boolean(0)        // false
parseInt("10px")  // 10
parseFloat("3.14") // 3.14
```

## 2. Operators

```javascript
// Arithmetic: +, -, *, /, %, **
5 ** 2            // 25 (exponentiation)

// Comparison: ==, ===, !=, !==, >, <, >=, <=
5 == "5"          // true (loose equality)
5 === "5"         // false (strict equality)

// Logical: &&, ||, !
true && false     // false
true || false     // true
!true             // false

// Nullish coalescing
null ?? "default" // "default"
0 ?? "default"    // 0
```

## 3. Control Flow

```javascript
// If/else
if (condition) {
  // code
} else if (otherCondition) {
  // code
} else {
  // code
}

// Ternary
const result = condition ? value1 : value2;

// Switch
switch (value) {
  case 1:
    // code
    break;
  case 2:
    // code
    break;
  default:
    // code
}
```

## 4. Loops

```javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
while (condition) {
  // code
}

// Do-while
do {
  // code
} while (condition);

// For...of (iterables)
for (const item of array) {
  console.log(item);
}

// For...in (object keys)
for (const key in object) {
  console.log(key, object[key]);
}
```

## 5. Functions

```javascript
// Function declaration
function greet(name) {
  return `Hello ${name}`;
}

// Function expression
const greet = function(name) {
  return `Hello ${name}`;
};

// Arrow function
const greet = (name) => `Hello ${name}`;
const add = (a, b) => a + b;

// Default parameters
function multiply(a, b = 1) {
  return a * b;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// IIFE
(function() {
  console.log("Executed immediately");
})();
```

## 6. Arrays

```javascript
const arr = [1, 2, 3, 4, 5];

// Common methods
arr.push(6)           // Add to end
arr.pop()             // Remove from end
arr.unshift(0)        // Add to start
arr.shift()           // Remove from start
arr.slice(1, 3)       // [2, 3] (doesn't modify)
arr.splice(1, 2)      // Remove 2 items at index 1

// Iteration methods
arr.forEach(item => console.log(item))
arr.map(x => x * 2)              // [2, 4, 6, 8, 10]
arr.filter(x => x > 2)           // [3, 4, 5]
arr.reduce((acc, x) => acc + x, 0) // 15
arr.find(x => x > 2)             // 3
arr.findIndex(x => x > 2)        // 2
arr.some(x => x > 4)             // true
arr.every(x => x > 0)            // true
arr.includes(3)                  // true
```

## 7. Objects

```javascript
// Object creation
const person = {
  name: "John",
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// Access properties
person.name           // "John"
person["age"]         // 30

// Add/modify properties
person.email = "john@example.com";

// Delete property
delete person.age;

// Object methods
Object.keys(person)       // ["name", "greet", "email"]
Object.values(person)     // ["John", function, "john@example.com"]
Object.entries(person)    // [["name", "John"], ...]
Object.assign({}, person) // Shallow copy

// Destructuring
const { name, age } = person;

// Spread operator
const newPerson = { ...person, city: "NYC" };
```

## 8. Destructuring & Spread

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Object destructuring
const { name, age: userAge } = { name: "John", age: 30 };
// name = "John", userAge = 30

// Spread in arrays
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // {a: 1, b: 2, c: 3}
```

## 9. Strings

```javascript
const str = "Hello World";

str.length                    // 11
str.toUpperCase()             // "HELLO WORLD"
str.toLowerCase()             // "hello world"
str.includes("World")         // true
str.startsWith("Hello")       // true
str.endsWith("World")         // true
str.indexOf("o")              // 4
str.slice(0, 5)               // "Hello"
str.substring(0, 5)           // "Hello"
str.split(" ")                // ["Hello", "World"]
str.replace("World", "JS")    // "Hello JS"
str.trim()                    // Remove whitespace

// Template literals
const name = "John";
const greeting = `Hello ${name}!`;
```

## 10. Scope & Closures

```javascript
// Global scope
let globalVar = "global";

// Function scope
function outer() {
  let outerVar = "outer";
  
  // Closure
  function inner() {
    let innerVar = "inner";
    console.log(outerVar); // Can access outer scope
  }
  
  return inner;
}

// Block scope
if (true) {
  let blockVar = "block";
  const constVar = "const";
}
// blockVar and constVar not accessible here
```

## 11. this Keyword

```javascript
const obj = {
  name: "John",
  regularFunc: function() {
    console.log(this.name); // "John"
  },
  arrowFunc: () => {
    console.log(this.name); // undefined (lexical this)
  }
};

// Call, Apply, Bind
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

greet.call({ name: "John" }, "Hello");    // "Hello, John"
greet.apply({ name: "John" }, ["Hello"]); // "Hello, John"
const boundGreet = greet.bind({ name: "John" });
boundGreet("Hello");                       // "Hello, John"
```

## 12. Prototypes & Classes

```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

// ES6 Classes
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  static species() {
    return "Homo sapiens";
  }
}

// Inheritance
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
  
  study() {
    return `${this.name} is studying`;
  }
}
```

## 13. Asynchronous JavaScript

### Callbacks
```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 1000);
}

fetchData((data) => console.log(data));
```

### Promises
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success");
    // or reject("Error");
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Done"));

// Promise methods
Promise.all([promise1, promise2])     // Wait for all
Promise.race([promise1, promise2])    // First to complete
Promise.allSettled([promise1, promise2]) // All results
Promise.any([promise1, promise2])     // First success
```

### Async/Await
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Multiple awaits
async function getData() {
  const [users, posts] = await Promise.all([
    fetch('/users').then(r => r.json()),
    fetch('/posts').then(r => r.json())
  ]);
}
```

## 14. DOM Manipulation

```javascript
// Selecting elements
document.getElementById('myId')
document.querySelector('.myClass')
document.querySelectorAll('div')
document.getElementsByClassName('myClass')
document.getElementsByTagName('p')

// Modifying elements
element.textContent = "New text";
element.innerHTML = "<strong>Bold text</strong>";
element.style.color = "red";
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('show');
element.setAttribute('data-id', '123');
element.getAttribute('data-id');

// Creating/removing elements
const div = document.createElement('div');
div.textContent = "Hello";
parent.appendChild(div);
parent.removeChild(div);
element.remove();

// Event listeners
element.addEventListener('click', (e) => {
  console.log('Clicked!', e.target);
});

element.removeEventListener('click', handler);

// Event delegation
parent.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    console.log('Button clicked');
  }
});
```

## 15. Error Handling

```javascript
// Try/Catch
try {
  throw new Error("Something went wrong");
} catch (error) {
  console.error(error.message);
} finally {
  console.log("Cleanup");
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

throw new ValidationError("Invalid input");
```

## 16. Array & Object Advanced

```javascript
// Array destructuring with defaults
const [a = 1, b = 2] = [10];  // a = 10, b = 2

// Swapping variables
[x, y] = [y, x];

// Optional chaining
const name = user?.profile?.name;

// Nullish coalescing
const value = null ?? "default";  // "default"
const value2 = 0 ?? "default";    // 0

// Object shorthand
const name = "John";
const age = 30;
const person = { name, age };  // { name: "John", age: 30 }

// Computed property names
const key = "name";
const obj = { [key]: "John" };  // { name: "John" }
```

## 17. Higher-Order Functions

```javascript
// Function that returns a function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
double(5);  // 10

// Function that takes function as argument
function operate(a, b, operation) {
  return operation(a, b);
}

operate(5, 3, (x, y) => x + y);  // 8
```

## 18. Modules

```javascript
// Export (module.js)
export const name = "John";
export function greet() { }
export default class Person { }

// Import (main.js)
import Person, { name, greet } from './module.js';
import * as Module from './module.js';
import { name as userName } from './module.js';
```

## 19. Local Storage

```javascript
// Set item
localStorage.setItem('key', 'value');
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// Get item
const value = localStorage.getItem('key');
const user = JSON.parse(localStorage.getItem('user'));

// Remove item
localStorage.removeItem('key');

// Clear all
localStorage.clear();

// Session storage (same API, cleared when tab closes)
sessionStorage.setItem('key', 'value');
```

## 20. Fetch API

```javascript
// GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST request
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'John', age: 30 })
})
  .then(response => response.json())
  .then(data => console.log(data));

// With async/await
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  const users = await response.json();
  return users;
}
```

## 21. Regular Expressions

```javascript
const regex = /pattern/flags;
const regex2 = new RegExp('pattern', 'flags');

// Flags: g (global), i (case-insensitive), m (multiline)

// Test
/hello/i.test("Hello World");  // true

// Match
"Hello World".match(/\w+/g);  // ["Hello", "World"]

// Replace
"Hello World".replace(/World/, "JS");  // "Hello JS"

// Common patterns
/\d+/       // One or more digits
/\w+/       // One or more word characters
/[a-z]+/    // One or more lowercase letters
/^start/    // Starts with "start"
/end$/      // Ends with "end"
/./         // Any character
```

## 22. Map & Set

```javascript
// Map
const map = new Map();
map.set('key', 'value');
map.set(1, 'one');
map.get('key');        // "value"
map.has('key');        // true
map.delete('key');
map.size;              // 1
map.clear();

// Iterate
for (const [key, value] of map) {
  console.log(key, value);
}

// Set
const set = new Set([1, 2, 3, 3]);  // {1, 2, 3}
set.add(4);
set.has(2);            // true
set.delete(2);
set.size;              // 3
set.clear();

// Iterate
for (const value of set) {
  console.log(value);
}
```

## 23. Performance Tips

```javascript
// Debouncing
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttling
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const debouncedSearch = debounce(search, 300);
const throttledScroll = throttle(handleScroll, 100);
```

## 24. Common Patterns

```javascript
// Singleton
const Singleton = (function() {
  let instance;
  
  function createInstance() {
    return { name: "Singleton" };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// Factory
function createUser(type) {
  if (type === 'admin') {
    return new Admin();
  } else {
    return new User();
  }
}

// Observer
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
}
```

## 25. Best Practices

- Use `const` by default, `let` when reassignment needed
- Avoid `var`
- Use strict equality (`===`) instead of loose (`==`)
- Always handle errors in async operations
- Use meaningful variable names
- Keep functions small and focused
- Avoid global variables
- Use template literals for string concatenation
- Prefer arrow functions for callbacks
- Use array methods over loops when possible
- Comment complex logic
- Use semicolons consistently
- Handle edge cases (null, undefined, empty arrays)