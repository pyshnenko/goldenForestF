import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import Fade from '@mui/material/Fade';

export default function ImgWiever ({addr}: {addr: string}) {
    const [open, setOpen] = useState<boolean>(false);
    const [anim, setAnim] = useState<boolean>(false);

    useEffect(()=>{
        if (!anim) setTimeout(setOpen, 500, {anim: false, total: false}) 
        else setOpen(true);
    }, [anim])

    useEffect(()=>{
        console.log(addr);
        if (addr && (addr!=='')) setAnim(true)
    }, [addr])

    return (
        <Box>
            {open&&<Fade in={anim}>
                <Box sx={{position: 'fixed', width: '100%', height: '100%', top: 0, left: 0, zIndex: 10010, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Box 
                        sx={{position: 'fixed', width: '100%', height: '100%', top: 0, left: 0, zIndex: 10011, opacity: 0.85, backgroundColor: 'black'}}
                        onClick={()=>{setAnim(false)}}
                    />
                    <img src={addr} style={{zIndex: 10012, maxHeight: '90%', maxWidth: '90%'}} />
                </Box>
            </Fade>}
        </Box>
    )
}