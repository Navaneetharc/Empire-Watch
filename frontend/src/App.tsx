import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { RootState } from './app/store'; 
import { useSelector } from 'react-redux';
import Login from './Pages/User/Login';
import Register from './Pages/User/Register';
import AdminRoute from './features/AdminAuth/AdminRoute';
import AdminLogin from './Pages/Admin/AdminLogin';
import Dashboard from './Pages/Admin/Dashboard';
import Home from './Pages/User/Home';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <Router>
          <Routes>
            <Route path='/' element={ user ? <Home/> : <Navigate to='/login' />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register/>}/>

            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin' element={<AdminRoute/>}>
              <Route path='dashboard' element={<Dashboard/>}/>
            </Route>
          </Routes>
      </Router>
    </>
  );
} 

export default App;