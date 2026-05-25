import { useEffect } from 'react';
import { useParams } from 'react-router';
import { ThemeProvider } from '@emotion/react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { theme } from '../theme/Palette';
import { useStoreBoard } from '../store/boardStore';

const statusProps: Array<'todo' | 'in-progress' | 'complete'> =['todo', 'in-progress', 'complete'];

const Board = () => {
  const { id } = useParams<{ id: string }>();
  const { currentBoard, fetchBoardById, onOpenCreateTaskModal} = useStoreBoard();

  useEffect(() => {
    if (id) {
      fetchBoardById(id);
    }
  }, [id, fetchBoardById, ]);

  if (!currentBoard) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'secondary.main' }}>
          <Typography variant="h5" sx={{ color: 'secondary.contrastText', fontWeight: 600 }}>
            Board is loading...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage: currentBoard?.wallperData ? `url(${currentBoard.wallperData})` : 'none',
          backgroundColor: currentBoard?.wallperData ? 'transparent' : 'secondary.main', 
          height: '100vh',
          width: '100vw',
          p: 3,
          boxSizing: 'border-box',
          overflowX: 'auto',
          overflowY: 'hidden',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            mt: 10,
            alignItems: 'flex-start',
            height: '100%',
            pb: 2,
          }}
        >
          {statusProps.map((stat: string, index: number) => (
            <Box
              key={index}
              sx={{
                width: 280,
                minWidth: 280,
                backgroundColor: 'rgba(255, 248, 233, 0.95)', 
                borderRadius: 3,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100% - 24px)',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: 'secondary.main', 
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  {stat.replace('-', ' ')}
                </Typography>
                
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: stat === 'complete' ? 'warning.main' : 'primary.main' 
                  }} 
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  overflowY: 'auto',
                  maxHeight: '100%',
                  pr: 0.5,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(37, 132, 167, 0.2)', borderRadius: '4px' },
                }}
              >
                <Card
                  //onClick = {() => }
                  sx={{
                    boxShadow: '0px 2px 4px rgba(37, 132, 167, 0.08)',
                    borderRadius: 2,
                    backgroundColor: '#FFF',
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main', 
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 4px 8px rgba(37, 132, 167, 0.15)' 
                    },
                  }}
                >
                  <CardContent sx={{ p: '12px !important' }}>
                    <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 500 }}>
                      {}
                    </Typography>
                  </CardContent>
                </Card>

                <Button
                    sx={{

                    }}
                    onClick={onOpenCreateTaskModal}
                >+</Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Board;
