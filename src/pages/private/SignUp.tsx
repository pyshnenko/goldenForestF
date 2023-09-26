import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { RegisterReqData } from 'types/Requests'
import Api from 'helpers/Api';
import { useAuth } from 'hooks/useAuth';

export default function SignUp() {
  const auth = useAuth();
  const [loginCheck, setLoginCheck] = React.useState<boolean>(false);
  const [emailCheck, setEmailCheck] = React.useState<boolean>(false);
  const [errorState, setErrorState] = React.useState<boolean>(false);
  const [emailTest, setEmailText] = React.useState<string>('Email');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email: string = String(form.get('email'));
    const llogin: string = String(form.get('login'));
    const password: string = String(form.get('password'));
    const firstName: string = String(form.get('firstName'));
    const lastName: string = String(form.get('lastName'));

    if ((email!=='')&&(llogin!=='')&&(password!=='')&&(firstName!=='')&&(lastName!==''))
    {
      setErrorState(false);
      if (email.indexOf('@')===-1) {
        setEmailCheck(true);
        setEmailText('Email некорректен');
      }
      else {
        setEmailCheck(false);
        setEmailText('Email');
        const loginInfo: RegisterReqData = {
          first_name: firstName,
          last_name: lastName,
          login: llogin,
          email,
          password,
        };
        console.log(loginInfo);
        const checkData: {data: {login: boolean, email: boolean}} = await Api.checkData({login: llogin, email});
        if (checkData.data.login&&checkData.data.email) {
          const { data }: any = await Api.register(loginInfo);
          const { token, first_name: regFName, last_name: regLName, role, gold, rLogin: login, rEmail: email } = data;
          auth.login({token, firstName: regFName, lastName: regLName, role, email, gold, login: llogin});
        }
        else {
          setLoginCheck(!checkData.data.login);      
          setEmailCheck(!checkData.data.email);
        }
      }
    }
    else setErrorState(true);
    //navigator('/join');
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {errorState&&
          <Typography component="h1" variant="h5" sx={{color: 'red'}}>
            Заполни все поля!!!
          </Typography>}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Имя"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="login"
                  label="Псевдоним"
                  name="login"
                  autoComplete="login"
                  error={loginCheck}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={emailTest}
                  name="email"
                  autoComplete="email"
                  error={emailCheck}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Зарегистрирован? Войди
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    // </ThemeProvider>
  );
}