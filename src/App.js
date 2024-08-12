import "./App.css";
import Signin from "./Signin";
import Signup from "./Signup";
import Home from "./Home";
import About from "./About";
import Friends from "./Friends";
import AISpeak from "./AISpeak";
import { Routes, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <div> 
      <header>
          <Link to="/signin" className="header-item">Sign in</Link>
          <Link to="/signup" className="header-item">Sign up</Link>
      </header>
      <nav class="navigator">
          <ul>
            <li><Link to="/" className="nav-item">Home</Link></li>
            <li><Link to="/about" className="nav-item">About</Link></li>
            <li><Link to="/friends" className="nav-item">Friends</Link></li>
            <li><Link to="/aISpeak" className="nav-item">AI Speak</Link></li>
          </ul>
      </nav>
      <main>
        <Routes> 
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/friends" element={<Friends />}></Route>
          <Route path="/aISpeak" element={<AISpeak />}></Route>
        </Routes>
      </main>
      <footer>
          <div>
          </div>
          <div>
            <p>Copyright © Lunakumachan friends 2024</p>
          </div>
      </footer>
    </div>
  );
};

export default App;
