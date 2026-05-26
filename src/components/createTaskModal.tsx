import { ThemeProvider } from "@emotion/react"
import { theme } from "../theme/Palette"
import { Modal, Box, Button, Typography, TextField, Chip, alpha, IconButton, InputAdornment } from '@mui/material';
import { useStoreBoard } from "../store/boardStore"
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateTaskModal = () =>
{
    const {id} = useParams<{ id: string }>()
    const {isCreateTaskModalOpen, boards, onCloseCreateTaskModal, addTask, fetchBoardById} = useStoreBoard()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [fileList, setFileList] = useState<string[]>([])
    const [markers, setMarkers] = useState<string[]>([])
    const [markerInput, setMarkerInput] = useState('')

    useEffect(() => {
        if(id) {
            fetchBoardById(id)
        }
    }, [id, fetchBoardById, boards])

    const handleAddMarker = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && markerInput.trim()) {
            e.preventDefault()
            if (!markers.includes(markerInput.trim())) {
                setMarkers([...markers, markerInput.trim()])
            }
            setMarkerInput('')
        }
    }

    const handleDeleteMarker = (markerToDelete: string) => {
        setMarkers(markers.filter((m) => m !== markerToDelete))
    }

    const handleCreate = (e: React.FormEvent) =>
    {
        e.preventDefault()
        if (!id || !title.trim()) return

        addTask(id, title, description, fileList as any, markers)

        setTitle('')
        setDescription('')
        setFileList([])
        setMarkers([])
        setMarkerInput('')
        onCloseCreateTaskModal()
    }

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
            '& input::placeholder, & textarea::placeholder': {
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

    return(
        <ThemeProvider theme={theme}>
            <Modal 
                open={isCreateTaskModalOpen} 
                onClose={onCloseCreateTaskModal}
                sx={{
                    backdropFilter: 'blur(8px)',
                    backgroundColor: alpha('#000000', 0.6)
                }}
            >
                <Box
                    component='form'
                    onSubmit={handleCreate}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.95)} 100%)`,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        gap: 3,
                        boxShadow: `0 25px 50px -12px ${alpha('#000000', 0.5)}, 0 0 0 1px ${alpha(theme.palette.secondary.contrastText, 0.1)}`,
                        flexDirection: 'column',
                        p: 5,
                        width: 420,
                        alignItems: 'stretch',
                        outline: 'none',
                        borderRadius: 5,
                        border: `1px solid ${alpha(theme.palette.secondary.contrastText, 0.15)}`,
                        animation: 'modalSlideIn 0.3s ease-out',
                        '@keyframes modalSlideIn': {
                            from: { opacity: 0, transform: 'translate(-50%, -45%)', scale: 0.98 },
                            to: { opacity: 1, transform: 'translate(-50%, -50%)', scale: 1 }
                        }
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                    }}>
                        <Typography 
                            variant="h6" 
                            sx={{
                                color: theme.palette.secondary.contrastText,
                                fontWeight: 800,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                fontSize: '1rem',
                                background: `linear-gradient(90deg, ${theme.palette.secondary.contrastText}, ${alpha(theme.palette.secondary.contrastText, 0.7)})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Create a new task
                        </Typography>
                        <IconButton 
                            onClick={onCloseCreateTaskModal}
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
                        mb: 2
                    }} />

                    <TextField
                        label="Name" 
                        variant="outlined" 
                        fullWidth 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={textFieldStyles}
                    />

                    <TextField 
                        label="Description" 
                        variant="outlined" 
                        fullWidth 
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{...textFieldStyles, '& .MuiOutlinedInput-root': {...textFieldStyles['& .MuiOutlinedInput-root'], minHeight: 100}}}
                    />

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <TextField 
                            label="Tags" 
                            variant="outlined" 
                            fullWidth 
                            value={markerInput}
                            onChange={(e) => setMarkerInput(e.target.value)}
                            onKeyDown={handleAddMarker}
                            sx={textFieldStyles}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={() => {
                                                    if (markerInput.trim() && !markers.includes(markerInput.trim())) {
                                                        setMarkers([...markers, markerInput.trim()])
                                                        setMarkerInput('')
                                                    }
                                                }}
                                                sx={{
                                                    color: alpha(theme.palette.secondary.contrastText, 0.6),
                                                    '&:hover': {
                                                        color: theme.palette.primary.main
                                                    }
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>

                    {markers.length > 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1.5,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.secondary.contrastText, 0.05)
                        }}>
                            {markers.map((marker, index) => (
                                <Chip
                                    key={index}
                                    label={marker}
                                    onDelete={() => handleDeleteMarker(marker)}
                                    deleteIcon={<DeleteIcon fontSize="small" />}
                                    sx={{ 
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        color: theme.palette.secondary.contrastText,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.3),
                                            transform: 'translateY(-1px)'
                                        },
                                        '& .MuiChip-deleteIcon': {
                                            color: alpha(theme.palette.secondary.contrastText, 0.5),
                                            transition: 'color 0.2s ease',
                                            '&:hover': { 
                                                color: theme.palette.warning.main 
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    <Button 
                        component="label"
                        variant="outlined"
                        fullWidth
                        startIcon={<AttachFileIcon />}
                        sx={{
                            ...textFieldStyles['& .MuiOutlinedInput-root'],
                            borderRadius: 3,
                            borderStyle: 'dashed',
                            py: 1.5,
                            color: alpha(theme.palette.secondary.contrastText, 0.7),
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                            }
                        }}
                    >
                        {fileList.length > 0 ? fileList[0] : 'Attach a file'}
                        <input 
                            type="file" 
                            hidden 
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if(e.target.files && e.target.files.length > 0) {
                                    setFileList([e.target.files[0].name])
                                }
                            }}
                        />
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            pt: 2,
                            gap: 2,
                            borderTop: `1px solid ${alpha(theme.palette.secondary.contrastText, 0.1)}`
                        }}
                    >
                        <Button 
                            variant="text"
                            onClick={onCloseCreateTaskModal}
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
                            type="submit"
                            variant="contained"
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
                            Create Task
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default CreateTaskModal