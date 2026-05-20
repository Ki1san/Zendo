import { ThemeProvider } from '@emotion/react';
import { useStoreBoard } from '../store/boardStore';
import { theme } from '../theme/Palette';
import { Box, Button, Modal, TextField, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { FetchPhotos } from '../api/PhotoSearch';

const CreateModal = () => {
  const { boards, isCreateModalOpen, onCloseHandleModal, addBoard } = useStoreBoard();
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Workspace'); 

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const createBoard = async () => {
    if (!title.trim()) 
    {
        try
        {
            setIsLoading(true)
            const wallperData = await FetchPhotos()
            addBoard(title, category, wallperData) 
            setTitle('');
            setCategory('Workspace');
        }
        catch(err: any)
        {
            console.error(`Error connect ${err}`)
        }
        finally
        {
            setIsLoading(false)
        }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal open={isCreateModalOpen} onClose={onCloseHandleModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 400, 
            p: 4,
            transform: 'translate(-50%, -50%)',
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
            borderRadius: '8px',
            boxShadow: 24, 
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.contrastText }}>
            Создать новую доску
          </Typography>
          
          <input type='file' />
          
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

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
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
                    <BusinessOutlinedIcon sx={{ color: '#42526e', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#172b4d' }}>Organization</Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', color: '#6b778c', whiteSpace: 'normal', pl: 4 }}>
                    All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this.
                </Typography>
                </MenuItem>

                <MenuItem value="Public" sx={{ display: 'block', py: 1.5, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LanguageOutlinedIcon sx={{ color: '#61bd4f', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#172b4d' }}>Public</Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', color: '#6b778c', whiteSpace: 'normal', pl: 4 }}>
                    Anyone on the internet (including Google) can see this board. Only board members can edit.
                </Typography>
                </MenuItem>
            </Select>
            </FormControl>

          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onCloseHandleModal}
              fullWidth
              sx={{ backgroundColor: theme.palette.warning.main, color: theme.palette.secondary.contrastText }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={createBoard}
              fullWidth
              sx={{ backgroundColor: theme.palette.primary.contrastText, color: theme.palette.secondary.contrastText }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default CreateModal;
