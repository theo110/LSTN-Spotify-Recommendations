



function Recommendations({ recommendations }) {
    const url = "https://open.spotify.com/track/"
    return (
        <div>{
            Object.keys(recommendations).map((key, val) => (
                <a href={url+key}>
                    <p> song: {recommendations[key]}</p>
                </a>
            ))
        }</div>
    )
}

export default Recommendations