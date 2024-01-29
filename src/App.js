import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./Components/Pages/RootLayout";
import Auth from "./Components/Pages/Auth";
import WelcomePage from "./Components/Pages/WelcomePage";
import CompleteProfile from "./Components/Pages/CompleteProfile";
import { Navigate } from "react-router-dom";
import ForgetPassword from "./Components/Pages/ForgetPassword";
import { useSelector } from "react-redux";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
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
                  {isAuth && <WelcomePage />}
                  {!isAuth && <Navigate to="/" />}
                </>
              }
            />
            <Route
              path="/completeprofile"
              element={
                <>
                  {isAuth && <CompleteProfile />}
                  {!isAuth && <Navigate to="/" />}
                </>
              }
            />
            <Route path="forgetpassword" element={<ForgetPassword />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
