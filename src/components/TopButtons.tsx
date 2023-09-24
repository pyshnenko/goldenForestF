import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import PagesConfig from 'types/Pages';
import LinkUi from "@mui/material/Link";
import {Roles, Paths} from 'types/Enums';

export default function TopButtons({width, user}: {width: number, user: any}) {
    return (
        <Box>
            {!user?.email ? (
                <React.Fragment>
                    <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        <LinkUi href="/login">Вход</LinkUi>
                    </Button>

                    <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        <LinkUi href="/register">Регистрация</LinkUi>
                    </Button>
                </React.Fragment>
            ) : null}

            {!!user && (
                <>
                    <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        <LinkUi href="/events">Мероприятия</LinkUi>
                    </Button>
                    {Object.values(PagesConfig).map(({ url, role, name }: any, i) => {
                        return role && (( role.includes(user.role))||((user.role === Roles.Lord)&&(url !== Paths.Join))) ?
                            <Button key={i} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                                <LinkUi href={url}>{name}</LinkUi>
                            </Button> : null
                    })}
                </>
            )}
        </Box>
    )
}