import { useState, useEffect } from "react"
import { useNavigate, useSearchParams} from "react-router-dom"
import queryString from 'query-string'

const SPOTIFY_AUTH = "https://accounts.spotify.com/authorize"
const CLIENT_ID = 'b9f7c6b1f11049198b9a6916c53bf2f2'
const REDIRECT_URI = 'http://localhost:3000/login'
const SCOPE = 'user-library-read'


function Login(props) {
    let navigate = useNavigate()
    const [token, setToken] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const hash = window.location.hash
        let token = window.sessionStorage.getItem("token")
        if(searchParams.get("logout")){
            handleLogout()
        }else{
            if (!token && hash) {
                token = hash.substring(1).split("&").find(e => e.startsWith("access_token")).split("=")[1]
                window.location.hash = ""
                window.sessionStorage.setItem("token", token)
                setToken(token)
                navigate(`../playlists/?token=${token}`)
            }else if (token){
                navigate(`../playlists/?token=${token}`)
            }
        }
    }, [])
    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTH}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scopes=${SCOPE}&response_type=token&show_dialog=true`
    }

    const handleLogout = () => {
        setToken("")
        window.sessionStorage.removeItem("token")
    }
    return (
        <div>
            {!token ? <button onClick={handleLogin}>Login</button> : <button onClick={handleLogout}>Logout</button>}
            <div>{token}</div>
        </div>
    )
}

export default Login;