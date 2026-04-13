import { createContext, useState } from "react";
import { useContext } from 'react';
import { motion } from "framer-motion";


export const LeftSideBarContext = createContext();

export function LeftSideBarProvider({ children }) {
    const [isOpen, setOpen] = useState(false);
    const closeSideBar = () => {
        setOpen(false);
    }
    return (
        <LeftSideBarContext value={{ isOpen, setOpen, closeSideBar }}>
            {children}
        </LeftSideBarContext>
    );
}
export function LeftSideBar({ children, ...rest }) {
    const { isOpen } = useContext(LeftSideBarContext);

    return (
        <motion.div
            {...rest}
            initial={false}
            variants={sideBarVariants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.5 }}
        >
            <Button>Click This</Button>
            <motion.div
                variants={itemVariants}
                animate={isOpen ? 'open' : 'closed'}
                transition={{ duration: 0.2 }}
                style={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
function Button({ children }) {
    const { isOpen, setOpen } = useContext(LeftSideBarContext);

    return (
        <>
            <button onClick={() => setOpen(!isOpen)}>{children}</button>
        </>
    );
}
// sidebar action and attri when open and close
const sideBarVariants = {
    open: {
        width: '300px',
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
            type: 'linear'
        }
    },
    closed: {
        width: '75px',
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
            type: 'linear'
        }
    } 
};
const itemVariants = {
    open: {
        y: 0, opacity: 1
    },
    closed: {
        y: 0, opacity: 0
    }
}