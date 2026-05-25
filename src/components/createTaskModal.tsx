import { ThemeProvider } from "@emotion/react"
import { theme } from "../theme/Palette"
import { Modal, Box } from '@mui/material';
import { useStoreBoard } from "../store/boardStore"

const createTaskModal = () =>
{
    const {onOpenCreateTaskModal, onCloseCreateTaskModal, addTask, selectedTask, isTaskModalOpen} = useStoreBoard()


    return(
        <ThemeProvider theme={theme}>
            <Modal open={isTaskModalOpen} onClose={onCloseCreateTaskModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        outline: 'none'
                    }}
                >

                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default createTaskModal