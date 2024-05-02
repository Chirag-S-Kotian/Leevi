import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Room from "./components/Room";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
