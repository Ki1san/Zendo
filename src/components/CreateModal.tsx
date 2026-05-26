import { ThemeProvider } from '@emotion/react';
import { useStoreBoard } from '../store/boardStore';
import { theme } from '../theme/Palette';
import { Box, Button, Modal, TextField, Typography, CircularProgress, CardMedia, Grid, Card, IconButton, alpha } from '@mui/material';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import stub from '../img/default.png' 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { FetchPhotos } from '../api/PhotoSearch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import type { JSX } from 'react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const CreateModal = () => {
  const { isCreateModalOpen, onCloseHandleModal, addBoard } = useStoreBoard();
  const [title, setTitle] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [category, setCategory] = useState('Workspace'); 
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const createBoard = () => {
    if (title.trim()) {
      addBoard(title, category, selectedPhoto);  
      setTitle("");
      setCategory('Workspace');
      setSelectedPhoto(null);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isCreateModalOpen) {
      const loadPhoto = async () => {
        setIsLoadingPhoto(true);
        try {
          const data = await FetchPhotos();
          setPhotos(data.photos || []);
        } catch (err: any) {
          console.error('Error: ', err);
        } finally {
          setIsLoadingPhoto(false);
        }
      };
      loadPhoto();
    }
  }, [isCreateModalOpen]);

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: theme.palette.secondary.contrastText,
      borderRadius: 3,
      transition: 'all 0.2s ease',
      '& fieldset': { 
        borderColor: alpha(theme.palette.secondary.contrastText, 0.3),
        transition: 'border-color 0.2s ease'
      },
      '&:hover fieldset': { 
        borderColor: theme.palette.primary.main 
      },
      '&.Mui-focused fieldset': { 
        borderColor: theme.palette.primary.main,
        borderWidth: 2
      },
      '& input::placeholder': {
        color: alpha(theme.palette.secondary.contrastText, 0.5),
        opacity: 1
      }
    },
    '& .MuiInputLabel-root': { 
      color: alpha(theme.palette.secondary.contrastText, 0.7),
      fontWeight: 500,
      '&.Mui-focused': { 
        color: theme.palette.primary.main 
      }
    }
  };

  const categoryIconStyles: Record<string, { icon: JSX.Element; color: string }> = {
    'Private': { icon: <LockOutlinedIcon fontSize="small" />, color: '#EF4444' },
    'Workspace': { icon: <PeopleAltOutlinedIcon fontSize="small" />, color: '#3B82F6' },
    'Organization': { icon: <BusinessOutlinedIcon fontSize="small" />, color: '#0891B2' },
    'Public': { icon: <LanguageOutlinedIcon fontSize="small" />, color: '#16A34A' }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal 
        open={isCreateModalOpen} 
        onClose={onCloseHandleModal}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#000000', 0.5)
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          outline: 'none',
          animation: 'modalFadeIn 0.25s ease-out',
          '@keyframes modalFadeIn': {
            from: { opacity: 0, transform: 'translate(-50%, -48%)', scale: 0.97 },
            to: { opacity: 1, transform: 'translate(-50%, -50%)', scale: 1 }
          }
        }}>
          <Box
            sx={{
              position: 'relative',
              width: 420, 
              p: 5,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.95)} 100%)`, 
              borderRadius: 5,
              boxShadow: `0 25px 50px -12px ${alpha('#000000', 0.5)}, 0 0 0 1px ${alpha(theme.palette.secondary.contrastText, 0.1)}`,
              outline: 'none',
              border: `1px solid ${alpha(theme.palette.secondary.contrastText, 0.15)}`
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.secondary.contrastText, 
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontSize: '1rem',
                background: `linear-gradient(90deg, ${theme.palette.secondary.contrastText}, ${alpha(theme.palette.secondary.contrastText, 0.7)})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Create a new Board
              </Typography>
              <IconButton 
                onClick={onCloseHandleModal}
                sx={{
                  color: alpha(theme.palette.secondary.contrastText, 0.6),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.warning.main,
                    backgroundColor: alpha(theme.palette.warning.main, 0.1)
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.secondary.contrastText, 0.2)}, transparent)`,
              mb: 3
            }} />
            
            <Box sx={{ mb: 3 }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  width: "100%",
                  height: 180,
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${alpha(theme.palette.secondary.contrastText, 0.2)}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => setIsVisible(!isVisible)}
              >
                <CardMedia 
                  component='img'
                  image={selectedPhoto || stub}
                  alt='Board background preview'
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '.MuiCard-root:hover &': { transform: 'scale(1.03)' }
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: `linear-gradient(to top, ${alpha('#000000', 0.6)}, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PhotoLibraryIcon sx={{ color: theme.palette.secondary.contrastText, fontSize: 18 }} />
                  <Typography variant="caption" sx={{ color: theme.palette.secondary.contrastText, fontWeight: 500 }}>
                    {selectedPhoto ? 'Change background' : 'Select background'}
                  </Typography>
                </Box>
                {isVisible && (
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: alpha(theme.palette.primary.main, 0.9),
                    borderRadius: '50%',
                    p: 0.5
                  }}>
                    <CheckIcon sx={{ color: theme.palette.secondary.contrastText, fontSize: 16 }} />
                  </Box>
                )}
              </Card>
            </Box>
            
            <TextField
              fullWidth
              label="Board name"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              sx={{ mb: 3, ...textFieldStyles }} 
            />

            <FormControl variant="outlined" fullWidth sx={{ mb: 4 }}>
              <InputLabel id="category-select-label" sx={{ color: alpha(theme.palette.secondary.contrastText, 0.7) }}>Visibility</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={category}
                onChange={handleChange}
                label="Visibility"
                sx={{
                  borderRadius: 3,
                  color: theme.palette.secondary.contrastText,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.secondary.contrastText, 0.3)
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  }
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      color: categoryIconStyles[selected]?.color,
                      display: 'flex'
                    }}>
                      {categoryIconStyles[selected]?.icon}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selected}</Typography>
                  </Box>
                )}
              >
                {Object.entries(categoryIconStyles).map(([value, { icon, color }]) => (
                  <MenuItem 
                    key={value} 
                    value={value} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      py: 2,
                      px: 3,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateX(4px)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2)
                        }
                      }
                    }}
                  >
                    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F172A' }}>{value}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1.3 }}>
                        {value === 'Private' && 'Only invited members can access'}
                        {value === 'Workspace' && 'All workspace members can view and edit'}
                        {value === 'Organization' && 'Visible to everyone in your organization'}
                        {value === 'Public' && 'Anyone with the link can view'}
                      </Typography>
                    </Box>
                    {category === value && (
                      <CheckIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.secondary.contrastText, 0.1)}`
            }}>
              <Button 
                variant="text"
                onClick={onCloseHandleModal}
                sx={{
                  color: alpha(theme.palette.secondary.contrastText, 0.7),
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: theme.palette.warning.main,
                    transform: 'translateX(-2px)'
                  }
                }}
              >
                Cancel
              </Button>

              <Button 
                variant="contained" 
                onClick={createBoard}
                disabled={!title.trim()}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
                  color: theme.palette.secondary.contrastText,
                  fontWeight: 700,
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.5)}`
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.secondary.contrastText, 0.2),
                    color: alpha(theme.palette.secondary.contrastText, 0.4),
                    boxShadow: 'none',
                    cursor: 'not-allowed'
                  }
                }}
              >
                Create Board
              </Button>
            </Box> 
          </Box>

          {isVisible && (
            <Box sx={{
              top: 0,
              left: 'calc(100% + 20px)',
              width: 400,
              overflow: 'auto',
              maxHeight: '520px',
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.95)} 100%)`,
              borderRadius: 5,
              boxShadow: `0 25px 50px -12px ${alpha('#000000', 0.5)}, 0 0 0 1px ${alpha(theme.palette.secondary.contrastText, 0.1)}`,
              border: `1px solid ${alpha(theme.palette.secondary.contrastText, 0.15)}`,
              animation: 'panelSlideIn 0.25s ease-out',
              '@keyframes panelSlideIn': {
                from: { opacity: 0, transform: 'translateX(20px)' },
                to: { opacity: 1, transform: 'translateX(0)' }
              }
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant='subtitle1' sx={{
                  color: theme.palette.secondary.contrastText,
                  fontWeight: 700,
                  letterSpacing: 1
                }}>
                  Choose a background
                </Typography>
                <IconButton 
                  onClick={() => setIsVisible(false)}
                  sx={{
                    color: alpha(theme.palette.secondary.contrastText, 0.6),
                    '&:hover': {
                      color: theme.palette.warning.main,
                      backgroundColor: alpha(theme.palette.warning.main, 0.1)
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  borderStyle: 'dashed',
                  borderColor: alpha(theme.palette.secondary.contrastText, 0.4),
                  color: alpha(theme.palette.secondary.contrastText, 0.8),
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Upload your image
                <input 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setSelectedPhoto(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </Button>

              <Typography variant='caption' sx={{
                display: 'block',
                mb: 2,
                color: alpha(theme.palette.secondary.contrastText, 0.6),
                fontWeight: 500
              }}>
                Or pick from our collection:
              </Typography>
                    
              {isLoadingPhoto ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} sx={{ color: theme.palette.secondary.contrastText }} />
                </Box>
              ) : (
                <Grid container spacing={1.5}>
                  {photos.slice(0, 12).map((photo, index) => (
                    <Grid size={3} key={index}>
                      <Card sx={{
                        cursor: 'pointer',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: selectedPhoto === photo.src?.medium ? 
                          `2px solid ${theme.palette.primary.contrastText}` :
                          `1px solid ${alpha(theme.palette.secondary.contrastText, 0.1)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          transform: 'scale(1.05)',
                          boxShadow: `0 8px 20px ${alpha('#000000', 0.3)}`,
                          borderColor: theme.palette.primary.main
                        }
                      }}
                      onClick={() => setSelectedPhoto(photo.src?.large)}
                      >
                        <CardMedia 
                          component='img'
                          image={photo.src?.medium}
                          alt={`Background option ${index + 1}`}
                          sx={{
                            height: 70,
                            width: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default CreateModal;