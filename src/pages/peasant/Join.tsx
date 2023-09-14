import React, { useState, useRef } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import {Roles} from 'types/Enums';
import { NullableUser} from "types/User";

import { useAuth } from 'hooks/useAuth';

import Api from 'helpers/Api';

export default function Join(args: any) {
  const { user, login } = useAuth();

  const [isSend, setIsSend] = useState(false);
  const [ checked, setChecked ] = useState<{nickname: boolean | null, phone: boolean | null}>({nickname: null, phone: null})
  const [ error, setError ] = useState(
    {
      nickname: false,
      first_name: false,
      last_name: false,
      surname: false,
      phone: false,
      vk: false,
      telegram: false,
      about: false,
      allergy: false,
      emergency_contact: false,
    }
  )

  let timerNick = useRef<NodeJS.Timeout | null>(null);
  let timerPhone = useRef<NodeJS.Timeout | null>(null);

  const checkNick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({...checked, nickname: null})
    console.log(timerNick.current)
    if (timerNick.current !== null) {
      clearTimeout(timerNick.current);
      timerNick.current = null;
    }
    timerNick.current = setTimeout(async () => {
      try {
        let res = await Api.checkData({nickname: event.target.value})
        console.log(res)
        setChecked({...checked, nickname: true})
      }
      catch(e: any) {
        if ((e)&&(e.response.status===402)) setChecked({...checked, nickname: false})
      }
    }, 2000);
  }

  const checkPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({...checked, phone: null})
    if (timerPhone.current !== null) {
      clearTimeout(timerPhone.current);
      timerPhone.current = null;
    }
    timerPhone.current = setTimeout(async () => {
      try {
        let res = await Api.checkData({phone: event.target.value})
        console.log(res)
        setChecked({...checked, phone: true})
      }
      catch(e: any) {
        if ((e)&&(e.response.status===402)) setChecked({...checked, phone: false})
      }
    }, 2000);
  }

  const [birthDate, setBirthDate] = React.useState<Dayjs | null>(
    dayjs('1990-12-01T00:00:00'),
  );

  const changeBirthDate = (newValue: Dayjs | null) => {
    setBirthDate(newValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const data: any = {
      nickname: form.get('nickname'),
      first_name: form.get('firstName'),
      last_name: form.get('lastName'),
      surname: form.get('surname'),
      phone: form.get('phone'),
      email: user?.email,
      birth_date: birthDate,
      vk: form.get('vk'),
      telegram: form.get('telegram'),
      about: form.get('about'),
      allergy: form.get('allergy'),
      emergency_contact: form.get('emergency_contact'),
    }
    let ready: boolean = true;
    Object.keys(data).map((item: string)=>{
      if(data[item]==='') {
        let buf: any = error;
        buf[item] = true;
        setError({...buf}); 
        ready = false
    }})
    console.log(error)

    if (ready) {
      await Api.join(data, user);
      setIsSend(true);
      login({...user, role: Roles.Citizen} as NullableUser)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {!isSend && (<Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Заявка на вступление в клуб
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={error.nickname}
                  required
                  fullWidth
                  id="nickname"
                  label="Ник"
                  name="nickname"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {checked.nickname ? <CheckIcon sx={{ color: 'green' }} /> : checked.nickname === false ? <CloseIcon sx={{ color: 'red' }} /> : null}
                      </InputAdornment>
                    ),
                  }}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>)=>checkNick(evt)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={error.first_name}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Имя"
                  defaultValue={user?.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={error.last_name}
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue={user?.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.surname}
                  required
                  fullWidth
                  id="surname"
                  label="Отчество"
                  name="surname"
                  autoComplete="futher-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.phone}
                  required
                  fullWidth
                  id="phone"
                  label="Телефон"
                  name="phone"
                  autoComplete="phone"
                  type="tel"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {checked.phone ? <CheckIcon sx={{ color: 'green' }} /> : checked.phone === false ? <CloseIcon sx={{ color: 'red' }} /> : null}
                      </InputAdornment>
                    ),
                  }}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>)=>checkPhone(evt)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={user?.email}
                  disabled={true}
                  type='email'
                />
              </Grid>
              <Grid item xs={12}>
                <MobileDatePicker
                  label="Дата Рождения"
                  inputFormat="DD/MM/YYYY"
                  value={birthDate}
                  onChange={changeBirthDate}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.telegram}
                  required
                  fullWidth
                  id="telegram"
                  label="Telegram"
                  name="telegram"
                  autoComplete="telegram"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.vk}
                  required
                  fullWidth
                  id="vk"
                  label="Ссылка на профиль Vk"
                  name="vk"
                  autoComplete="vk"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.about}
                  required
                  multiline
                  fullWidth
                  id="about"
                  label="О себе"
                  name="about"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.allergy}
                  defaultValue={'Отсутствуют'}
                  required
                  multiline
                  fullWidth
                  id="allergy"
                  label="Аллергии"
                  name="allergy"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={error.emergency_contact}
                  required
                  multiline
                  fullWidth
                  id="emergency_contact"
                  label="Экстренный контакт"
                  name="emergency_contact"
                  type="tel"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Подать заявку
            </Button>
          </Box>
        </Box>)}

        {isSend && (
          <Typography>
            Заявка принята к рассмотрению
          </Typography>
        )}

      </Container>
    </LocalizationProvider>
  )
}
