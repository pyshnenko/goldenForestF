import React, { useEffect, useState, useRef } from 'react';
import copy from 'fast-copy';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { User } from 'types/Requests'
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {Roles} from 'types/Enums';
import { banTime, banVal, banTo, moneyTotalValue } from 'types/variable';
import Api from 'helpers/Api';
import { useAuth } from 'hooks/useAuth';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLoading } from 'hooks/useLoading';
import UsersCard from 'components/UsersCard';
import FlyingString from 'components/FlyingString';
import MoneyWindow from 'components/moneyWindow';
import { DialogW, resultDialogType } from 'components/Dialog';
import {FullData} from 'types/Requests';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof User;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'first_name',
        numeric: false,
        disablePadding: true,
        label: 'Имя',
    },
    {
        id: 'last_name',
        numeric: false,
        disablePadding: false,
        label: 'Фамилия',
    },
    {
        id: 'role',
        numeric: false,
        disablePadding: false,
        label: 'Роль',
    },
    {
        id: 'banTime',
        numeric: false,
        disablePadding: false,
        label: 'Бан до',
    },
    {
        id: 'login',
        numeric: false,
        disablePadding: false,
        label: 'Логин',
    },
    {
        id: 'gold',
        numeric: false,
        disablePadding: false,
        label: 'Золотишко',
    },
    {
        id: 'userAcc',
        numeric: false,
        disablePadding: false,
        label: 'Инфо',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

interface ochenNado extends EnhancedTableProps {
    ver: string;
}

function EnhancedTableHead(props: ochenNado) {    
    const { user } = useAuth();
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, ver } =
        props;
    const createSortHandler =
        (property: keyof User) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <React.Fragment key={headCell.id}>
                        {(ver === 'ban' || ((ver !== 'ban')&&( headCell.id !== 'banTime' )&&(( headCell.id !== 'gold' ) || ((user?.role !== Roles.Secretary)&&(ver !== 'joined')))))?
                        <TableCell                            
                            align={headCell.numeric ? 'center' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell> : null}
                    </React.Fragment>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    selected?: string[];
    setSelected?: (val: string[]) => void,
    users: any,
    setUsers: (val: any) => void,
    setOpenSnBar: (val: {open: boolean, text: string, sever: boolean}) => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selected, setSelected, users, setUsers, setOpenSnBar } = props;
    const [ openDialog, setOpenDialog ] = useState<boolean>(false);
    const [ dialogResult, setDialogResult ] = useState<resultDialogType>({ready: false, valStr: '', valBool: false, marker: 'delUser'});
    
    const { user } = useAuth();
    
    const { setVisible } = useLoading();

    useEffect(()=>{
        if (dialogResult.ready) {
            setVisible(true);
            delUser(dialogResult);
        }
    }, [dialogResult])

    const delUser = async (dialogResult: resultDialogType) => {
        if ((dialogResult.valBool)&&(selected)&&(setSelected)) {
            console.log(selected);
            for (let i=0; i<selected.length; i++) {
                await Api.deleteUser(user, selected[i])
            }
            let res = await Api.getUsers(user);
            setUsers(res.data);
            setSelected([]);
            //setVisible(false);
            setOpenSnBar({sever:true, open: true, text: 'Сохранено'});
        }
    }

    return (
        <React.Fragment>
            <DialogW 
                open={openDialog} 
                setOpen={setOpenDialog} 
                text={{title: 'Вы уверены?', body: 'При удалении данные пользователей уничтожатся безвозвратно'}} 
                result={setDialogResult}
                marker={'banSet'}
                ynMode={true} />
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Таблица пользователей
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={()=>setOpenDialog(true)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </React.Fragment>
    );
}

export default function EnhancedTable({ users, setUsers, ver }: {users: any, setUsers: (value: any[]) => void, ver: string}) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('first_name');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [goldLoad, setGoldLoad] = useState<moneyTotalValue>({load: false, value: []});
    const [ready, setReady] = React.useState(false);
    const [checgeMoneyValue,setChecgeMoneyValue] = React.useState(-1);
    const { setVisible } = useLoading();
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [uData, setuData] = useState<FullData|null>();
    const [ openDialog, setOpenDialog ] = useState<boolean>(false);    
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    const [ flyingStringParams, setFlyingStringParams ] = useState<{text: string, top?: number, left?: number, right?: number, bottom?: number, visible: boolean}>({text: '', top: 0, left: 0, right: 0, bottom: 0, visible: false});
    const [ dialogResult, setDialogResult ] = useState<{ready: boolean, valStr: string, valBool: boolean, marker?: string}>({ready: false, valStr: '', valBool: false, marker: ''});
    
    const [openSnBar, setOpenSnBar] = React.useState({sever:true, open: false, text: ''});
    
    const { user } = useAuth();

    const trig = React.useRef(true);
    const saveUser = React.useRef<any>(null);

    React.useEffect(()=>{
        if (trig.current) {
            trig.current = false;
            let buf: any[] = [];
            users.map((item: any)=>{
                console.log(item.role);
                if (item.role!==Roles.Stranger) {
                    if ((ver==='joined')&&(item.role===Roles.Citizen)) buf.push(item);
                    else if ((ver==='authorize')&&(item.role!==Roles.Citizen)&&(item.role!==Roles.Outcast)) buf.push(item);
                    else if ((ver==='ban')&&(item.role===Roles.Outcast)) buf.push(item);
                }
            }) 
            console.log(buf)
            let res = Api.goldTable(user);
            res.then((result)=>{
                console.log(result.data.res.data);
                let realData: any[] = result.data.res.data;
                buf.map((item: any)=>{
                    item.gold = 0;
                    realData.map((inpItem: any)=>{
                        if (item.login === inpItem.login) item.gold = inpItem.value
                    })
                })
                setGoldLoad({load: true, value: realData});
            });
            res.catch((e)=>{
                console.log(e);
            });
            res.finally(()=>{
                setUsers(buf);
                setReady(true);
            });
        }
        const handleResize = (event: any) => {
            if (event.target.innerWidth!==null) {
                setWidth(event.target.innerWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof User,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = users.map((n: any) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: any) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (login: string) => selected.indexOf(login) !== -1;

    useEffect(()=>{
        if (dialogResult.ready) {
            if ((dialogResult.marker==='banSet')&&(dialogResult.valBool)) {
                setVisible(true);
                saveUser.current.role = Roles.Outcast;
                saveUser.current.banTime = banTo(dialogResult.valStr);
                let res = Api.updUser(user, saveUser.current);
                res.then((result: any)=>{
                    setOpenSnBar({sever:true, open: true, text: 'Сохранено'});
                    users.map((item: any, index: number) => {
                        if (item.login === saveUser.current.login) {
                            let buf = copy(users);
                            buf[index].role = Roles.Outcast;
                            setUsers(buf);
                        }
                    })
                    saveUser.current = null;
                    setVisible(false);
                });
            }
        }

    }, [dialogResult])

    const handleNewRole = (event: SelectChangeEvent, us: any) => {
        console.log(event.target.value);
        console.log(us);
        setVisible(true);
        users.map((item: any, index: number) => {
            if (item.login === us.login) {
                if (item.role !== event.target.value) {
                    if (event.target.value === Roles.Outcast) {
                        setOpenDialog(true);
                        setVisible(false);
                        saveUser.current = us;
                    }
                    else {
                        let buf = copy(users);
                        if ((buf[index].role === Roles.Outcast)&&(event.target.value!==Roles.Outcast)) buf[index].banTime = (new Date(0).toLocaleDateString())
                        buf[index].role = event.target.value;
                        setUsers(buf);
                        let res = Api.updUser(user, buf[index]);
                        res.then((result: any)=>{
                            setOpenSnBar({sever:true, open: true, text: 'Сохранено'});
                            setVisible(false);
                        });
                        res.catch((e: any)=>{
                            setOpenSnBar({sever:false, open: true, text: 'Ошибка'});
                            setVisible(false);
                        });
                    }
                }
            }
        })
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }    
        setOpenSnBar({sever:true, open: false, text: ''});
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    return (
        <Fade in={true}>
        <Box sx={{ width: '100%' }}>
            {flyingStringParams.visible&&<FlyingString 
                flyingStringParams={flyingStringParams}
                setFlyingStringParams={setFlyingStringParams}
            />}
            {openCard&&<UsersCard 
                setVisible={setOpenCard} 
                uData={uData}  />}
            <DialogW 
                open={openDialog} 
                setOpen={setOpenDialog} 
                text={{title: 'Срок бана', body: ''}} 
                result={setDialogResult} 
                changes={banTime}
                marker={'banSet'} />
            <Snackbar open={openSnBar.open} autoHideDuration={6000} onClose={handleClose} sx={{zIndex: '999999'}}>
                <Alert onClose={handleClose} severity={openSnBar.sever?"success":"error"} sx={{ width: '100%' }}>
                    {openSnBar.text}
                </Alert>
            </Snackbar>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} users={users} setUsers={setUsers} setOpenSnBar={setOpenSnBar} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={users.length}
                            ver={ver}
                        />
                        <TableBody>
                            {stableSort(users, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(String(row.login));
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <React.Fragment key={row.id}>
                                            {ready&&<TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.login)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell >{row.first_name}</TableCell>
                                                <TableCell >{row.last_name}</TableCell>
                                                {user?.role===Roles.Lord?<TableCell sx={{ padding: 0 }} >                                                
                                                    <Select
                                                        sx={{ margin: 1, height: '50px', width: '170px' }}
                                                        value={String(row.role)}
                                                        onChange={(event: SelectChangeEvent, us: any)=>handleNewRole(event, row)}
                                                    >
                                                        <MenuItem value={Roles.Outcast}>Изгой</MenuItem>
                                                        <MenuItem value={Roles.Stranger}>Странник</MenuItem>
                                                        <MenuItem value={Roles.Citizen}>Безродный</MenuItem>
                                                        <MenuItem value={Roles.Peasant}>Чернь</MenuItem>
                                                        <MenuItem value={Roles.Secretary}>Секретарь</MenuItem>
                                                        <MenuItem value={Roles.Treasurer}>Казначей</MenuItem>
                                                        <MenuItem value={Roles.Lord}>Темнейший</MenuItem>
                                                    </Select>
                                                </TableCell>:<TableCell >{row.role}</TableCell>}
                                                {row?.banTime && ver === 'ban' && <TableCell>{(new Date(String(row.banTime)).toLocaleDateString())}</TableCell>}
                                                <TableCell sx={{padding: 0}}>
                                                    {width<1200?<Typography 
                                                        sx={{margin: 1}}
                                                        onMouseOver={(evt)=>{
                                                            setFlyingStringParams({visible: false, text: '', top: 0, left: 0, right: 0, bottom: 0})
                                                            setFlyingStringParams({visible: true, text: String(row.login), top: evt.clientY, left: evt.clientX, right: 0, bottom: 0})}
                                                        }
                                                        onMouseOut={()=>setFlyingStringParams({...flyingStringParams, text: '', top: 0, left: 0, right: 0, bottom: 0})}
                                                    >
                                                        {`${String(row.login).slice(0,10)}${String(row.login).length>9?'...':''}`}
                                                    </Typography> :
                                                    <Typography>{row.login}</Typography>}
                                                </TableCell>
                                                {(ver!=='joined')&&(user?.role!==Roles.Secretary)?
                                                    <TableCell sx={{ padding: 0, height: '68px' }}>
                                                        {!goldLoad.load&&<Skeleton variant="rounded" animation="wave" width={150} height={50} />}
                                                        {goldLoad.load&&<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                            <Typography>{row.gold}</Typography>
                                                            {checgeMoneyValue===-1&&<IconButton
                                                                onClick={()=>{
                                                                    setChecgeMoneyValue(index)
                                                                }}
                                                            >
                                                                <ModeEditIcon />
                                                            </IconButton>}
                                                            {index===checgeMoneyValue&&<MoneyWindow login={row.login} money={row.gold} users={users} setUsers={setUsers} setOpenSnBar={setOpenSnBar} setVisibleIndex={setChecgeMoneyValue} />}
                                                        </Box>}
                                                    </TableCell>:
                                                    null
                                                }                                                
                                                <TableCell >
                                                    <IconButton sx={{padding: 0}} onClick={() => {
                                                        console.log(row)
                                                        const buf = row as FullData
                                                        //const buf = {...row, id: Number(row.id), login: String(row.login), role: String(row.role)}
                                                        setuData(buf)
                                                        setOpenCard(true)
                                                    }}>
                                                        <AccountCircleIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>}
                                        </React.Fragment>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={'Строк'}
                    labelDisplayedRows={({ from, to, count, page }) => {return`${page+1} из ${Math.floor(count/rowsPerPage-0.0001)+1 || 1}`}}
                />
            </Paper>
        </Box>
        </Fade>
    );
}
