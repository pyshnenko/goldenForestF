import * as React from "react";

import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
// public routes
import SignUp from "pages/private/SignUp";
import SignIn from "pages/private/SignIn";
import Main from "pages/public/Main";
// components
import TopMenu from "components/TopMenu";
import Loading from "components/loading";
import UsersCard from "components/UsersCard";
// private routes
import PrivateRoute from "pages/private/PrivateRoute";
import Join from "pages/peasant/Join";
import Members from 'pages/secretary/Members';
import Joined from 'pages/secretary/Joined';
import Ban from 'pages/secretary/Ban';
import Treasury from 'pages/treasurer/Treasury';
// helpers
import { Roles } from 'types/Enums';
import theme from "./theme";
import { useAuth } from 'hooks/useAuth';
import Api from 'helpers/Api';
import { createVisible } from 'hooks/useLoading';

import './App.css';

// router
// https://github.com/remix-run/react-router/blob/main/docs/start/tutorial.md
// https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/

export default function App() {
  const { user, login, saveFull } = useAuth();
  const [ ready, setReady ] = React.useState<boolean>(false);
  const [ font, setFont ] = React.useState<string>('sans-serif');
  const [validAddr, setValidAddr] = React.useState<boolean>(false);
  const { visible, setVisible } = createVisible();

  React.useEffect(()=>{
    console.log(user);
    setVisible(true);
    const params = new URLSearchParams(window.location.search);
    let done = params.get('name');
    console.log(done);
    if (done) {
      const ver = Api.verify(done);
      ver.then((res)=>{
        console.log(res);
      })
      ver.catch((e)=>console.log(e));
    }
    const settingString: string | null = localStorage.getItem('gfLocalSettings');
    if (settingString !== '') {
      const parsedSettingString = JSON.parse(String(settingString));
      if (parsedSettingString!==undefined && parsedSettingString!==null && parsedSettingString.hasOwnProperty('font')) setFont(parsedSettingString.font);
    }
    if (user?.token!==undefined) {
      const prom = Api.loginUPD(user);
      prom.then(({data}: any)=>{
        console.log(data);
        const { token, first_name: firstName, last_name: lastName, role, gold } = data;
        login({token, firstName, lastName, role, email: data.login, gold}, window.location.pathname);
        setReady(true);
        console.log('anim');
        setVisible(false);
        saveFull(data);
      })
    }
    else setReady(true)
  }, [])

  return (
    <ThemeProvider theme={theme(font)}>
      <TopMenu />
      <Loading visible={visible} />
      {ready&&<div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/join" 
            element={ <PrivateRoute> <Join userRole = {[Roles.Stranger]}/> </PrivateRoute> }
          />
          <Route path="/members" 
            element={ <PrivateRoute> <Members userRole = {[Roles.Secretary, Roles.Treasurer]}/> </PrivateRoute> }
          />
          <Route path="/joined" 
            element={ <PrivateRoute> <Joined userRole = {[Roles.Secretary]}/> </PrivateRoute> }
          />
          <Route path="/ban" 
            element={ <PrivateRoute> <Ban userRole = {[Roles.Secretary]}/> </PrivateRoute> }
          />
          <Route path="/treasury" 
            element={ <PrivateRoute> <Treasury userRole = {[Roles.Treasurer]}/> </PrivateRoute> }
          />
        </Routes>
      </div>}
    </ThemeProvider>
  );
}
