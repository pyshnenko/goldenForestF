import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
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
import ImageFullList from 'components/imageFullList';
import { Event } from "../../types/Requests";
import {ImgWiever, ImgWieverType} from '../../components/pictureWievew';

export default function EventsPage ({id}:{id: number}) {
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
            res.then((result: {data: Event[]})=>{
                console.log(result);
                console.log(id);
                setEventsList(result.data);
                for(let i=0; i<result.data.length; i++) {
                    if (Number(result.data[i].id)===id) {
                        setMode(id);
                        break;
                    }
                }
            })
            res.catch((e: any)=>console.log(e))
            res.finally(()=>setVisible(false))
        }
    }, [])

    useEffect(()=>{
        console.log(id);
        for(let i=0; i<eventsList.length; i++) {
            if (Number(eventsList[i].id)===id) {
                setMode(id);
                break;
            }
        }
    }, [id])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('сщшт')
        event.preventDefault();
    }

    return (
        <Fade in={true} key={'hello'}>
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
                            <Fade in={cardOpen} timeout={index*500} key={evnt.id}><Card sx={{ maxWidth: 345, width: '300px', backgroundColor: 'beige', padding: 1, margin: 1 }}>
                            <CardActionArea onClick={()=>{
                                let uri = window.location.href + `?id=${evnt.id}&evName=${evnt.name}`
                                console.log(uri);
                                setCardOpen(false);
                                setTimeout((addr: string)=>window.location.href=addr, 1000, uri);
                            }}>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={evnt.pict[0] || ''}
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
                            sx={{position: 'fixed', bottom: 16, right: 16,}}
                            onClick={()=>setNewEventListOpen(true)}
                        >
                            <AddIcon />
                        </Fab>
                    }
                </Box>:
                <Fade in={mode!==-1}><Box>
                    {eventsList.length>0&&eventsList.map((item: Event, index: number)=>{
                        return (
                            <Box key={index}>
                                {item.id===mode?<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Box sx={{paddingLeft: 4, position: 'absolute', left: 0, top: '77px'}}>                                    
                                        <Typography>Автор: {item.orginizer.map((item: string)=>item+' ')}</Typography>
                                    </Box>
                                    <Box sx={{paddingRight: 4, position: 'absolute', right: 0, top: '77px'}}>           
                                        <Typography>Дата: {(new Date(Number(item.date))).toLocaleDateString()}</Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{margin: 4, marginTop: 8}}>{item.name} ({item.type})</Typography>
                                    <Box sx={{display: 'flex', flexDirection: 'row'}}>  
                                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: 4}}>
                                            <Typography>Нужно: {item.gold}</Typography>
                                            <Typography>Собрано: {item.nowGold}</Typography>
                                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{
                                                display: 'grid', 
                                                justifyItems: 'center',
                                                margin: '8px',
                                                padding: '16px',
                                                backgroundColor: 'cornsilk',
                                                width: '200px',
                                                borderRadius: '30px',
                                                boxShadow: '0 0 10px cornflowerblue'
                                            }}>
                                                <TextField defaultValue={0} sx={{width: '150px'}} size="small" name="money" type='number' variant="filled" />
                                                <Button type="submit" variant="contained">Перевести</Button>
                                            </Box> 
                                        </Box>
                                        <Box>
                                            <Typography>Участие подтвердили: {item.activeMembers.map((item:string)=>{return `${item}, `})}</Typography>
                                            {!item.activeMembers.includes(user?.login||'')&&<Button variant="contained">Буду участвовать!</Button>}
                                        </Box>
                                    </Box>
                                    <Typography>{item.fulltext}</Typography>
                                <Box>
                                </Box>        
                                {item.pict.length!==0 && <ImageFullList data={item.pict} setAddr={setAddr} />} 
                                </Box>:null}
                            </Box>
                        )
                    })}
                </Box></Fade>}
            </Box>
        </Fade>
    )
}