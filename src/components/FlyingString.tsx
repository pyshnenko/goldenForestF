import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

interface extParams {
    visible: boolean,
    text: string,
    top?: number,
    bottom?: number,
    left?: number,
    right?: number
}

export default function FlyingString ({flyingStringParams, setFlyingStringParams}: {flyingStringParams: extParams, setFlyingStringParams: (val: extParams)=>void}) {

    const [relTop, setRelTop] = useState<number>(flyingStringParams.top||0);
    const [relLeft, setRelLeft] = useState<number>(flyingStringParams.left||0);
    const [relRight, setRelRight] = useState<number>(flyingStringParams.right||0);
    const [relBottom, setRelBottom] = useState<number>(flyingStringParams.bottom||0);
    const [relText, setRelText] = useState<string>(flyingStringParams.text||'');
    const [awaitMode, setAwaitMode] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>((flyingStringParams.top===0||flyingStringParams.bottom===0))

    let timer1: any;
    let timer2: any;

    useEffect(()=>{
        console.log(flyingStringParams)
        if ((flyingStringParams.top===0)&&(flyingStringParams.bottom===0)&&(!awaitMode)) {
            timer1 = setTimeout(setFlyingStringParams, 5000, {...flyingStringParams, visible: false})
            timer2 = setTimeout(setOpen, 4000, false);
        }
        else {
            clearTimeout(timer1);
            clearTimeout(timer2);
        }
    }, [flyingStringParams, awaitMode])

    useEffect(()=>{
        console.log(open)
    }, [open])

    return (
        <Fade in={open} timeout={1000}>
            <Box 
                sx={{
                    position: 'fixed', 
                    top: relTop?`${relTop+2}px`:'auto',
                    left: relLeft?`${relLeft+2}px`:'auto',
                    right: relRight?`${relRight-2}px`:'auto',
                    bottom: relBottom?`${relBottom-2}px`:'auto',
                    padding: 2,
                    backgroundColor: 'white',
                    border: '1px solid green',
                    borderRadius: '15px',
                    boxShadow: '0 0 10px lightgreen'
                }}
                onMouseOver={()=>setAwaitMode(true)}
                onMouseOut={()=>setAwaitMode(false)}
            >
                {relText}
            </Box>
        </Fade>
    )
}