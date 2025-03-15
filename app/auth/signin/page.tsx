'use client';

import { getProviders, signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Divider,
  Stack
} from '@mui/material';
import { GitHub, Google } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<any>(null);
  
  useEffect(() => {
    // Redirect to dashboard if already signed in
    if (session) {
      redirect('/dashboard');
    }
    
    // Fetch providers
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    
    fetchProviders();
  }, [session]);

  if (!providers) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          borderRadius: 2
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4, color: 'white' }}>
          Trajectory Admin Login
        </Typography>

        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }} action="/api/auth/callback/credentials" method="post">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'gray',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'gray',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mb: 3, py: 1.5 }}
            onClick={(e) => {
              e.preventDefault();
              const email = (document.getElementById('email') as HTMLInputElement).value;
              const password = (document.getElementById('password') as HTMLInputElement).value;
              signIn('credentials', { email, password, callbackUrl: '/dashboard' });
            }}
          >
            Sign In
          </Button>

          <Divider sx={{ my: 3, color: 'gray' }}>OR</Divider>

          <Stack spacing={2}>
            {providers && Object.values(providers).map((provider: any) => {
              if (provider.id === 'credentials') return null;
              
              return (
                <Button
                  key={provider.id}
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    py: 1.5, 
                    color: 'white', 
                    borderColor: 'gray',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                  startIcon={provider.id === 'github' ? <GitHub /> : <Google />}
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                >
                  Sign in with {provider.name}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
} 