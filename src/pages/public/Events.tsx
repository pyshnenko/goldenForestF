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

export default function EventsPage () {
    const { setVisible } = useLoading();
    const [ newEventListOpen, setNewEventListOpen ] = useState<boolean>(false);
    const trig = useRef<boolean>(true);  
    const { user } = useAuth();

    useEffect(()=>{
        if (trig.current) {
            trig.current = false;
            setVisible(true);
            const res = Api.eventsList(user);
            res.then((result)=>{
                console.log(result);
            })
            res.catch((e: any)=>console.log(e))
            res.finally(()=>setVisible(false))
        }
    }, [])

    return (
        <Fade in={true}>
            <Box>
                {newEventListOpen&&<AddNewEventList setOpen={setNewEventListOpen} />}
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea onClick={()=>console.log()}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/static/images/cards/contemplative-reptile.jpg"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            Share
                        </Button>
                    </CardActions>
                </Card>
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