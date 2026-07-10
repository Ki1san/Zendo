import { ThemeProvider } from '@emotion/react';
import { theme } from '../theme/Palette';
import { useParams } from 'react-router';
import { useStoreBoard } from '../store/boardStore';
import { alpha, Box, Chip, Modal, Typography, IconButton, LinearProgress, Button, Stack, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import type { SubTasks } from '../types';
import TextField from '@mui/material/TextField';
import DeleteModal from './DeleteModal';

const Task = () => {
    const { id: boardId } = useParams<{ id: string }>();
    const {
        onCloseArchiveTaskModal,
        onOpenArchiveTaskModal,
        isDeleteModalOpen,
        onCloseTaskModal,
        onOpenTaskModal,
        onCloseDeleteModal,
        onOpenDeleteTaskModal,
        isTaskModalOpen,
        fetchTaskById,
        updateTask,
        selectedTask,
        currentTask, 
        toggleSubTaskChecked
    } = useStoreBoard();

    const [isEditing, setIsEditing] = useState(false) 

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadLine, setDeadLine] = useState("")
    const [subTasksList, setSubTasksList] = useState<SubTasks[]>([])
    const [subTasksInput, setSubTasksInput] = useState("")
    const [fileList, setFileList] = useState<any[]>([])

    useEffect(() => {
        if (isTaskModalOpen && boardId && selectedTask) {
            fetchTaskById(boardId, selectedTask);
        }
    }, [boardId, selectedTask, fetchTaskById]);

    useEffect(() =>
    {
        if(currentTask && isEditing)
        {
            setTitle(currentTask.title || '')
            setDescription(currentTask.description || '')
            setDeadLine(currentTask.deadline ? new Date(currentTask.deadline).toISOString().split('T')[0] : '')
            setSubTasksList(currentTask.subTsk || [])
            setFileList(currentTask.file || [])
        }
    }, [currentTask, isEditing])

    const completedSubtasks = currentTask?.subTsk?.filter((st: SubTasks) => st.checked).length || 0;
    const totalSubtasks = currentTask?.subTsk?.length || 0;
    const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const handleSave = () =>
    {
        if (!boardId || !currentTask) return

        updateTask(boardId, currentTask.id, {
            title: title,
            description: description,
            deadline: deadLine ? new Date(deadLine) : null,
            subTsk: subTasksList,
            file: fileList
        })

        setIsEditing(false)
    }

    const handleCancel = () => setIsEditing(false)

    if (!currentTask) {
        return (
            <ThemeProvider theme={theme}>
                <Box sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, #1A5F7A 100%)`
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                            width: 48, height: 48, borderRadius: '50%',
                            border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            borderTopColor: theme.palette.primary.main,
                            animation: 'spin 1s linear infinite',
                            '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
                        }} />
                        <Typography variant="h6" sx={{ color: theme.palette.secondary.contrastText, fontWeight: 600, letterSpacing: 1 }}>
                            Loading task...
                        </Typography>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={isTaskModalOpen}
                onClose={onCloseTaskModal}
                sx={{ backdropFilter: 'blur(8px)', backgroundColor: alpha('#000000', 0.6) }}
            >
                <Box sx={{
                    position: 'absolute',
                    minHeight: '50vh',
                    // Стили для Firefox
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
                    // Стили для Chrome, Safari и Edge
                    '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    },
                    minWidth: '500px',
                    maxWidth: '700px',
                    maxHeight: '90vh',
                    background: `linear-gradient(160deg, ${theme.palette.secondary.main} 0%, #1C6680 100%)`,
                    top: "50%", left: "50%", transform: 'translate(-50%, -50%)',
                    p: 4, borderRadius: 4,
                    display: 'flex', flexDirection: 'column',
                    boxShadow: `0 25px 50px -12px ${alpha('#000000', 0.5)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
                    overflowY: 'auto',
                    outline: 'none',
                    animation: 'modalSlideIn 0.3s ease-out',
                    '@keyframes modalSlideIn': {
                        from: { opacity: 0, transform: 'translate(-50%, -45%)', scale: 0.98 },
                        to: { opacity: 1, transform: 'translate(-50%, -50%)', scale: 1 }
                    }
                }}>
                    <>
                        <IconButton onClick={onCloseTaskModal} 
                                    sx={{ 
                                        color: alpha(theme.palette.secondary.contrastText, 0.7), 
                                        position: 'absolute',
                                        ml: '85%',
                                        '&:hover': 
                                        { 
                                            color: theme.palette.secondary.contrastText, 
                                            bgcolor: alpha('#fff', 0.1), 
                                        } 
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>

                        {isEditing ? (
                            <>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: alpha(theme.palette.secondary.contrastText, 0.6), 
                                        mb: 1, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: 1, 
                                        fontSize: '0.75rem' 
                                    }}>
                                        Task Title
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter task title..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: theme.palette.secondary.contrastText,
                                                bgcolor: alpha('#000000', 0.15),
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: alpha(theme.palette.secondary.contrastText, 0.2) },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            },
                                            '& .MuiInputLabel-root': { color: alpha(theme.palette.secondary.contrastText, 0.7) }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: alpha(theme.palette.secondary.contrastText, 0.6), 
                                        mb: 1, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: 1, 
                                        fontSize: '0.75rem' 
                                    }}>
                                        Description
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter task description..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: theme.palette.secondary.contrastText,
                                                bgcolor: alpha('#000000', 0.15),
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: alpha(theme.palette.secondary.contrastText, 0.2) },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: alpha(theme.palette.secondary.contrastText, 0.6), 
                                        mb: 1, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: 1, 
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                        Deadline
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={deadLine}
                                        onChange={(e) => setDeadLine(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: theme.palette.secondary.contrastText,
                                                bgcolor: alpha('#000000', 0.15),
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: alpha(theme.palette.secondary.contrastText, 0.2) },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            },
                                            '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                                filter: 'invert(1) brightness(100%)',
                                                cursor: 'pointer'
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Subtasks */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: alpha(theme.palette.secondary.contrastText, 0.6), 
                                        mb: 1.5, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: 1, 
                                        fontSize: '0.75rem' 
                                    }}>
                                        Subtasks ({subTasksList.length})
                                    </Typography>
                                    
                                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={subTasksInput}
                                            onChange={(e) => setSubTasksInput(e.target.value)}
                                            placeholder="Add new subtask..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && subTasksInput.trim()) {
                                                    e.preventDefault();
                                                    setSubTasksList([...subTasksList, { 
                                                        id: crypto.randomUUID(), 
                                                        title: subTasksInput, 
                                                        checked: false 
                                                    }]);
                                                    setSubTasksInput('');
                                                }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: theme.palette.secondary.contrastText,
                                                    bgcolor: alpha('#000000', 0.15),
                                                    borderRadius: 2,
                                                    '& fieldset': { borderColor: alpha(theme.palette.secondary.contrastText, 0.2) },
                                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                if (subTasksInput.trim()) {
                                                    setSubTasksList([...subTasksList, { 
                                                        id: crypto.randomUUID(), 
                                                        title: subTasksInput, 
                                                        checked: false 
                                                    }]);
                                                    setSubTasksInput('');
                                                }
                                            }}
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                color: theme.palette.secondary.main,
                                                minWidth: 'auto',
                                                px: 2,
                                                '&:hover': { bgcolor: '#1bc4b4' }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

\                                    {subTasksList.length > 0 && (
                                        <Stack spacing={1} sx={{ 
                                            maxHeight: '200px', 
                                            overflowY: 'auto',
                                            '&::-webkit-scrollbar': { width: '6px' },
                                            '&::-webkit-scrollbar-thumb': { 
                                                bgcolor: alpha(theme.palette.primary.main, 0.3), 
                                                borderRadius: '3px' 
                                            }
                                        }}>
                                            {subTasksList.map((subTask) => (
                                                <Box 
                                                    key={subTask.id}
                                                    sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1.5, 
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: subTask.checked ? alpha(theme.palette.primary.main, 0.05) : alpha('#000000', 0.1),
                                                        border: `1px solid ${alpha('#fff', 0.05)}`,
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => setSubTasksList(subTasksList.map(st => 
                                                            st.id === subTask.id ? { ...st, checked: !st.checked } : st
                                                        ))}
                                                        sx={{ 
                                                            color: subTask.checked 
                                                                ? theme.palette.primary.main 
                                                                : alpha(theme.palette.secondary.contrastText, 0.4) 
                                                        }}
                                                    >
                                                        {subTask.checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                                    </IconButton>
                                                    <Typography 
                                                        sx={{ 
                                                            flex: 1,
                                                            color: subTask.checked 
                                                                ? alpha(theme.palette.secondary.contrastText, 0.6) 
                                                                : theme.palette.secondary.contrastText,
                                                            textDecoration: subTask.checked ? 'line-through' : 'none'
                                                        }}
                                                    >
                                                        {subTask.title}
                                                    </Typography>
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => setSubTasksList(subTasksList.filter(st => st.id !== subTask.id))}
                                                        sx={{ 
                                                            color: alpha(theme.palette.warning.main, 0.7),
                                                            '&:hover': { color: theme.palette.warning.main }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: alpha(theme.palette.secondary.contrastText, 0.6), 
                                        mb: 1.5, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: 1, 
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <AttachFileIcon sx={{ fontSize: 16, transform: 'rotate(45deg)' }} />
                                        Attachments ({fileList.length})
                                    </Typography>

                                    {/* Upload button */}
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<AttachFileIcon />}
                                        sx={{
                                            mb: 2,
                                            color: alpha(theme.palette.secondary.contrastText, 0.7),
                                            borderColor: alpha(theme.palette.secondary.contrastText, 0.2),
                                            borderStyle: 'dashed',
                                            py: 1.5,
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                color: theme.palette.primary.main,
                                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }}
                                    >
                                        Upload File
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const newFile = {
                                                        name: e.target.files[0].name,
                                                        size: e.target.files[0].size,
                                                        type: e.target.files[0].type
                                                    };
                                                    setFileList([...fileList, newFile]);
                                                }
                                            }}
                                        />
                                    </Button>

                                    {/* File list */}
                                    {fileList.length > 0 && (
                                        <Stack spacing={1}>
                                            {fileList.map((file, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: alpha('#000000', 0.1),
                                                        border: `1px solid ${alpha('#fff', 0.05)}`,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            bgcolor: alpha('#000000', 0.15),
                                                            borderColor: alpha(theme.palette.primary.main, 0.3)
                                                        }
                                                    }}
                                                >
                                                    <AttachFileIcon 
                                                        sx={{ 
                                                            color: theme.palette.primary.main, 
                                                            transform: 'rotate(45deg)' 
                                                        }} 
                                                    />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: theme.palette.secondary.contrastText,
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {typeof file === 'string' ? file : file.name}
                                                        </Typography>
                                                        {typeof file === 'object' && file.size && (
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: alpha(theme.palette.secondary.contrastText, 0.5) 
                                                                }}
                                                            >
                                                                {(file.size / 1024).toFixed(1)} KB
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setFileList(fileList.filter((_, i) => i !== index))}
                                                        sx={{
                                                            color: alpha(theme.palette.warning.main, 0.7),
                                                            '&:hover': {
                                                                color: theme.palette.warning.main,
                                                                bgcolor: alpha(theme.palette.warning.main, 0.1)
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>

                                <Divider sx={{ borderColor: alpha('#fff', 0.1), my: 2 }} />
                                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancel}
                                        sx={{
                                            color: theme.palette.secondary.contrastText,
                                            borderColor: alpha(theme.palette.secondary.contrastText, 0.3),
                                            '&:hover': {
                                                borderColor: theme.palette.secondary.contrastText,
                                                bgcolor: alpha('#fff', 0.05)
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        disabled={!title.trim()}
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            color: theme.palette.secondary.main,
                                            fontWeight: 600,
                                            px: 4,
                                            '&:hover': { bgcolor: '#1bc4b4' },
                                            '&:disabled': {
                                                bgcolor: alpha(theme.palette.secondary.contrastText, 0.2),
                                                color: alpha(theme.palette.secondary.contrastText, 0.4)
                                            }
                                        }}
                                    >
                                        Save 
                                    </Button>
                                </Stack>
                            </>
                        ) : 
                        (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h5" sx={{
                                        color: theme.palette.secondary.contrastText,
                                        fontWeight: 700, flex: 1, pr: 2, lineHeight: 1.3
                                    }}>
                                        {currentTask.title}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                                    {!!currentTask.marker && (
                                        <Chip
                                            label={currentTask.marker}
                                            size="small"
                                            sx={{
                                                color: theme.palette.primary.main,
                                                borderColor: theme.palette.primary.main,
                                                fontWeight: 600,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                                            }}
                                            variant="outlined"
                                        />
                                    )}
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                        <CalendarMonthIcon sx={{ fontSize: 18, color: theme.palette.primary.contrastText }} />
                                        <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText, fontWeight: 500 }}>
                                            {currentTask.deadline ? new Date(currentTask.deadline).toLocaleDateString() : 'No deadline'}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {currentTask.description && (
                                    <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#000000', 0.15), borderRadius: 2, border: `1px solid ${alpha('#fff', 0.05)}` }}>
                                        <Typography variant="subtitle2" sx={{ color: alpha(theme.palette.secondary.contrastText, 0.6), mb: 1, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                                            Description
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: theme.palette.secondary.contrastText, lineHeight: 1.6 }}>
                                            {currentTask.description}
                                        </Typography>
                                    </Box>
                                )}

                                {currentTask.subTsk && currentTask.subTsk.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Typography variant="subtitle2" sx={{ color: alpha(theme.palette.secondary.contrastText, 0.6), textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                                                Subtasks ({completedSubtasks}/{totalSubtasks})
                                            </Typography>
                                        </Box>
                                        
                                        <LinearProgress
                                            variant="determinate"
                                            value={progressPercent}
                                            sx={{
                                                height: 6, borderRadius: 3, mb: 2,
                                                bgcolor: alpha('#000000', 0.2),
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.primary.main,
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />

                                        <Stack spacing={1}>
                                            {currentTask.subTsk.map((stsk: SubTasks, index: number) => (
                                                <Box 
                                                    key={stsk.id || index} 
                                                    onClick = {() => toggleSubTaskChecked(boardId!, currentTask.id, stsk.id)}
                                                    sx={{ 
                                                        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, 
                                                        borderRadius: 2, 
                                                        bgcolor: stsk.checked ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                                                        transition: 'all 0.2s',
                                                        '&:hover': { bgcolor: alpha('#fff', 0.05) }
                                                    }}
                                                >
                                                    {stsk.checked ? (
                                                        <CheckBoxIcon sx={{ color: theme.palette.primary.main }} />
                                                    ) : (
                                                        <CheckBoxOutlineBlankIcon sx={{ color: alpha(theme.palette.secondary.contrastText, 0.4) }} />
                                                    )}
                                                    <Typography 
                                                        sx={{ 
                                                            color: stsk.checked ? alpha(theme.palette.secondary.contrastText, 0.6) : theme.palette.secondary.contrastText,
                                                            textDecoration: stsk.checked ? 'line-through' : 'none',
                                                            flex: 1
                                                        }}
                                                    >
                                                        {stsk.title || 'Untitled Subtask'}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {currentTask.file && currentTask.file.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" sx={{ color: alpha(theme.palette.secondary.contrastText, 0.6), mb: 1.5, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                                            Attachments ({currentTask.file.length})
                                        </Typography>
                                        <Stack spacing={1}>
                                            {currentTask.file.map((f: any, index: number) => {
                                                const fileName = typeof f === 'string' ? f : (f.name || `File ${index + 1}`);
                                                return (
                                                    <Box 
                                                        key={index}
                                                        sx={{ 
                                                            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, 
                                                            borderRadius: 2, border: `1px solid ${alpha('#fff', 0.1)}`,
                                                            cursor: 'pointer',
                                                            '&:hover': { bgcolor: alpha('#fff', 0.05), borderColor: alpha(theme.palette.primary.main, 0.3) }
                                                        }}
                                                    >
                                                        <AttachFileIcon sx={{ color: theme.palette.primary.main, transform: 'rotate(45deg)' }} />
                                                        <Typography variant="body2" sx={{ color: theme.palette.secondary.contrastText }}>
                                                            {fileName}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                )}

                                <Divider sx={{ borderColor: alpha('#fff', 0.1), my: 2 }} />
                                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<ArchiveIcon />}
                                        onClick={() => onOpenArchiveTaskModal(currentTask.id)}
                                        sx={{ color: theme.palette.secondary.contrastText, borderColor: alpha(theme.palette.secondary.contrastText, 0.3), '&:hover': { borderColor: theme.palette.secondary.contrastText, bgcolor: alpha('#fff', 0.05) } }}
                                    >
                                        Archive
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<EditIcon />}
                                        onClick={() => setIsEditing(true)}
                                        sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.secondary.main, fontWeight: 600, '&:hover': { bgcolor: '#1bc4b4' } }}
                                    >
                                        Edit Task
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<DeleteIcon />}
                                        onClick={() => onOpenDeleteTaskModal(currentTask.id)}
                                        sx={{ color: theme.palette.warning.main, borderColor: alpha(theme.palette.warning.main, 0.5), '&:hover': { borderColor: theme.palette.warning.main, bgcolor: alpha(theme.palette.warning.main, 0.1) } }}
                                    >
                                        Delete
                                    </Button>
                                </Stack>

                                <DeleteModal />
                            </>
                        )}
                    </>
                </Box> 
            </Modal>
        </ThemeProvider>
    );
};

export default Task;