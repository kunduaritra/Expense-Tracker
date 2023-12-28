import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./Components/Pages/RootLayout";
import Auth from "./Components/Pages/Auth";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
