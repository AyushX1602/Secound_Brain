import Dashboard from "./pages/dashboard";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import SharedBrain from "./pages/sharedBrain";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
return <BrowserRouter>
<Routes>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/share/:shareLink" element={<SharedBrain/>}/>
</Routes>
</BrowserRouter>;
}

export default App;