import { ThemeProvider } from "@emotion/react"
import { useStoreBoard } from "../store/boardStore"
import { theme } from "../theme/Palette"
import { Box, Button, Modal, Typography } from "@mui/material"

interface DeleteProps
{
    open: boolean,
    onClose: () => void
}
const DeleteModal = ({open, onClose} : DeleteProps) => 
{
    const {isDeleteModalOpen, selectedBoardId, removeBoard, onCloseDeleteModal} = useStoreBoard() 

    const handleDelete = () =>
    {
        if(selectedBoardId)
        {
            removeBoard(selectedBoardId)
            onCloseDeleteModal()
        }
    }

    return(
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                    minHeight: '100vh',
                    background: 'white'
                }}>
                    <Box>
                        <Typography variant="h5">
                            Are you sure?
                        </Typography>
                    </Box>
                                        
                    <Box>
                        <Button onClick={onCloseDeleteModal}>Cancel</Button>

                        <Button onClick={handleDelete}>Yes</Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default DeleteModal