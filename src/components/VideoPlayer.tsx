import ReactPlayer from "react-player";

function VideoPlayer(props: { url: string }) {
    return <div className="player-wrapper" style={{ position: "relative", paddingBottom: "56.25%", marginBottom: "2rem" }}>
        <ReactPlayer
            url={props.url}
            controls={true}
            width='100%'
            height='100%'
            style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        />
    </div>;
}

export default VideoPlayer;