import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          backgroundColor: ' #292929',
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Box
            component={Link}
            to="/issues"
            sx={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              '&:hover': { color: ' #ff6163' },
            }}
          >
            Все задачи
          </Box>

          <Box
            component={Link}
            to="/boards"
            sx={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              '&:hover': { color: ' #ff6163' },
            }}
          >
            Проекты
          </Box>
        </Box>

        <Button
          color="secondary"
          variant="contained"
          onClick={() => navigate('/issues/new')}
          sx={{
            backgroundColor: '#00aaff',
            '&:hover': { backgroundColor: '#0099f7' },
            '&:active': { backgroundColor: '#008aed' },
          }}
        >
          Создать задачу
        </Button>
      </Toolbar>
    </AppBar>
  );
}
