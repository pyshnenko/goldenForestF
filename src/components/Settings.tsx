import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { useAuth } from 'hooks/useAuth';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

const flexPars = {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
}

const boxStyle = {
    ...flexPars,
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9
}

interface savedData {
    font: string
}

export default function Settings ({setVisible}: {setVisible:(val: boolean) => void}) {

    const [ fadeIn, setFadeIn ] = useState<boolean>(true);
    const [age, setAge] = useState('sans-serif');
    const [ saveSettings, setSaveSettings ] = useState<savedData>();
    const { user, userFull } = useAuth();
    const trig = useRef<boolean>(true);

    useEffect(()=>{
        if (trig.current) {
            trig.current = false;
            const saveSettingsString: string | null = localStorage.getItem('gfLocalSettings');
            if (saveSettingsString !== '') {
                setSaveSettings(JSON.parse(String(saveSettingsString)));
            }
        }
    }, [])

    useEffect(()=>{        
        setAge(saveSettings?.font || 'sans-serif');
    }, [saveSettings])
  
    const handleChange = (event: SelectChangeEvent) => {
        setSaveSettings({...saveSettings, font: event.target.value});
    };

    const close = () => {
        setFadeIn(false);
        setTimeout(setVisible, 500, false)
    }

    return (
        <Fade in={fadeIn}>
            <Box sx={boxStyle}>
                <Box sx={{
                        ...boxStyle, 
                        backgroundColor: 'white',
                        opacity: 0.85,
                        zIndex: 10
                    }} 
                    onClick={close}
                />
                <Box sx={{
                    ...flexPars,
                    backgroundColor: 'honeydew',
                    zIndex: 11,
                    borderRadius: '20px',
                    boxShadow: '0 0 20px honeydew'
                }}>
                    <Box sx={{
                        ...flexPars,
                        width: '80%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Typography>Шрифт</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                value={age}
                                onChange={handleChange}
                            >
                                <MenuItem value={'sans-serif'} sx={{fontFamily: 'sans-serif'}}>Базовый</MenuItem>
                                <MenuItem value={'Gotish'} sx={{fontFamily: 'Gotish'}}>Готика</MenuItem>
                                <MenuItem value={'Izbushka'} sx={{fontFamily: 'Izbushka'}}>Избушка</MenuItem>
                                <MenuItem value={'BalkaraFreeCondensed'} sx={{fontFamily: 'BalkaraFreeCondensed'}}>Балкара</MenuItem>
                                <MenuItem value={'TriodPostnaja'} sx={{fontFamily: 'TriodPostnaja'}}>Триод</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <Button sx={{margin: 2}} startIcon={<CheckIcon />} size='large' variant="outlined" onClick={()=>{
                                console.log(user);
                                localStorage.setItem('gfLocalSettings', JSON.stringify(saveSettings));
                                location.reload();
                            }}>Сохранить</Button>
                        <Button sx={{margin: 2}} startIcon={<CloseIcon />} size='large' variant="outlined" color='error' onClick={close} >Закрыть</Button>
                    </Box>
                </Box>
            </Box>
        </Fade>
    )
}