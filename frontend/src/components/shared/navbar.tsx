import type React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import type { RootState } from '../../app/store';


const Navbar: React.FC = () => {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    component={Link}
                    to="/store"
                >
                    Product paid
                </Typography>
                <Box>
                    {isAuth ? (
                        <>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                Bienvenido, {user?.email}
                            </Typography>
                            <Button color="inherit" component={Link} to="/my-transactions">
                                Mis compras
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Sallir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Registro
                            </Button>
                        </>
                    )}
                    <Button color="inherit" component={Link} to="/store">
                        Tienda
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
