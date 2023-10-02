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

export default function EventsPage () {
    const { setVisible } = useLoading();
    const [ newEventListOpen, setNewEventListOpen ] = useState<boolean>(false);
    const [eventsList, setEventsList] = useState<Event[]>([]);
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
            <Box sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly'
            }}>
                {newEventListOpen&&<AddNewEventList setOpen={setNewEventListOpen} />}
                {eventsList.length>0 ? eventsList.map((evnt: Event)=>{
                    return(
                        <Card sx={{ maxWidth: 345, width: '300px', backgroundColor: 'beige', padding: 1 }} key={evnt.id}>
                        <CardActionArea onClick={()=>console.log()}>
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
                        <CardActions>
                            <Button size="small" color="primary">
                                Открыть
                            </Button>
                        </CardActions>
                    </Card>)
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
            </Box>
        </Fade>
    )
}