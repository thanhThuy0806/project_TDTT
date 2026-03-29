import { AnimatePresence, motion} from "framer-motion";
import {
    cloneElement,
    createContext,
    useContext,
    useEffect,
    useState,
    useRef
} from "react";



const DropdownContext = createContext();


function DropdownMenu({ children, className, style }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const toggle = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);

    useEffect(() => {
        const handleClick = (e) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) {
                close();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
    }, [isOpen]);


    return (
        <DropdownContext.Provider value={{ isOpen, toggle, close }}>
            <div ref={containerRef} style={style} className={className}>
                {children}
            </div>
        </DropdownContext.Provider>
    )
}
function Trigger({ children }) {
    const { toggle } = useContext(DropdownContext);

    return cloneElement(children, {
        onClick: (e) => {
            e.preventDefault();
            toggle();
        }
    });
}
function Content({ children, className, style }) {
    const { isOpen } = useContext(DropdownContext);
    if (!isOpen) return null;

    return (
        <AnimatePresence>
        {
            isOpen && (
                <motion.div className={className} 
                initial={{opacity: 0, y: -10, scale: 0.95}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -10, scale: 0.95}}
                transition={{duration: 0.2, ease: "easeOut"}}
                style={{
                position: 'absolute',
                top: '5em',
                right: '10em',
                transform: 'translateX(-50%)',
                zIndex: 10,
                ...style
            }}>
                {children}
            </motion.div>
            )
        }
        </AnimatePresence>
    );
}


DropdownMenu.Trigger = Trigger;
DropdownMenu.Content = Content;

export default DropdownMenu;