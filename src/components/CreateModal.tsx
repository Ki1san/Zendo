import { ThemeProvider } from '@emotion/react';
import { useStoreBoard } from '../store/boardStore';
import { theme } from '../theme/Palette';
import { Box, Button, Modal, TextField, Typography, CircularProgress, CardMedia, Grid, Card } from '@mui/material';
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
import { alpha } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

  return (
    <ThemeProvider theme={theme}>
      <Modal 
        open={isCreateModalOpen} 
        onClose={onCloseHandleModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          outline: 'none'
        }}>
          <Box
            sx={{
              position: 'relative',
              width: 400, 
              p: 4,
              background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
              borderRadius: '8px',
              boxShadow: 24, 
              outline: 'none'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.contrastText, fontWeight: 600 }}>
              Create a new Board
            </Typography>
            
            <Box sx={{
              mb: 2
            }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  width: "100%",
                  height: 200,
                  flexShrink: 0
                }}
                onClick={() => setIsVisible(!isVisible)}
              >
                <CardMedia 
                  component='img'
                  width="100%"
                  image={selectedPhoto || stub}
                  alt='☹'
                />
              </Card>
            </Box>
            
            <TextField
              fullWidth
              id="standard-basic"
              label="Название доски"
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              sx={{ mb: 2 }} 
            />

            <FormControl variant="standard" fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-select-label">Вид видимости</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={category}
                onChange={handleChange}
                label="Вид видимости"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selected === 'Private' && <LockOutlinedIcon fontSize="small" sx={{ color: '#d32f2f' }} />}
                    {selected === 'Workspace' && <PeopleAltOutlinedIcon fontSize="small" sx={{ color: '#1976d2' }} />}
                    {selected === 'Organization' && <BusinessOutlinedIcon fontSize="small" sx={{ color: '#0288d1' }} />}
                    {selected === 'Public' && <LanguageOutlinedIcon fontSize="small" sx={{ color: '#2e7d32' }} />}
                    <Typography variant="body1">{selected}</Typography>
                  </Box>
                )}
              >
                <MenuItem value="Private" sx={{ display: 'block', py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LockOutlinedIcon sx={{ color: '#e05948', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#172b4d' }}>Private</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b778c', whiteSpace: 'normal', pl: 4 }}>
                    Board members and Inktistic Workspace admins can see and edit this board.
                  </Typography>
                </MenuItem>

                <MenuItem value="Workspace" sx={{ display: 'block', py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <PeopleAltOutlinedIcon sx={{ color: '#42526e', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#172b4d' }}>Workspace</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b778c', whiteSpace: 'normal', pl: 4 }}>
                    All members of the Inktistic Workspace can see and edit this board.
                  </Typography>
                </MenuItem>

                <MenuItem value="Organization" sx={{ display: 'block', py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <BusinessOutlinedIcon sx={{ color: '#0288d1', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#172b4d' }}>Organization</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b778c', whiteSpace: 'normal', pl: 4 }}>
                    All members of the organization can see this board.
                  </Typography>
                </MenuItem>

                <MenuItem value="Public" sx={{ display: 'block', py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LanguageOutlinedIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#172b4d' }}>Public</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b778c', whiteSpace: 'normal', pl: 4 }}>
                    Anyone on the internet can see this board. Only board members can edit.
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center'
            }}>
              <Button 
                variant="contained" 
                onClick={onCloseHandleModal}
                sx={{
                  background: theme.palette.warning.main,
                  color: theme.palette.secondary.contrastText,
                  transition: 'all ease 0.3s',
                  minWidth: '120px',
                  '&:hover':
                  {
                    transform: 'scale(1.05)',
                    background: alpha(theme.palette.warning.main,0.6),
                  }
                }}
              >
                Cancel
              </Button>

              <Button 
                variant="contained" 
                onClick={createBoard}
                sx={{
                  background: theme.palette.primary.main,
                  color: theme.palette.secondary.contrastText,
                  transition: 'all ease 0.3s',
                  minWidth: '120px',
                  '&:hover':
                  {
                    transform: 'scale(1.05)',
                    background: alpha(theme.palette.primary.main,0.6),
                  }
                }}
                disabled={!title.trim()}
              >
                Create
              </Button>
            </Box> 
          </Box>

            {isVisible && (
                <Box sx={{
                  top: 0,
                  left: 'calc(100% + 16px)',
                  Width: 380,
                  overflow: 'auto',
                  maxHeight: '450px',
                  p: 3,
                  background: `linear-gradient(to bottom, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  borderRadius: '8px',
                  boxShadow: 24,
                }}>
                  <Typography variant='subtitle2' sx={{
                    mb: 1,
                    color: theme.palette.secondary.contrastText
                  }}>
                    Выберите обои:
                  </Typography>

                  <Button
                        component="label"
                        variant="contained"
                        fullWidth
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                      >
                        Загрузить фото
                        <input type="file" hidden accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setSelectedPhoto(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </Button>                  
                    
                    {isLoadingPhoto ? (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      py: 2
                    }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Grid container spacing={1}>
                      {photos.map((photo, index) => (
                        <Grid size={3} key={index}>
                          <Card sx={{
                            cursor: 'pointer',
                            border: selectedPhoto === photo.src?.medium ? 
                            `3px solid ${theme.palette.primary.contrastText}` :
                            'none',
                            height: 55,
                            transition: 'transform 0.15s ease',
                            '&:hover': { 
                              transform: 'scale(1.05)',
                              boxShadow: 3
                            }
                          }}
                          onClick={() => setSelectedPhoto(photo.src?.large)}
                          >
                            <CardMedia 
                              component='img'
                              image={photo.src?.medium}
                              alt='Not Found'
                              sx={{
                                height: 200,
                                width: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center'
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
