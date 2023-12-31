import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./Components/Pages/RootLayout";
import Auth from "./Components/Pages/Auth";
import WelcomePage from "./Components/Pages/WelcomePage";
import CompleteProfile from "./Components/Pages/CompleteProfile";
import { useContext } from "react";
import AuthContext from "./Components/Store/AuthContext";
import { Navigate } from "react-router-dom";

function App() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Auth />} />
            <Route
              path="/welcome"
              element={
                <>
                  {isLoggedIn && <WelcomePage />}
                  {!isLoggedIn && <Navigate to="/" />}
                </>
              }
            />
            <Route
              path="/completeprofile"
              element={
                <>
                  {isLoggedIn && <CompleteProfile />}
                  {!isLoggedIn && <Navigate to="/" />}
                </>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
