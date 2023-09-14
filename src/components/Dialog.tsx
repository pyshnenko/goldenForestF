import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface resultDialogType {
    ready: boolean,
    valStr: string,
    valBool: boolean,
    marker?: string
}

interface inpData {
    open: boolean, 
    setOpen: (val: boolean)=>void,
    text: {title: string, body: string}, 
    result: ({ready, valStr, valBool, marker}: resultDialogType)=>void, 
    changes?: {name: string, value: string}[],
    marker?: string,
    ynMode?: boolean
}

export function DialogW({open, setOpen, text, result, changes, marker, ynMode}: inpData) {
    
    const [ checksVariant, setChecksVariant ] = React.useState<string>(changes ? changes[0].value : '');

    const handleClose = (res: boolean) => {
        setOpen(false);
        result({ready: true, valBool: res, valStr: checksVariant, marker: marker || 'nop'})
    };

    return (
        <div>
            <Dialog open={open} onClose={()=>handleClose(false)}>
                <DialogTitle>{text.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{text.body}</DialogContentText>
                    {!changes ? !ynMode&&<TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={checksVariant}
                        onChange={((event: React.ChangeEvent<HTMLInputElement>)=>setChecksVariant(event.target.value))}
                    /> : <Select
                        sx={{ margin: 1, height: '50px' }}
                        value={checksVariant}
                        onChange={(event: SelectChangeEvent)=>setChecksVariant(event.target.value)}
                    >
                        {changes.map((item: {name: string, value: string})=>{
                            return (
                                <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                            )
                        })}
                    </Select>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>handleClose(false)}>Назад</Button>
                    <Button onClick={()=>handleClose(true)}>Принять</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}