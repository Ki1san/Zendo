import { ThemeProvider } from "@emotion/react"
import { theme } from "../theme/Palette"
import { Box, Modal, Grid, Card, Typography, Chip, CardMedia, IconButton } from '@mui/material';
import { useStoreBoard } from "../store/boardStore"
import type { Board } from "../types";
import stub from '../img/default.png' 
import { Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface RecentBoardProps {
    open: boolean,
    onClose: () => void
}

const RecentBoard = ({ open, onClose }: RecentBoardProps) => {
    const { boards, updateDate } = useStoreBoard()

    const sortedBoard = boards ? [...boards].sort((a, b) => {
        const dateA = a.visitedAt || a.date
        const dateB = b.visitedAt || b.date
        return new Date(dateB).getTime() - new Date(dateA).getTime()
    }) : []

    const formatDate = (date: Date) => {
        const now = new Date()
        const diffTime = now.getTime() - new Date(date).getTime()
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (days === 0) return 'Today'
        if (days === 1) return 'Yesterday'
        if (days < 7) return `${days} days ago`
        return new Date(date).toLocaleDateString('ru-RU')
    }

    const getCategoryIcon = (category: string | undefined) => {
        switch(category) {
            case 'Private': return '🔒'
            case 'Workspace': return '👥'
            case 'Organization': return '🏢'
            case 'Public': return '🌐'
            default: return '📋'
        }
    }

    const handleProject = (boardId: string) => {
        updateDate(boardId)
        onClose()
    }

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 800,
                    maxHeight: '80vh',
                    overflow: 'auto',
                    bgcolor: theme.palette.secondary.main,
                    borderRadius: '12px',
                    boxShadow: 24,
                    p: 2
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: theme.palette.secondary.contrastText, 
                                fontWeight: 600,
                                letterSpacing: 1,
                            }}
                        >
                            Recent Boards
                            <Chip label={sortedBoard.length} size="small" sx={{ ml: 1, color: theme.palette.primary.contrastText }} />
                        </Typography>
                        <IconButton 
                            onClick={onClose} 
                            sx={{ 
                                color: theme.palette.secondary.contrastText,
                                transition: 'all 0.3s ease',
                                '&:hover':
                                {
                                    transform: 'scale(1.05)',
                                    color: theme.palette.primary.contrastText
                                } 
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Grid container spacing={1.5}>
                        {sortedBoard.slice(0, 6).map((board: Board) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={board.id} sx={{ display: 'flex' }}>
                                <Card 
                                    component={Link}
                                    to={`/board/${board.id}`}
                                    onClick={() => handleProject(board.id)}
                                    sx={{ 
                                        width: '100%',
                                        height: '30vh',
                                        minHeight: 180,
                                        position: 'relative',
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            transition: 'transform 0.2s'
                                        }
                                    }}
                                >
                                    <CardMedia 
                                        component="img"
                                        image={board.wallperData || stub}
                                        alt={board.title}
                                        sx={{ 
                                            height: '100%', 
                                            width: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                                        color: 'white',
                                        p: 1.5
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                            {board.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.7rem' }}>
                                            <span>{getCategoryIcon(board.category)}</span>
                                            {board.category}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, fontSize: '0.65rem' }}>
                                            <AccessTimeIcon sx={{ fontSize: 10 }} />
                                            {formatDate(board.visitedAt || board.date)}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {sortedBoard.length === 0 && (
                        <Typography sx={{ textAlign: 'center', py: 4, color: theme.palette.secondary.contrastText }}>
                            No recent boards
                        </Typography>
                    )}
                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default RecentBoard