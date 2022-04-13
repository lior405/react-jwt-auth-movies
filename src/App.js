import './App.css';
import Login from './components/Login';
import Registration from './components/Registration';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Card, Tab, Tabs } from '@blueprintjs/core';
import {UserContext} from './components/UserContext';
import Welcome from './components/Welcome';
import Loader from './Loader'


function App() {

  const [currentTab, setCurrentTab] = useState("login")
  const [userContext, setUserContext] = useContext(UserContext)

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
    }).then(async response => {
      if(response.ok) {
        const data = await response.json();
        setUserContext(oldValue => {
          return {...oldValue, token: data.token};
        });
      } else {
        setUserContext(oldValue => {
          return {...oldValue, token: null};
        });
      }
      //call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect( () => {
    verifyUser();
  }, [verifyUser]);

  //Sync logout across all tabs
  const syncLogout = useCallback(event => {
    if(event.key === "logout") {
      window.location.reload()
    }
  }, [])

  useEffect(()=>{
    window.addEventListener("storage", syncLogout)
    return ()=> {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

  return userContext.token === null ? (
    <Card elevation="1" className='card'>
      <Tabs id='Tabls' onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id='login' title='Login' panel={<Login />} />
        <Tab id='register' title='Register' panel={<Registration />} />
        <Tabs.Expander />
      </Tabs>
    </Card>
  ) : userContext.token ? (
    <Welcome />
  ) : (
    <Loader />
  );
}

export default App;
