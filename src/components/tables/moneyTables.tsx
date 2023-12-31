import { useEffect, useState, useRef, useMemo } from 'react';
import copy from 'fast-copy';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
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
    veryfi: string,
    way?: string
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
      label: 'Когда',
    },
    {
      id: 'way',
      numeric: true,
      disablePadding: false,
      label: 'Куда',
    }
];  

export default function MoneyTable ({variant, setReadyBack, table, index, id, tname}: {variant: string, setReadyBack: (val: {id: number, data: {var: string, ready: boolean}[]})=>void, table:{id: number, data: {var: string, ready: boolean}[]}, index: number, id?:number|string, tname?:string }) {
    const [ total, setTotal ] = useState<number>(0);
    const [ ready, setReady ] = useState<{gold: boolean, total: boolean}>({gold: false, total: false});
    const [ filtr, setFiltr ] = useState<{str: string, date: {up: number, down: number}}>({str: '', date: {up: Number(new Date()) + 100000, down: 0}})
    const { user, userFull } = useAuth();
    const trig = useRef<boolean>(true);
    const [page, setPage] = useState(0);
    const [ rows, setRows ] = useState<rowsData[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    const [ name, setName ] = useState<string>(tname||'');
  
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
            console.log(`${variant} - hello`)
            console.log(Number(id));
            const res = variant==='gold' ? Api.checkTotalMoney(user) :
            variant === 'treasure' ? Api.checkTotalMoneyTreasure(user) : 
            variant === 'event' ? Api.checkTotalMoneyTreasure(user, Number(id)) :
            Api.checkTotalMoney(user);
            res.then((result: any)=>{
                console.log(result.data);
                setRows(result.data.res.data?.history||[]);
                setTotal(result.data.res.data?.total||1);
            });
            res.finally(()=>{
                console.log('table.data.length === index' + (table.data.length === index))
                setTimeout(()=>{
                    if (index!==table.data.length-1) {
                        let buf = copy(table.data);
                        for(let i = 0; i<=index; i++)
                            buf[i+1].ready=true;
                        setReadyBack({id: table.id+1, data: buf});
                    }
                }, 1000) 
                //setTimeout(setReadyBack, 1000, true);
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
            alignItems: 'center',
            margin: 2
        }}>            
            {!ready.gold&&<Skeleton variant="rounded" sx={{width: width<950?'90%':'80%', maxWidth: '800px', height: '60px'}} />}
            <Fade in={ready.gold}>
                <Accordion sx={{width: width<950?'90%':'80%', maxWidth: '800px'}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{variant === 'gold' ? 'Деньги в кошельках' : variant === 'treasure' ? 'Казна' : name}</Typography>
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
                        <Box sx={{ width: '100%' }}>
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
                                                        sx={{fontSize: 'medium'}}
                                                    >
                                                        {(index===2)&&(width<=800)?'':headCell.label}
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
                                                                sx={{fontSize: 'medium'}}
                                                            >
                                                                {row.login}
                                                            </TableCell>
                                                            <TableCell align="right" sx={{color: row.value>0?'green':'red', fontSize: 'medium'}}>{row.value}</TableCell>
                                                            {(width>800)&&<TableCell align="right" sx={{fontSize: 'medium'}}>{(new Date(row.date)).toLocaleString()}</TableCell>}
                                                            {(width>800)&&<TableCell align="right" sx={{fontSize: 'medium'}}>{row.way?row.way.length>15?row.way.slice(0,15)+'...':row.way:''}</TableCell>}
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
            </Fade>
        </Box>        
    );
}