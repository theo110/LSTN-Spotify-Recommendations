import { MenuList, MenuItem, Typography, Paper, Grid, Button } from '@mui/material'
import Recommendations from '../recommendations/Recommendations'

function Window({ styles, names, handleClick, onRecommend, recommendations, isRecommend, setRecommend }) {
    if (!isRecommend) {
        return (
            <Grid container component={Paper} className={styles.window}>
                <Grid item xs={6}>
                    <MenuList>{
                        names.map((name) => (
                            <MenuItem onClick={handleClick}>
                                <Typography className={styles.playlist}>
                                    {name}
                                </Typography>
                            </MenuItem>
                        ))
                    }
                    </MenuList>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Button fullWidth color='primary' variant="contained"
                        onClick={onRecommend}>Recommend</Button>
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container component={Paper} className={styles.window}>
                <Grid item xs={6}>
                    <Recommendations recommendations={recommendations} />
                </Grid>
            </Grid>
        )
    }
}

export default Window