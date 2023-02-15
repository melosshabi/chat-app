import './App.css';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/chatApp" exact element={<Home/>}/>
      <Route path="/chatApp/signIn" exact element={<SignIn/>}/>
      <Route path="/chatApp/signUp" exact element={<SignUp/>}/>
      <Route path="/chatApp/userProfile" exact element={<UserProfile/>}/>
    </Routes>
    </Router>
  );
}

export default App;
