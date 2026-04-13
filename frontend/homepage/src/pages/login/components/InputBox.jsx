import { motion } from "framer-motion"


export function InputBox({label,type, placeholder, ...props}) {
    return (
        <motion.div {...props} className={` ${props.className} flex flex-row relative w-6/8 h-fit pt-2 pb-2`}>
            <label className="absolute -top-1 left-2 px-1 bg-white text-[10px] font-bold">
            {label}
            </label>
            <div className="w-fit min-w-[60%] h-5 text-gray-400">
                <input type={type} placeholder={placeholder} className="w-full h-fit pt-1 pb-1 pl-2 outline-none border border-blue-500 text-sm text-gray-700 bg-transparent placeholder:text-gray-400" />
            </div>
        </motion.div>
    )
}