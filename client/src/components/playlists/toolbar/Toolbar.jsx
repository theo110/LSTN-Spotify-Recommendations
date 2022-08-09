import { Typography, Grid, Toolbar, AppBar, Button } from '@mui/material';
import { useNavigate, useSearchParams } from "react-router-dom"

function Info({ styles, isRecommend, setRecommend }) {
    const navigate = useNavigate()
    const handleLogout = () => {
        navigate(`../login/?logout=true`)
    }

    return (
        <Grid container>
            <AppBar position="absolute" color="secondary" className={styles.hero}>
                <Toolbar className={styles.appbar}>
                    {
                        !isRecommend ?
                            <Button color='primary' variant="contained"
                                onClick={handleLogout}>Logout</Button> :
                            <Button color='primary' variant="contained"
                                onClick={() => setRecommend(false)}>Back to Playlists</Button>
                    }
                    <Typography component="h1" variant="h3" color="primary" noWrap>
                        Playlists
                    </Typography>
                    <Typography component="h1" variant="h6" color="primary" noWrap>
                        Made by Theo
                    </Typography>
                </Toolbar>
            </AppBar>
        </Grid>
    )
}

export default Info