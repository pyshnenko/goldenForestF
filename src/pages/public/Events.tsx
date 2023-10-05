import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import { useLoading } from 'hooks/useLoading';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { Button, CardActionArea, CardActions, Fab } from '@mui/material';
import Api from 'helpers/Api';
import { useAuth } from 'hooks/useAuth';
import AddNewEventList from 'components/addNewEventsList';
import { Event } from "../../types/Requests";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {ImgWiever, ImgWieverType} from '../../components/pictureWievew';
const myHref = 'https://gf.spamigor.ru/events'

export default function EventsPage () {
    const { setVisible } = useLoading();
    const [ newEventListOpen, setNewEventListOpen ] = useState<boolean>(false);
    const [eventsList, setEventsList] = useState<Event[]>([]);
    const [cardOpen, setCardOpen] = useState<boolean>(true);
    const [mode, setMode] = useState<number>(-1);
    const [addr, setAddr] = useState<ImgWieverType>({addr: ''});
    const trig = useRef<boolean>(true);  
    const { user } = useAuth();

    useEffect(()=>{
        if (trig.current) {
            trig.current = false;
            setVisible(true);
            const res = Api.eventsList(user);
            res.then((result)=>{
                console.log(result);
                setEventsList(result.data);
            })
            res.catch((e: any)=>console.log(e))
            res.finally(()=>setVisible(false))
        }
    }, [])

    return (
        <Fade in={true}>
            <Box>
            <ImgWiever props={addr} />
                {mode===-1?<Box sx={{
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly'
                }}>
                    {newEventListOpen&&<AddNewEventList setOpen={setNewEventListOpen} />}
                    {eventsList.length>0 ? eventsList.map((evnt: Event, index: number)=>{
                        return(
                            <Fade in={cardOpen} timeout={index*500}><Card sx={{ maxWidth: 345, width: '300px', backgroundColor: 'beige', padding: 1, margin: 1 }} key={evnt.id}>
                            <CardActionArea onClick={()=>{
                                let uri = myHref + '?' + `evntId=${evnt.id}&event=${evnt.name}`
                                console.log(uri);
                                setCardOpen(false);
                                setTimeout(setMode, 1000, evnt.id);
                            }}>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={evnt.pict[0] || ''}
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {evnt.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {evnt.text}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card></Fade>)
                    }): null}
                    {(user?.role==="Secretary"||user?.role==="Lord")&&
                        <Fab 
                            color="primary" 
                            sx={{position: 'absolute', bottom: 16, right: 16,}}
                            onClick={()=>setNewEventListOpen(true)}
                        >
                            <AddIcon />
                        </Fab>
                    }
                </Box>:
                <Fade in={mode!==-1}><Box>
                    {eventsList.length>0&&eventsList.map((item: Event, index: number)=>{
                        return (
                            <Box>
                                {item.id===mode?<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Typography>{item.name} ({item.type})</Typography>   
                                    <Box>              
                                        <Typography>Дата: {(new Date(Number(item.date))).toLocaleDateString()}</Typography>                          
                                        <Typography>Автор: {item.orginizer.map((item: string)=>item+' ')}</Typography>
                                        <Typography>Необходимая сумма на организацию: {item.gold}</Typography>
                                        <Typography>Собрано на данный момент: {item.nowGold}</Typography>
                                        <Typography>{item.fulltext}</Typography>
                                    </Box>
                                    {item.pict.length!==0 && <ImageList cols={Math.floor(window.innerWidth/300)} rowHeight={210}>
                                    {item.pict.map((itemPict, index) => (
                                        <Fade in={true} timeout={index*500}><ImageListItem key={'img '+ index}>
                                        <img
                                            srcSet={itemPict}
                                            src={itemPict}
                                            loading="lazy"
                                            style={{maxWidth: '280px', maxHeight: '210px'}}
                                            onClick={()=>{
                                                console.log(itemPict);
                                                setAddr({addrArray: item.pict, startPosition: index})
                                            }}
                                        />
                                        </ImageListItem></Fade>
                                    ))}
                                </ImageList>} 
                                <Box>
                                    <Typography>Участие подтвердили: {item.activeMembers.map((item:string)=>{return `${item}, `})}</Typography>
                                </Box>        
                                </Box>:null}
                            </Box>
                        )
                    })}
                </Box></Fade>}
            </Box>
        </Fade>
    )
}