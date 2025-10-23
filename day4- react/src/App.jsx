// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import Card from "./components/Card";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0);

  // Create a React card component with a title, description;

  //Create a Sections component that uses children prop to add all the cards into it
  function Section({ children }) {
    return <div className="section">{children}</div>;
  }

  return (
    <>
      <Section>
        <Card title="Card 1" description="This is the first card." />
        <Card title="Card 2" description="This is the second card." />
        <Card title="Card 3" description="This is the third card." />
      </Section>
    </>
  );
}

export default App;
