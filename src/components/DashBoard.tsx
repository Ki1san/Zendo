import { ThemeProvider } from '@emotion/react'
import {theme} from '../theme/Palette'
import { Box, Container } from '@mui/material'

const DashBoard = () => 
{
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        background: `linear-gradient(to bottom, 
          ${theme.palette.primary.main},
          ${theme.palette.secondary.main}
        )`,
        minHeight: '100vh'
      }}>
        <Container maxWidth='lg'>
            
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default DashBoard
