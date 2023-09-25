import { useEffect, useState, useRef, useMemo } from 'react';
import 'dayjs/locale/ru';
import Box from '@mui/material/Box';

import MoneyTable from 'components/tables/moneyTables';

interface rowsData {
    login: string,
    value: number,
    date: number,
    veryfi: string,
    way?: string
}

export default function Treasury (args: any) {

    const [ table, settable ] = useState<{id: number, data: {var: string, ready: boolean}[]}>({id: 0, data:[]});
    const trig = useRef(true);

    useEffect(()=>{
        if (trig.current){
            trig.current = false;
            settable({id: 1, data: [{var: 'gold', ready: true}, {var: 'treasure', ready: false}]});
        }
    }, [])

    useEffect(()=>{
        console.log(table)
    }, [table])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
        }}>
            {Array.isArray(table.data)&&table.data.map((item: {var: string, ready: boolean}, index: number)=>{
                console.log(item);
                return <Box key={item.var}>
                    {item.ready&&<MoneyTable variant={item.var} setReadyBack={settable} table={table} index={index} />}
                </Box>
            })}
        </Box>        
    );
}