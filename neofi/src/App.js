import logo from "./logo.svg";
import "./App.css";
import WithSubnavigation from "./Components/Nav";
import SimpleCard from "./Components/Hero";
function App() {
  return (
    <div className="App">
      <WithSubnavigation />
      <SimpleCard />
    </div>
  );
}

export default App;
