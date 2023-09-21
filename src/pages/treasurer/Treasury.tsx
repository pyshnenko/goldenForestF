import { useEffect, useState, useRef, useMemo } from 'react';
import copy from 'fast-copy';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import { useAuth } from 'hooks/useAuth';
import Fade from '@mui/material/Fade';
import Api from 'helpers/Api';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Skeleton from '@mui/material/Skeleton';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MoneyTable from 'components/tables/moneyTables';

interface rowsData {
    login: string,
    value: number,
    date: number,
    veryfi: string,
    way?: string
}

export default function Treasury (args: any) {

    const [ table, settable ] = useState<{id: number, data: {var: string, ready: boolean}[]}>({id: 0, data:[]});
    const trig = useRef(true);

    useEffect(()=>{
        if (trig.current){
            trig.current = false;
            settable({id: 1, data: [{var: 'gold', ready: true}, {var: 'treasure', ready: false}]});
        }
    }, [])

    useEffect(()=>{
        console.log(table)
    }, [table])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
        }}>
            {Array.isArray(table.data)&&table.data.map((item: {var: string, ready: boolean}, index: number)=>{
                console.log(item);
                return <Box key={item.var}>
                    {item.ready&&<MoneyTable variant={item.var} setReadyBack={settable} table={table} index={index} />}
                </Box>
            })}
        </Box>        
    );
}