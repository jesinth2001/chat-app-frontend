import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Console from './components/Console';
import { Route,Routes } from 'react-router-dom';
import SetProfile from './components/SetProfile';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/setprofile' element={<SetProfile/>}></Route>  
          <Route path='/chat' element={<Console/>}></Route>
        
      </Routes>
   
    </div>
  );
}

export default App;
