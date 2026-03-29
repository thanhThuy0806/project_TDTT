import { useEffect, useRef, useState } from "react";
import styles from './Input.module.css'



export function InputText({placeholder, className , ...rest}) {

    const [text, setText] = useState('')
    const textAreaRef = useRef(null)

    useEffect(() => {
        const target = textAreaRef.current;
        if (target) {
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
        }

    }, [text])


    return (
        <>
            <textarea 
                ref={textAreaRef}
                placeholder={placeholder}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={styles.inputBox}
            />
        </>
    )
}