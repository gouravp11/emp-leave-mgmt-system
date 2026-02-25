import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* Auth and dashboard routes will be added here */}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
