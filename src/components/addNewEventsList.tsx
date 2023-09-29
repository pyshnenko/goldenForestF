import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Event } from "../types/Requests";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth } from 'hooks/useAuth';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

interface ErrorInt {date: boolean, gold: boolean, name: boolean, type: boolean, text: boolean, fullText: boolean}

export default function AddNewEventList ({setOpen}: {setOpen: (val: boolean)=>void}) {
    const [fade, setFade] = useState<boolean>(true);
    const [sPage, setSpage] = useState<boolean>(false);
    const [page, setPage] = useState<boolean>(false);
    const [images, setImages] = useState<string[]>([]);
    const [errors, setError] = useState<ErrorInt>(
        {date: false, gold: false, name: false, type: false, text: false, fullText: false}
    )
    const { user } = useAuth();
    let extData: Event;

    useEffect(()=>{
        if (!fade) setTimeout(setOpen, 500, false);
    }, [fade])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!page) {
            const form = new FormData(event.currentTarget);
            const date: number = Number(new Date(String(form.get('date'))));
            const gold: number = Number(form.get('gold'));
            console.log(form.get('date'))
            console.log(date)
            const name: string = String(form.get('name'));
            const type: string = String(form.get('type'));
            const text: string = String(form.get('text'));
            const fulltext: string = String(form.get('fullText'));
            let ready = true;
            const errorsCheck = {date: !date, gold: (!gold||gold===0), name: name==='', type: type==='', text: text==='', fullText: fulltext===''};
            setError(errorsCheck);
            const jbjKeys = Object.entries(errorsCheck);
            console.log(jbjKeys)
            for(let keys in jbjKeys) {
                console.log(keys);
                if (jbjKeys[keys][1]) {ready = false; break}
            }
            if (ready) {
                extData = {
                    name, date, gold, type, text, fulltext, pict: [], orginizer: [user ? user.login : ''], activeMembers: []
                }
                setPage(true);
                setTimeout(setSpage, 500, true)
            }
        }
    }

    const attFile = async () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async (e: any) => {
            let files = e.target.files;
            console.log(files)
            for (let i = 0; i<files.length; i++) {
                let data = new FormData();
                data.append('file', files[i]);
                const options = {
                    method: 'POST',
                    headers: {
                        folder: encodeURI('test'),
                        fname: encodeURI('test')
                    },
                    body: data,
                }                
                const response = await fetch('https://gf.spamigor.ru/apiUpload', options);
                const res = await response.json();
                console.log(res);
            }
        }
        
        input.click();

    }

    return (
        <Fade in={fade}>
            <Box 
                sx={{
                    position: 'fixed', 
                    top: 0, left: 0, 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    zIndex: 9997, 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                }}
            >
                <Box sx={{position: 'fixed', backgroundColor: 'white', opacity: '0.85', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9998 }} onClick={()=>setFade(false)} />
                {!sPage&&<Fade in={!page}>
                    <Box 
                        sx={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            width: '80%', 
                            backgroundColor:'antiquewhite', 
                            padding: 2, 
                            border: '5px solid green', 
                            borderRadius:5, 
                            zIndex: 9999
                        }}
                        component="form" 
                        noValidate 
                        onSubmit={handleSubmit}
                    >
                        <TextField sx={{margin: 1}} id="standard-basic" label="Название" variant="standard" name="name" error={errors.name} />
                        <TextField id="standard-basic" variant="standard" name="date" type="date" error={errors.date} /> 
                        <TextField sx={{margin: 1}} id="standard-basic" label="Стоимость" variant="standard" name="gold" type="number" error={errors.gold} /> 
                        <TextField id="standard-basic" label="Категория" variant="standard" name="type" error={errors.type} />                  
                        <TextField label="Краткое описание" variant="outlined" name="text" multiline rows={4} sx={{width: '80%', minWidth: '320px', margin: 1}} error={errors.text} />
                        <TextField label="Полное описание" variant="outlined" name="fullText" multiline rows={7} sx={{width: '80%', minWidth: '320px'}} error={errors.fullText} />
                        <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '80%', margin: 1}}>
                            <IconButton color="error" onClick={()=>setFade(false)}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton color={"primary"} type="submit">
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Fade>}
                {sPage&&<Fade in={page} timeout={1000}>
                    <Box
                        sx={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            width: '80%', 
                            backgroundColor:'antiquewhite', 
                            padding: 2, 
                            border: '5px solid green', 
                            borderRadius:5, 
                            zIndex: 9999
                        }}
                        component="form" 
                        noValidate 
                        onSubmit={handleSubmit}
                    >
                        <Typography>Добавим изображений</Typography>
                        <Box>
                            {images.length!==0 && <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                {images.map((item, index) => (
                                    <ImageListItem key={'img '+ index}>
                                    <img
                                        srcSet={item}
                                        src={item}
                                        loading="lazy"
                                    />
                                    </ImageListItem>
                                ))}
                            </ImageList>}
                        </Box>
                        <Button onClick={attFile}>Добавить изображение</Button>
                        <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '80%', margin: 1}}>
                            <IconButton color="error" onClick={()=>setFade(false)}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton color={"primary"} type="submit">
                                <CheckIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Fade>}
            </Box>
        </Fade>
    )
}