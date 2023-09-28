import React, { useEffect, useState, useRef } from 'react';
import copy from 'fast-copy';
import Box from "@mui/material/Box";
import Api from 'helpers/Api';
import Fade from '@mui/material/Fade';
import { useAuth } from 'hooks/useAuth';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import { useLoading } from 'hooks/useLoading';

interface InpData {
    login: string | number,
    money: string | number,
    events?: string[],
    users?: any[],
    setUsers?: (val: any[])=>void,
    setOpenSnBar?: (val: {sever: boolean, open: boolean, text: string})=>void,
    setVisibleIndex?: (val: number)=>void
}

export default function MoneyWindow({login, money, events, users, setUsers, setOpenSnBar, setVisibleIndex}: InpData) {

    const { user } = useAuth();
    const [ chengeMoney, setChengeMoney ] = useState<string>('0');
    const [ moneyToTreasure, setMoneyToTreasure ] = useState<string>('0');
    const [ moneyToWallet, setMoneyToWallet ] = useState<string>('0');
    const { setVisible } = useLoading();
    const [ meVisible, setMeVisible ] = useState<boolean>(true);
    const trig = useRef<Boolean>(true);

    useEffect(()=>{
        if (trig.current) {
            trig.current = false;

            document.addEventListener('keyup', onKeyUp);
            return () => {
                document.removeEventListener('keyup', onKeyUp);
            };
        }
    }, []);

    const onKeyUp = (e?: KeyboardEvent) => {
        if ((e===undefined)||(e.code === 'Escape')) {
            setMeVisible(false);
            setTimeout(()=>{if (setVisibleIndex!==undefined) setVisibleIndex(-1)}, 500);
        }
    }; 

    return (
        <Fade in={meVisible}>
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9000
            }}>
                <Box  
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        zIndex: 9001,
                        backgroundColor: 'gray',
                        opacity: 0.75
                    }}
                    onClick={()=>{
                        setMeVisible(false);
                        setTimeout(()=>{if (setVisibleIndex!==undefined) setVisibleIndex(-1)}, 500);
                    }}
                />                
                <Box sx={{
                    zIndex: 9002,
                    backgroundColor: 'aliceblue',
                    padding: '20px',
                    borderRadius: '30px',
                    boxShadow: '0 0 10px aliceblue',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: window.innerWidth<600?'90%':'auto'
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '0 20px 20px 20px',
                        padding: '0 20px'
                    }}>
                        <Typography>{String(login).length>10?`${String(login).slice(0,10)}...`:login}</Typography>
                        <Typography>{money}</Typography>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography>Выделить из казны: </Typography>
                        <TextField 
                            sx={{width: '75%'}}
                            variant="outlined"
                            value={chengeMoney}
                            onChange={({target})=>setChengeMoney(target.value)}
                        />
                        <IconButton onClick={()=>{
                            const prom = Api.addToTreasury(user, {login: String(login), value: -Number(chengeMoney), date: Number(new Date()), addr: 0, way: `для ${login}`});
                            if (chengeMoney!=='0') {
                                setVisible(true);
                                prom.then((res: any)=>{
                                    if (users!==undefined) {
                                        let buf = copy(users);
                                        for (let i=0; i<buf.length; i++) {
                                            if (buf[i].login===login) {
                                                buf[i].gold = Number(money) + Number(chengeMoney);
                                                if (setUsers!==undefined) setUsers(buf);
                                                break;
                                            }
                                        }
                                    }
                                    setVisible(false);
                                    if (setOpenSnBar!==undefined) setOpenSnBar({sever:true, open: true, text: 'Сохранено'});
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    setVisible(false);
                                    if (setOpenSnBar!==undefined) setOpenSnBar({sever:false, open: true, text: 'Ошибка'});
                                })
                            }
                            setChengeMoney('0');
                        }}>
                            <CheckIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography>Перевести в казну: </Typography>
                        <TextField 
                            sx={{width: '75%'}}
                            variant="outlined"
                            value={moneyToTreasure}
                            onChange={({target})=>setMoneyToTreasure(target.value)}
                        />
                        <IconButton onClick={()=>{
                            const prom = Api.addToTreasury(user, {login: String(login), value: Number(moneyToTreasure), date: Number(new Date()), addr: 0, way: 'В казну'});
                            if (moneyToTreasure!=='0') {
                                setVisible(true);
                                prom.then((res: any)=>{
                                    if (users!==undefined) {
                                        let buf = copy(users);
                                        for (let i=0; i<buf.length; i++) {
                                            if (buf[i].login===login) {
                                                buf[i].gold = Number(money) - Number(moneyToTreasure);
                                                if (setUsers!==undefined) setUsers(buf);
                                                break;
                                            }
                                        }
                                    }
                                    setVisible(false);
                                    if (setOpenSnBar!==undefined) setOpenSnBar({sever:true, open: true, text: 'Сохранено'});
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    setVisible(false);
                                    if (setOpenSnBar!==undefined) setOpenSnBar({sever:false, open: true, text: 'Ошибка'});
                                })
                            }
                            setMoneyToTreasure('0');
                        }}>
                            <CheckIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography>Изменить балланс: </Typography>
                        <TextField 
                            sx={{width: '75%'}}
                            variant="outlined"
                            value={moneyToWallet}
                            onChange={({target})=>setMoneyToWallet(target.value)}
                        />
                        <IconButton onClick={()=>{
                            const prom = Api.newGoldValue(user, {login: String(login), value: Number(moneyToWallet), date: Number(new Date())});
                            if (moneyToWallet!=='0') {
                                setVisible(true);
                                prom.then((res: any)=>{
                                    if (users!==undefined) {
                                        let buf = copy(users);
                                        for (let i=0; i<buf.length; i++) {
                                            if (buf[i].login===login) {
                                                buf[i].gold = Number(money) + Number(moneyToWallet);
                                                if (setUsers!==undefined) setUsers(buf);
                                                break;
                                            }
                                        }
                                    }
                                    setVisible(false);
                                    if (setOpenSnBar!==undefined) setOpenSnBar({sever:true, open: true, text: 'Сохранено'});
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    setVisible(false);
                                    if (setOpenSnBar!==undefined) setOpenSnBar({sever:false, open: true, text: 'Ошибка'});
                                })
                            }
                            setMoneyToWallet('0');
                        }}>
                            <CheckIcon />
                        </IconButton>
                    </Box>
                    <Box>
                        <Button
                            onClick={()=>{
                                setMeVisible(false);
                                setTimeout(()=>{if (setVisibleIndex!==undefined) setVisibleIndex(-1)}, 500);
                            }}
                        >
                            Закрыть
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Fade>
    )
}