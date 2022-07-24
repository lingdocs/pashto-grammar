function Image(props: {
    src: string,
    alt?: string,
    maxWidth?: string | number,
}) {
    return <div className="text-center mb-2" style={props.maxWidth ? {
        maxWidth: props.maxWidth,
        margin: "0 auto",
    } : {}}>
        <img className="img-fluid" src={props.src} alt={props.alt || ""} />
    </div>
}

export default Image;