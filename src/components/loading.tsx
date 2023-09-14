import React from 'react';
import Box from '@mui/material/Box';
import { useLoading } from 'hooks/useLoading';
import '../styles/loading.css';
import Fade from '@mui/material/Fade';

export default function Loading({visible}: {visible: boolean | null}) {
    console.log(visible);
    let sVisible = visible===null ? false : visible
    const [ open, setOpen ] = React.useState<boolean>(sVisible);
    React.useEffect(()=>{
        console.log('visible: ' + sVisible)
        if (sVisible) setOpen(sVisible)
        else setTimeout(() => {
            setOpen(false);
        }, 1000);
    }, [visible])

    return (
        <Fade in={open}>
            <Box>
                {open&&<Box id={sVisible?'loadingPanelON':'loadingPanelOFF'} >
                    <Box id={'backgroundList'} />
                    <img id={'img1'} src={'https://gf.spamigor.ru/loading/deer.gif'} />    
                    <img id={'img2'} src={'https://gf.spamigor.ru/loading/border.PNG'} />    
                </Box>}
            </Box>
        </Fade>
    )
}