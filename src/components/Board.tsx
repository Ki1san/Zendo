import { useEffect } from 'react';
import { useParams } from 'react-router';
import { ThemeProvider } from '@emotion/react';
import { Box, Button, Card, CardContent, Typography, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { theme } from '../theme/Palette';
import { useStoreBoard } from '../store/boardStore';
import CreateTaskModal from './CreateTaskModal';

const statusProps: Array<'todo' | 'in-progress' | 'complete'> = ['todo', 'in-progress', 'complete'];

const statusConfig = {
  'todo': { label: 'To Do', color: '#3B82F6', bg: alpha('#3B82F6', 0.1) },
  'in-progress': { label: 'In Progress', color: '#0891B2', bg: alpha('#0891B2', 0.1) },
  'complete': { label: 'Done', color: '#16A34A', bg: alpha('#16A34A', 0.1) }
};

const Board = () => {
  const { id } = useParams<{ id: string }>();
  const { currentBoard, fetchBoardById, onOpenCreateTaskModal, onOpenTaskModal } = useStoreBoard();

  useEffect(() => {
    if (id) {
      fetchBoardById(id);
    }
  }, [id, fetchBoardById]);

  if (!currentBoard) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.7, transform: 'scale(0.98)' }
            }
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: `3px solid ${alpha(theme.palette.secondary.contrastText, 0.3)}`,
              borderTopColor: theme.palette.secondary.contrastText,
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
            <Typography variant="h6" sx={{ 
              color: theme.palette.secondary.contrastText, 
              fontWeight: 600,
              letterSpacing: 1
            }}>
              Loading board...
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage: currentBoard?.wallperData ? `url(${currentBoard.wallperData})` : 'none',
          backgroundColor: currentBoard?.wallperData ? 'transparent' : theme.palette.secondary.main, 
          height: '100vh',
          width: '100vw',
          p: 4,
          boxSizing: 'border-box',
          overflowX: 'auto',
          overflowY: 'hidden',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: currentBoard?.wallperData 
              ? `linear-gradient(135deg, ${alpha('#000000', 0.3)} 0%, ${alpha(theme.palette.secondary.main, 0.7)} 100%)`
              : 'none',
            pointerEvents: 'none',
            zIndex: 0
          }
        }}
      >
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 4,
          height: 'calc(100% - 32px)',
          pt: 8
        }}>
          {statusProps.map((status) => {
            const config = statusConfig[status];
            const columnTasks = currentBoard.tasks.filter(task => task.status === status && !task.isArhived);

            return (
              <Box
                key={status}
                sx={{
                  width: 320,
                  minWidth: 320,
                  backgroundColor: alpha(theme.palette.secondary.contrastText, 0.95),
                  borderRadius: 4,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '100%',
                  boxShadow: `0 12px 40px ${alpha('#000000', 0.25)}, 0 0 0 1px ${alpha(theme.palette.secondary.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                  transition: 'box-shadow 0.2s ease',
                  '&:hover': {
                    boxShadow: `0 20px 60px ${alpha('#000000', 0.35)}, 0 0 0 1px ${alpha(config.color, 0.3)}`
                  }
                }}
              >
                {/* Упрощённый заголовок колонки */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2.5,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
                }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: config.color,
                    boxShadow: `0 0 0 4px ${config.bg}`
                  }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: theme.palette.secondary.main,
                      textTransform: 'uppercase',
                      fontSize: '0.8rem',
                      letterSpacing: '1.5px',
                    }}
                  >
                    {config.label}
                  </Typography>
                </Box>

                {/* Контейнер задач */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    overflowY: 'auto',
                    flexGrow: 1,
                    mb: 2,
                    pr: 1,
                    '&::-webkit-scrollbar': { width: '5px' },
                    '&::-webkit-scrollbar-track': { background: alpha(theme.palette.secondary.main, 0.05), borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb': { 
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2), 
                      borderRadius: '10px',
                      '&:hover': { backgroundColor: alpha(theme.palette.secondary.main, 0.4) }
                    }
                  }}
                >
                  {columnTasks.map((task) => (
                    <Card
                      key={task.id}
                      onClick={() => onOpenTaskModal(task.id)}
                      sx={{
                        boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.08)}`,
                        borderRadius: 3,
                        backgroundColor: '#FFFFFF',
                        borderLeft: `4px solid ${config.color}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.15)}`
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ 
                          color: '#1E293B', 
                          fontWeight: 700,
                          lineHeight: 1.4,
                          fontSize: '0.95rem'
                        }}>
                          {task.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Button
                  variant="text"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => onOpenCreateTaskModal(currentBoard.id)}
                  sx={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: alpha(theme.palette.secondary.main, 0.7),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(config.color, 0.1), 
                      color: config.color,
                      transform: 'translateX(2px)'
                    },
                    '& .MuiButton-startIcon': {
                      transition: 'transform 0.2s ease',
                    },
                    '&:hover .MuiButton-startIcon': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  Add a task
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>
      <CreateTaskModal /> 
    </ThemeProvider>
  );
};

export default Board;