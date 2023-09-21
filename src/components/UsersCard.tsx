import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { useLoading } from 'hooks/useLoading';
import { useAuth } from 'hooks/useAuth';
import {FullData} from 'types/Requests';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Image from 'static/backgrounCard.png';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Roles} from 'types/Enums';

interface inpData {
    login?: string,
    uData?: FullData | null,
    setVisible?: (val: boolean) => void
}

const names = [
    {name: 'nickname', title: 'Псевдоним', private: false},
    {name: 'first_name', title: 'Имя', private: false},
    {name: 'surname', title: 'Отчество', private: false},
    {name: 'last_name', title: 'Фамилия', private: false},
    {name: 'login', title: 'Почта', private: false},
    {name: 'gold', title: 'Балланс', private: true},
    {name: 'role', title: 'Положение', private: false},
    {name: 'banTime', title: 'бан до:', private: false},
    {name: 'id', title: 'id', private: true},
    {name: 'birth_date', title: 'День рождения', private: false},
    {name: 'phone', title: 'Телефон', private: false},
    {name: 'telegram', title: 'telegram', private: false},
    {name: 'vk', title: 'vk', private: false},
    {name: 'about', title: 'Обо мне', private: false},
    {name: 'emergency_contact', title: 'Экстренный контакт', private: true},
    {name: 'allergy', title: 'Аллергии', private: false},
]

interface itemType {
    name: string,
    title: string,
    private: boolean
}

export default function Loading({login, uData, setVisible}: inpData) {
    const { user, userFull } = useAuth();
    const [ userCard, setUserCard ] = useState<any>();
    const [ open, setOpen ] = React.useState<boolean>(false);
    const [ width, setWidth ] = useState<number>(window.innerWidth);

    console.log(userFull);

    const trig = useRef<Boolean>(true);
    let buf: FullData;
        
    const onKeyUp = (e?: KeyboardEvent) => {
        if ((e===undefined)||(e.code === 'Escape')) {
            setOpen(false);
            if (setVisible) 
                setTimeout(() => {
                    setVisible(false)
                }, 1000)
        }
    }; 

    useEffect(()=>{
        if (trig.current) {
            trig.current = false;

            document.addEventListener('keyup', onKeyUp);
            if ((uData !== undefined)&&(uData !== null)) buf = uData;
            else if (login !== undefined) console.log('Функция в разработке');
            else if (user!==null) buf = {...userFull, token: ''};

            delete(buf.token);

            setUserCard(buf)
            setOpen(true)

            const handleResize = (event: any) => {
                if (event.target.innerWidth!==null) {
                    setWidth(event.target.innerWidth);
                    console.log(event.target.innerWidth)
                }
            };
    
            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('keyup', onKeyUp);
            };
        }
    }, [])
    

    return (
        <Box sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5000
        }}>
            <Fade in={open} timeout={1000}><Box><Box id={'backgroundList'} style={{zIndex: 4999}} onClick={()=> {
                setOpen(false); 
                if (setVisible) 
                    setTimeout(setVisible, 1000, false);}}/></Box></Fade>
            
            <Collapse in={open} timeout={1000}><Box sx={{ 
                    backgroundImage: `url(${Image})`, 
                    backgroundPosition: 'center', 
                    backgroundSize: 'cover', 
                    zIndex: 5000, 
                    display: 'flex',
                    position: 'relative',
                    padding: width > 400 ? '250px' : '200px 170px 130px 170px',                        
                    alignItems: 'center',
                    justifyContent: 'center',                        
                    flexDirection: 'column',
                    flexWrap: 'nowrap'
                }}>
                {userCard ? names.map((item: itemType, index: number)=>{
                    console.log(item.name + ', ' + item.title + ', ' + userCard[item.name])
                    return (
                        <React.Fragment key={index}>
                            {(userCard[item.name]!==undefined && ((item.name !== 'banTime')||(userCard.role === Roles.Outcast)) && (!item.private || user?.email===userCard.login || user?.role === Roles.Lord || user?.role === Roles.Secretary))&&<Box sx={{ 
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'nowrap',
                                    justifyContent: 'space-between'
                                }}>
                                <Typography sx={{ paddingRight: 2 }}>{item.title}</Typography>
                                <Typography sx={{ paddingLeft: 2 }}>{item.name === 'birth_date' ? 
                                    (new Date(userCard[item.name])).toLocaleDateString() : 
                                    item.name === 'banTime' ? 
                                        (new Date(String(userCard[item.name]))).toLocaleDateString() : 
                                        userCard[item.name]}</Typography>
                            </Box>}
                        </React.Fragment>
                    )
                }):null}
                <IconButton onClick={()=>onKeyUp(undefined)}>
                    <CloseIcon sx={{ 
                        color: 'black',
                        backgroundColor: 'blanchedalmond',
                        borderRadius: '100px' 
                    }} />
                </IconButton>
            </Box></Collapse>
        </Box>
    )
}