import React, { useEffect, useState, useRef } from 'react';
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import LinkUi from "@mui/material/Link";
import { useAuth } from 'hooks/useAuth';
import PagesConfig from 'types/Pages';
import {Roles, Paths} from 'types/Enums';
import UsersCard from 'components/UsersCard';
import Settings from 'components/Settings';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

interface pagesObj {name: string, href: string};

const pagesLord: pagesObj[] = [{name: 'Участники', href: '/members'}, {name: 'Заявки', href: '/joined'}, {name: 'Казна', href: '/Treasury'}, {name: 'Мероприятия', href: '/'}, {name: 'Забаненые', href: '/ban'}, {name: 'Поиск пользователя', href: '/'}];
const pagesTreasurer: pagesObj[] = [{name: 'Участники', href: '/members'}, {name: 'Казна', href: '/Treasury'}, {name: 'Мероприятия', href: '/'}, {name: 'Поиск пользователя', href: '/'}];
const pagesSecretary: pagesObj[] = [{name: 'Участники', href: '/members'}, {name: 'Заявки', href: '/joined'}, {name: 'Мероприятия', href: '/'}, {name: 'Забаненые', href: '/ban'}, {name: 'Поиск пользователя', href: '/'}];
const pagesPeasant: pagesObj[] = [{name: 'Мероприятия', href: '/'}, {name: 'Поиск пользователя', href: '/'}];
const pagesStranger: pagesObj[] = [{name: 'Заявка', href: '/join'}];
const pagesNotUser: pagesObj[] = [{name: 'Вход', href: '/login'}, {name: 'Регистрация', href: '/register'}];
const settingsUsers = ['Профиль', 'Кошелек', 'Настройки', 'Выход'];
const settingsForCitizen = ['Профиль', 'Выход'];

export default function TopMenu() {
    const { user, logout } = useAuth();
    const [ openCard, setOpenCard ] = React.useState<boolean>(false);
    const [ openSettings, setOpenSettings ] = React.useState<boolean>(false);
    const [ anchorElMenu, setAnchorElMenu ] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [settings, setSettings] = useState<string[]>(settingsForCitizen);
    const [pages, setPages] = useState<pagesObj[]>(pagesPeasant);
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    
    const openMenu = Boolean(anchorElMenu);

    useEffect(()=>{

        if (!!user&&(user.role!==Roles.Citizen && user.role!==Roles.Stranger)) setSettings(settingsUsers);

        if (!!user && (user.role===Roles.Lord)) setPages(pagesLord);
        else if (!!user?.email && (user.role===Roles.Treasurer)) setPages(pagesTreasurer);
        else if (!!user?.email && (user.role===Roles.Secretary)) setPages(pagesSecretary);
        else if (!!user?.email && (user.role===Roles.Stranger)) setPages(pagesStranger);
        else if (!user?.email) setPages(pagesNotUser);

        const handleResize = (event: any) => {
            if (event.target.innerWidth!==null) {
                setWidth(event.target.innerWidth);
                console.log(event.target.innerWidth)
            }
        };

        window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
    }, [])

    useEffect(()=>{
        if (!!user&&(user.role!==Roles.Citizen && user.role!==Roles.Stranger)) setSettings(settingsUsers);
        if (!!user && (user.role===Roles.Lord)) setPages(pagesLord);
        else if (!!user?.email && (user.role===Roles.Treasurer)) setPages(pagesTreasurer);
        else if (!!user?.email && (user.role===Roles.Secretary)) setPages(pagesSecretary);
        else if (!!user?.email && (user.role===Roles.Stranger)) setPages(pagesStranger);
        else if (!user?.email) setPages(pagesNotUser);
    }, [user])
    
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const userMenuItem = (val: string) => {
        console.log(val);
        setAnchorElUser(null);
        if (val==='Профиль') setOpenCard(true)
        else if (val==='Выход') logout()
        else if (val==='Настройки') setOpenSettings(true);
    };

    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
            <Toolbar sx={{ flexWrap: "nowrap", justifyContent: 'space-between' }}>
                {width>500 ? <React.Fragment>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        <LinkUi href="/">Золотые леса</LinkUi>
                    </Typography>                
                    {/*<Button variant="text" sx={{ flexGrow: 1 }} onClick={()=>setOpenCard(true)}>{user?.email||user?.firstName}</Button>*/}
                    {user?.gold ? <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        {`Кошелек: ${user.gold}`}
                    </Typography>: null}
                    {user?.role === Roles.Citizen ? <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Ваша заявка рассматривается
                    </Typography>: null}
                    <Box>
                        {!user?.email ? (
                            <React.Fragment>
                                <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                                    <LinkUi href="/login">Вход</LinkUi>
                                </Button>

                                <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                                    <LinkUi href="/register">Регистрация</LinkUi>
                                </Button>
                            </React.Fragment>
                        ) : null}

                        {!!user && (
                            <>
                                {Object.values(PagesConfig).map(({ url, role, name }: any, i) => {
                                    return role && (( role.includes(user.role))||((user.role === Roles.Lord)&&(url !== Paths.Join))) ?
                                        <Button key={i} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                                            <LinkUi href={url}>{name}</LinkUi>
                                        </Button> : null
                                })}
                            </>
                        )}

                    </Box>
                </React.Fragment> :
                <React.Fragment>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }} 
                        onClick={handleClickMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        <LinkUi href="/">Золотые леса</LinkUi>
                    </Typography>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorElMenu}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        {pages.map((page: pagesObj)=>{
                            return (<MenuItem key={page.name}><LinkUi href={page.href}>{page.name}</LinkUi></MenuItem>)
                        })}
                    </Menu>
                </React.Fragment>}
                {(!!user?.email) && <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={(user.firstName+' '+user.lastName).toLocaleUpperCase()}>
                                {user?.avatar ? '' : (String(user.firstName ? user.firstName[0] : 'ъ')+String(user.lastName ? user.lastName[0] : 'Ъ')).toLocaleUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                        {settings.map((setting: string) => (
                            <MenuItem key={setting} onClick={()=>userMenuItem(setting)}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>}
            </Toolbar>            
            {openCard&&<UsersCard setVisible={setOpenCard} />}
            {openSettings&&<Settings setVisible={setOpenSettings} />}
        </AppBar>
    )
}
