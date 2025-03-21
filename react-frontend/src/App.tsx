import { BrowserRouter, Routes, Route } from "react-router";
import { RootLayout } from "./pages/RootLayout";
import { Homepage } from "./pages/Homepage";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Homepage />} />
          <Route path="auth" element={<Auth />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<h1>About</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
