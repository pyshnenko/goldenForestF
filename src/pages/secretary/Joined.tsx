import React, { useEffect, useState, useRef } from 'react';

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CssBaseline from '@mui/material/CssBaseline';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import UserTable from 'components/UserTable';

import Api from 'helpers/Api';
import { useAuth } from 'hooks/useAuth';


export default function Members(args: any) {
  const { user } = useAuth();

  const [userList, setUserList] = useState<any[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const trig = useRef<boolean>(true);

  useEffect(() => {
    const getUsers = () => {
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
          Заявки
        </Typography>
        <br />
      </Box>
      {ready&&<UserTable users={userList} setUsers={setUserList} ver={'joined'} />}
    </React.Fragment>
  )
}
