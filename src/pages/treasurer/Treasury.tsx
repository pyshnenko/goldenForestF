import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { useAuth } from 'hooks/useAuth';
import Fade from '@mui/material/Fade';
import Api from 'helpers/Api';
import Typography from '@mui/material/Typography';

export default function Treasury (args: any) {
    const [ total, setTotal ] = useState<number>(0);
    const { user, userFull } = useAuth();
    const trig = useRef<boolean>(true);

    useEffect(()=>{
        if (trig.current){
            trig.current = false;
            const res = Api.checkTotalMoney(user);
            res.then((result)=>{
                console.log(result.data.res.data);
                setTotal(result.data.res.data.total)
            })
        }
    },[])

    return (
        <Fade in={true}>
            <Box sx={{    
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                alignItems: 'center'}}
            >
                <Box>
                    <Typography>Денежек у нас {total}</Typography>
                </Box>
            </Box>
        </Fade>
    );
}