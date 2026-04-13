import "./Avatar.css"

export function Avatar({src, alt, ...props}) {
    return (
        <>
            <div>
                <img src={src} atl={alt} {...props}/>
            </div>
        </>
    )
}