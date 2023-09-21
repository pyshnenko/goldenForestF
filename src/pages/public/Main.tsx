import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';

// import SignUp from './SignUp';
import Image from 'static/logo.jpg';

export default function App() {
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff', 
            mb: 6,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${Image})`,
          }}
        >
          {/* Increase the priority of the hero background image */}
          {<img style={{ display: 'none' }} src={Image} alt='image' />}

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,.3)',
            }}
          />
          <Grid container>
            <Grid item md={6}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                }}
              >
                <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                  {'Golden forest'}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  {'Welcome'}
                </Typography>
                <Typography variant="h6" color="inherit" paragraph>
                  Творческий клуб (ТК) «Золотые леса» - это сообщество людей, которых объединяют
                  общие интересы (ролевые игры, фехтование, стрельба из лука, танцы, крафт и многое другое) и
                  общие ценности. Почему творческий? Мы стремимся к многогранному развитию членов клуба,
                  реализации их творческого потенциала. И у нас получается. У нас много друзей и грандиозные планы. Присоединяйтесь.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
