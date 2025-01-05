// src/pages/Home.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function Home() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Crypto Trading Bot
      </Typography>
      <Typography variant="body1">
        Manage your crypto investments with ease.
      </Typography>
    </Container>
  );
}

export default Home;
