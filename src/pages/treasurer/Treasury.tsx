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

dayjs.locale('ru')
  
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface rowsData {
    login: string,
    value: number,
    date: number,
    veryfi: string
}
  
const headCells: readonly HeadCell[] = [
    {
      id: 'login',
      numeric: false,
      disablePadding: true,
      label: 'Имя',
    },
    {
      id: 'value',
      numeric: true,
      disablePadding: false,
      label: 'Сумма',
    },
    {
      id: 'date',
      numeric: true,
      disablePadding: false,
      label: 'Дата, время',
    },
    {
      id: 'veryfi',
      numeric: true,
      disablePadding: false,
      label: 'Кто подтвердил',
    }
];  

export default function Treasury (args: any) {
    const [ total, setTotal ] = useState<number>(0);
    const [ ready, setReady ] = useState<{gold: boolean, total: boolean}>({gold: false, total: false});
    const [ filtr, setFiltr ] = useState<{str: string, date: {up: number, down: number}}>({str: '', date: {up: Number(new Date()) + 100000, down: 0}})
    const { user, userFull } = useAuth();
    const trig = useRef<boolean>(true);
    const [page, setPage] = useState(0);
    const [ rows, setRows ] = useState<rowsData[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [ width, setWidth ] = useState<number>(window.innerWidth);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    
    let buf: rowsData[];
    const visibleRows = useMemo(
        () => {
            buf=[];
            rows.map((item) => {
                if (item.login.toLocaleLowerCase().includes(filtr.str.toLocaleLowerCase())&&(item.date>= filtr.date.down)&&(item.date<=filtr.date.up)) buf.push(item);
            });
            return buf.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            )
        },
        [page, rowsPerPage, ready, filtr],
    );

    useEffect(()=>{
        if (trig.current){
            trig.current = false;
            const res = Api.checkTotalMoney(user);
            res.then((result: any)=>{
                console.log(result.data.res.data.history);
                setRows(result.data.res.data.history);
                setTotal(result.data.res.data.total);
            })
            
            const handleResize = (event: any) => {
                setWidth(event.target.innerWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    },[])

    useEffect(()=>{
        setRows(rows);
        if (rows.length) setReady({...ready, gold: true});
        else setReady({...ready, gold: false});
    }, [total])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>            
            {!ready.gold&&<Skeleton variant="rounded" sx={{width: width<950?'90%':'80%', maxWidth: '800px', height: '60px'}} />}
            <Fade in={ready.gold}>
                <Box sx={{    
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    alignItems: 'center'}}
                >
                    <Accordion sx={{width: width<950?'90%':'80%', maxWidth: '800px'}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Деньги в кошельках</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Box>
                                <Typography>Денежек у нас {total}</Typography>
                            </Box>
                            <Box>
                                <TextField label="Фильтр по имени" variant="outlined" onChange={({target}: any)=>{
                                    setFiltr({...filtr, str: target.value})
                                }} />
                            </Box>
                            <Box>
                                <Box sx={{ width: '100%' }}>
                                    <Paper sx={{ width: '100%', mb: 2 }}>
                                        <TableContainer>
                                            <Table
                                                sx={{ width: '100%'}}
                                                aria-labelledby="tableTitle"
                                                size={'small'}
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        {headCells.map((headCell, index) => (
                                                        ((index<3)||(width>800))&&<TableCell
                                                            key={headCell.id}
                                                            align={headCell.numeric ? 'right' : 'left'}
                                                            padding={headCell.disablePadding ? 'none' : 'normal'}
                                                        >
                                                            {index===2?'':headCell.label}
                                                        </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {visibleRows.map((row, index) => {
                                                        const labelId = `enhanced-table-checkbox-${index}`;
                                    
                                                        return (
                                                            <TableRow
                                                                hover
                                                                tabIndex={-1}
                                                                key={index}
                                                                sx={{ cursor: 'pointer' }}
                                                            >
                                                                <TableCell
                                                                    component="th"
                                                                    id={labelId}
                                                                    scope="row"
                                                                    padding="none"
                                                                >
                                                                    {row.login}
                                                                </TableCell>
                                                                <TableCell align="right" sx={{color: row.value>0?'green':'red'}}>{row.value}</TableCell>
                                                                {(width>800)&&<TableCell align="right" sx={{fontSize: '1rem'}}>{(new Date(row.date)).toLocaleString()}</TableCell>}
                                                                {(width>800)&&<TableCell align="right">{row.veryfi}</TableCell>}
                                                                {width<=800&&<TableCell><IconButton><InfoIcon /></IconButton></TableCell>}
                                                            </TableRow>
                                                        );
                                                    })}
                                                    {emptyRows > 0 && (
                                                        <TableRow
                                                            style={{
                                                            height: 33 * emptyRows,
                                                            }}
                                                        >
                                                            <TableCell colSpan={6} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 50, 100, 300]}
                                            component="div"
                                            count={rows.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            labelRowsPerPage={'Строк'}
                                            labelDisplayedRows={({ from, to, count, page }: {from: number, to: number, count: number, page: number}) => {
                                                return`${page+1} из ${Math.floor(count/rowsPerPage-0.0001)+1}`
                                            }}
                                        />
                                    </Paper>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Fade>            
            {!ready.total&&<Skeleton variant="rounded" sx={{width: width<950?'90%':'80%', maxWidth: '800px', height: '60px'}} />}
        </Box>
        
    );
}