import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import Fade from '@mui/material/Fade';

export interface ImgWieverType {addr?: string, addrArray?: string[], startPosition?: number}

export function ImgWiever ({props, src}: {props?:ImgWieverType, src?: string}) {
    const {addr, addrArray, startPosition = 0}: ImgWieverType = props||{addr: src||'', addrArray: undefined};
    const [open, setOpen] = useState<boolean>(false);
    const [anim, setAnim] = useState<boolean>(false);
    const [pict, setPict] = useState<string[]>(addrArray||[addr||'']);
    const [pos, setPos] = useState<number>(startPosition);
    const [width, setWidth] = useState<number>();
    const trig = useRef<boolean>(true);
    const posCurr = useRef<number>(startPosition);
    const pictCurr = useRef<number>(pict.length);

    

    useEffect(()=>{
        if (trig.current) {
            trig.current = false;
            posCurr.current = pos;

            const onKeyUp = (key: KeyboardEvent) => {
                console.log(posCurr.current);
                console.log(key.code);
                if (key.code==='ArrowLeft') setPos(posCurr.current<=0?0:posCurr.current-1);
                else if (key.code === 'ArrowRight') setPos(posCurr.current>=pictCurr.current-1?pictCurr.current-1:posCurr.current+1);
                else if (key.code === 'Escape') setAnim(false);

            }

            document.addEventListener('keyup', onKeyUp);

            const handleResize = (event: any) => {
                if (event.target.innerWidth!==null) {
                    setWidth(event.target.innerWidth);
                    console.log(event.target.innerWidth)
                }
            };
    
            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('keyup', onKeyUp);
            };
        }
    }, [])

    useEffect(()=>{
        console.log(posCurr)
        posCurr.current = pos;
    }, [pos])

    useEffect(()=>{
        console.log(posCurr)
        pictCurr.current = pict.length;
    }, [pict])

    useEffect(()=>{
        if (!anim) setTimeout(setOpen, 500, {anim: false, total: false}) 
        else setOpen(true);
    }, [anim])

    useEffect(()=>{
        console.log(addr);
        if ((addr && (addr!==''))||(addrArray && addrArray.length!==0)) {
            setPict(addrArray||[addr||'']);
            setPos(startPosition);
            setAnim(true)
        }
    }, [props, src])

    const cssforDownBar = {maxHeight: '10vh', maxWidth: '10vw', margin: '0 16px', padding: 8};

    return (
        <Box>
            {open&&<Fade in={anim}>
                <Box sx={{position: 'fixed', width: '100%', height: '100%', top: 0, left: 0, zIndex: 10010, display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
                    <Box 
                        sx={{position: 'fixed', width: '100%', height: '100%', top: 0, left: 0, zIndex: 10011, opacity: 0.85, backgroundColor: 'black'}}
                        onClick={()=>{setAnim(false)}}
                    />
                    <Box sx={{zIndex: 10012, maxHeight: '90%', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height:'100%'}}>
                        <Box sx={{height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <img srcSet={pict[pos]} src={pict[pos]} style={{maxHeight: pict.length>1?'70vh':'90vh', maxWidth: pict.length>1?'70vw':'90vw'}} />
                        </Box>
                        {pict.length>1&&<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 2, height: '12vh'}}>
                            {pict.map((src: string, index: number)=>{
                                return(
                                    <img 
                                        srcSet={src} 
                                        src={src} 
                                        style={index!==pos?cssforDownBar:{...cssforDownBar, backgroundColor: 'black', boxShadow: '0 0 25px black', borderRadius: '5px'}} 
                                        key={src} 
                                        id='imgHover'
                                        onClick={()=>setPos(index)} 
                                    />
                                )
                            })}
                        </Box>}
                    </Box>
                </Box>
            </Fade>}
        </Box>
    )
}