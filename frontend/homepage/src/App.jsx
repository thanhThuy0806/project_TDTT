import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login/Login';
import ErrorPage from './pages/error/ErrorPage';
import HomePage from './pages/home/HomePage';
import { AuthenticateProvider } from './context/userAuthenticateContext';


function App() {

  return (
    <AuthenticateProvider>
      <BrowserRouter>        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter >
    </AuthenticateProvider>
  );
}


export default App