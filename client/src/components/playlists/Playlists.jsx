import { useState, useEffect } from "react"
import { useSearchParams } from 'react-router-dom'
import { MenuList, MenuItem, Typography, Paper } from '@mui/material'
import Info from './toolbar/Toolbar'
import Window from './window/Window'

import styles from "../app.module.css";

function Playlists(props) {
    const [playlists, setPlaylists] = useState([{}])
    const [recommendations, setRecommendations] = useState({})
    const [names, setNames] = useState([])
    const [selected, setSelected] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFakeLoading, setFakeLoading] = useState(false)
    const [isRecommend, setRecommend] = useState(false)

    useEffect(() => {
        let token = searchParams.get("token")
        console.log(token)
        fetch(`/getPlaylists/${token}`).then(
            res => res.json()
        ).then(
            playlists => {
                setPlaylists(playlists)
                console.log(playlists)
                console.log(Object.keys(playlists))
                setNames(Object.keys(playlists))
            }
        )
    }, [])

    const delay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const onRecommend = () => {
        console.log(JSON.stringify(playlists))

        fetch(`/recommendations/${selected}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playlists: playlists })
        }).then(
            res => res.json()
        ).then(
            recommendations => {
                setRecommendations(JSON.parse(recommendations.recommendations))
                setFakeLoading(true)
                delay(3000).then(() => setFakeLoading(false))
                setRecommend(true)
            }
        )
    }

    const handleClick = (e) => {
        setSelected(e.target.innerText)
        console.log(e.target.innerText)
    }

    const mapRecs = () => {
        for (var key in recommendations) {
            if (recommendations.hasOwnProperty(key)) {
                console.log(key + "->" + recommendations[key])
            }
        }
    }

    if (!isFakeLoading) {
        return (
            <Paper>
                <Info styles={styles} isRecommend={isRecommend} setRecommend={setRecommend}></Info>
                <Window styles={styles} names={names} handleClick={handleClick} onRecommend={onRecommend} recommendations={recommendations} isRecommend={isRecommend} setRecommend={setRecommend}></Window>
            </Paper>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}

export default Playlists;