import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import Fade from '@mui/material/Fade';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';

import '../styles/imageV.css';

export default function ImageFullList({data, setAddr}: {data: string[], setAddr: ({addrArray, startPosition}: {addrArray: string[], startPosition: number})=>void}) {

    const [ width, setWidth ] = useState<number>(window.innerWidth);

    useEffect(()=>{
        const track = document.getElementById("image-track");

        const handleOnDown = (e: any) => track !== null ? track.dataset.mouseDownAt = e.clientX : null;

        const handleOnUp = () => {
            if (track !== null) {
                track.dataset.mouseDownAt = "0";  
                track.dataset.prevPercentage = track.dataset.percentage;
            }
        }

        const handleOnMove = (e: any) => {
            if((track)&&(track.dataset.mouseDownAt === "0")) return;
            
            const mouseDelta = track !== null ? (parseFloat(track.dataset.mouseDownAt||'') - e.clientX) : 0,
                    maxDelta = window.innerWidth / 2;
            
            const percentage = (mouseDelta / maxDelta) * -100,
                    nextPercentageUnconstrained = parseFloat(track ? track.dataset.prevPercentage||'0' : '0') + percentage,
                    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100)||0;
            
            if (track) track.dataset.percentage = String(nextPercentage||0);
            
            if (track) track.animate({
                transform: `translate(${nextPercentage}%, -50%)`
            }, { duration: 1200, fill: "forwards" });
            let imgCollection = track?track.getElementsByClassName("image"):[];
            if (track) for(const image of imgCollection) {
                image.animate({
                objectPosition: `${100 + nextPercentage}% center`
                }, { duration: 1200, fill: "forwards" });
            }
        }

        window.onmousedown = e => handleOnDown(e);
        window.ontouchstart = e => handleOnDown(e.touches[0]);
        window.onmouseup = e => handleOnUp();
        window.ontouchend = e => handleOnUp();
        window.onmousemove = e => handleOnMove(e);
        window.ontouchmove = e => handleOnMove(e.touches[0]);        
            
        const handleResize = (event: any) => {
            setWidth(event.target.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [])

    return (
        <Box>
            {width>1000?<Box id="image-track" sx={{overflow: 'hidden'}}>
                {data.map((itemPict, index) => (
                    <Fade in={true} timeout={index*500} key={itemPict}><ImageListItem >
                    <img
                        className="image"
                        srcSet={itemPict}
                        src={itemPict}
                        loading="lazy"
                        style={{width: '280px', height: '210px', margin: '2px'}}
                        onClick={()=>setAddr({addrArray: data, startPosition: index})}
                    />
                    </ImageListItem></Fade>
                ))}
            </Box>:
            <ImageList sx={{ width: '100vw', height: 450 }} cols={3} rowHeight={164}>
                {data.map((item, index) => (
                    <ImageListItem key={item}>
                        <img
                            srcSet={item}
                            src={item}
                            alt={item}
                            loading="lazy"
                            onClick={()=>setAddr({addrArray: data, startPosition: index})}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            }
        </Box>
    )
}