import { Route, Routes, Navigate } from "react-router";
import { Home } from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/:demoId" element={<Home />} />
      <Route path="/" element={<Navigate to="/loader-button" replace />} />
    </Routes>
  );
}

export default App;
