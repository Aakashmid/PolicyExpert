import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* <Route element={<ProtectedRoute />}>

</Route> */}
        <Route path="" element={<>Hello, World!</>} />
        <Route path="/auth">
          <Route path="login" element={<Login />} />
        </Route>
        {/* for not found use alert message or not found page  */}
      </Routes>
    </>
  );
}
