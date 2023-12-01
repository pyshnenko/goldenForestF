import { useEffect, useState, useRef, useMemo } from 'react';
import 'dayjs/locale/ru';
import Box from '@mui/material/Box';
import Api from 'helpers/Api';
import { useAuth } from 'hooks/useAuth';

import MoneyTable from 'components/tables/moneyTables';

interface rowsData {
    login: string,
    value: number,
    date: number,
    veryfi: string,
    way?: string
}

export default function Treasury (args: any) {

    const [ table, settable ] = useState<{id: number, data: {var: string, ready: boolean, id?: number|string, name?: string}[]}>({id: 0, data:[]});
    const trig = useRef(true);
    const { user, userFull } = useAuth();

    useEffect(()=>{
        if (trig.current){
            trig.current = false;
            let evListProm = Api.eventsList(user);
            evListProm.then((res: any)=>{
                let arr: {var: string, ready: boolean, id?: number|string, name?: string}[] = [];
                arr.push({var: 'gold', ready: true});
                arr.push({var: 'treasure', ready: false});
                if (Array.isArray(res.data)&&res.data.length>0) res.data.map((item: {name: string, id: number|string, date: number})=>
                    arr.push({var: 'event', ready: false, id: item.id, name: `${item.name} - ${(new Date(item.date).toLocaleDateString())}`}));
                settable({id: 1, data: arr});
                console.log(res.data);
            })
            evListProm.catch((e: any)=>{
                console.log(e);
                settable({id: 1, data: [{var: 'gold', ready: true}, {var: 'treasure', ready: false}]});
            })
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
            {Array.isArray(table.data)&&table.data.map((item: {var: string, ready: boolean, id?: number|string, name?: string}, index: number)=>{
                return <Box key={`item.var - ${index}`}>
                    {item.ready&&<MoneyTable variant={item.var} setReadyBack={settable} table={table} index={index} id={item?.id||0} tname={item?.name||'no name'} />}
                </Box>
            })}
        </Box>        
    );
}