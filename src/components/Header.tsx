import { ThemeProvider } from "@emotion/react"
import { theme } from "../theme/Palette"
import { AppBar, Badge, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import CycloneIcon from '@mui/icons-material/Cyclone';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useState } from "react";
import { useStoreBoard } from "../store/boardStore";
import CreateModal from "./CreateModal";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const pages: string[] = [
    'Workspace',
    'Recent',
    'Starred', 
    'Create'
]

const Header = () => 
{
    const {onOpenHandleModal} = useStoreBoard()
    const count = 5

    const handlePage = ( page: string) =>
    {
        switch(page)
        {
            case 'Create': 
                onOpenHandleModal()
                break
        }
    }

    return(
        <ThemeProvider theme={theme}>
            <AppBar 
                sx={{
                    background: theme.palette.secondary.main,
                    minHeight: '5vh',
            }}>
                    <Toolbar disableGutters>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                        mr: 8,
                        ml: 8
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CycloneIcon />
                            <Typography 
                                variant="h5"
                                noWrap
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    letterSpacing: '0.3rem',
                                    fontSize: '22px',
                                    color: theme.palette.secondary.contrastText,
                                }}
                            >
                                Zendo
                            </Typography>
                        </Box>

                        <Box sx={{
                            gap: 1,
                            display: {xs: 'none', md: 'flex'}
                        }}>
                            {pages.map((page: string) => 
                            (
                                <Button 
                                    onClick={() => handlePage(page)}
                                    key={page}
                                    sx={{
                                        position: 'relative',
                                        my: 2,
                                        fontSize: '14px', 
                                        fontWeight: 700,
                                        transition: 'all 0.3s ease',
                                        color: theme.palette.secondary.contrastText,
                                        '&:hover': {
                                            color: theme.palette.primary.contrastText,
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            transform: 'scale(1.05)'
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '50%',
                                            width: 0,
                                            height: '2px',
                                            backgroundColor: theme.palette.primary.contrastText,
                                            transition: 'all 0.3s ease',
                                            transform: 'translateX(-50%)',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        }
                                        
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon sx={{color: theme.palette.secondary.contrastText}}/>
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>

                            <Box
                                sx={{
                                    display: {xs: 'none', md: 'flex'}
                                }}
                            >
                                <IconButton 
                                    size='large'
                                    sx={{
                                        color: theme.palette.secondary.contrastText,
                                        transition: 'all 0.3s ease',
                                        '&:active': {
                                            color: theme.palette.primary.contrastText,
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        '&:hover': 
                                        {
                                            transform: 'scale(1.5)' 
                                        }
                                    }}
                                >
                                    <DarkModeIcon />
                                </IconButton>

                                <IconButton
                                    size="large"
                                    aria-label={`show ${count} notifications`}
                                    sx={{
                                        color: theme.palette.secondary.contrastText,
                                        transition: 'all 0.3s ease',
                                        '&:active': {
                                            color: theme.palette.primary.contrastText,
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        '&:hover': 
                                        {
                                            transform: 'scale(1.5)' 
                                        }
                                    }}
                                >
                                    <Badge badgeContent={count} sx={{
                                        '& .MuiBadge-badge': { 
                                            background: theme.palette.primary.contrastText,
                                            color: theme.palette.secondary.contrastText,
                                        } 
                                    }} >
                                        <NotificationsIcon />
                                    </Badge>    
                                </IconButton>

                                <IconButton 
                                    size="large" 
                                    edge='end'
                                    sx={{
                                        color: theme.palette.secondary.contrastText,
                                        transition: 'all 0.3s ease',
                                        '&:active': {
                                            color: theme.palette.primary.contrastText,
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        '&:hover': 
                                        {
                                            transform: 'scale(1.5)' 
                                        }

                                }}>
                                    <AccountCircle />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                    </Toolbar>
            </AppBar>

            <CreateModal />
        </ThemeProvider>
    )
}

export default Header