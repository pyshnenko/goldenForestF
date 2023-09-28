import React, { useEffect, useState, useRef } from 'react';

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';
import { useLoading } from 'hooks/useLoading';

import UserTable from 'components/UserTable';

import Api from 'helpers/Api';
import { useAuth } from 'hooks/useAuth';


export default function Members(args: any) {
  const { user } = useAuth();

  const [userList, setUserList] = useState<any[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const { setVisible } = useLoading();

  const trig = useRef<boolean>(true);

  useEffect(() => {
    const getUsers = () => {
      setVisible(true);
      const res = Api.getUsers(user);
      res.then((result)=>{
        console.log(result);
        setUserList(result.data);
        setReady(true);
      })
    }
    if (trig.current) {
      getUsers();
      trig.current = false;
    }
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ 
        flexDirection: 'column', 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'nowrap',
        alignContent: 'center',
        alignItems: 'center'
        }}>
        <Typography component="h1" variant="h4">
          Пользователи
        </Typography>
        <br />
      </Box>
      {ready&&<UserTable users={userList} setUsers={setUserList} ver={'authorize'} />}
    </React.Fragment>
  )
}
