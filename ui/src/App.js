import {useState, useEffect} from 'react';
import Header from './components/header/Header';
import Buyer from './components/buyer/Buyer';
import Agent from './components/agent/Agent';
import Web3 from 'web3';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ABI from './ABI.json';

function App() {
  const [instance, setInstance] = useState();

  useEffect(() => {
    const createInstance = () => {
      let web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        let _instance = new web3.eth.Contract(ABI, "0xfFB823adAe675e1002a21C5cadDD471a2e07950D");
        setInstance(_instance);
        console.log(_instance);
      }
    }

    createInstance();
  }, []);

  return (
    <Router>
      <Header />
      {!instance ? null : 
        <Switch>
          <Route path='/' exact component={() => <Buyer instance={instance}/>}/>
          <Route path='/buyer' exact component={() => <Buyer instance={instance}/>}/>
          <Route path='/agent' exact component={() => <Agent instance={instance}/>}/>
        </Switch>
      }
    </Router>
  );
}

export default App;
