import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./Components/Pages/RootLayout";
import Auth from "./Components/Pages/Auth";
import WelcomePage from "./Components/Pages/WelcomePage";
import CompleteProfile from "./Components/Pages/CompleteProfile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Auth />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/completeprofile" element={<CompleteProfile />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
