import { useState } from "react";
import { motion } from "framer-motion";
import "./Login.css"
import { InputBox } from "./components/InputBox";
import { useAuth } from "../../context/userAuthenticateContext";

/* This new modified version integrate Login and Signup in the same form */
const options = [
    {
        id: '1',
        description: 'Sign In with Google'
    },
    {
        id: '2',
        description: 'Sign In with Email'
    },
    {
        id: '3',
        description: 'Sign In with Apple'
    },
]
const signInMethods = ['Google', 'Facebook', 'Apple'];
const items = ['Login', 'Sign up'];

function Login() {
    // switch between login and sign up
    const [isLogin, setIsLogin] = useState(true);
    const {login} = useAuth();

    function handleAuth(data) {
        login(data);
    }
    return (
        <div className="flex relative flex-row h-screen w-screen bg-linear-to-r from-blue-500 to-blue-400 justify-center">
            <form className="grid absolute grid-cols-2 bg-white rounded-xl w-9/10 min-h-fit h-2/3 justify-self-center self-center overflow-hidden">
                <div className="flex h-full w-full bg-pink-300">
                    This part contains an image
                </div>
                <div className="flex flex-col h-full w-full bg-white pt-3">
                    <div className="flex flex-col h-fit w-full justify-items-center items-center">
                        <h1 className="text-3xl font-bold text-blue-500">WELCOME</h1>
                        <p className="text-zinc-400 text-xs">Login with Email</p>
                    </div>

                    <br />

                    <div className="justify-items-center">
                        <InputBox label={'Email'} placeholder={"example@gmail.com"} />
                        <br />
                        {!isLogin &&
                            <>
                                <InputBox label={'Password'} type='password' />
                                <br />
                            </>
                        }

                        <InputBox label={isLogin ? 'Password' : 'Validation'} type='password' />
                    </div>


                    {isLogin &&
                        <div className="flex flex-row relative justify-end items-end text-xs">
                            <a>Forgot your password</a>
                        </div>
                    }
                    <motion.div
                        className="flex bg-blue-400 justify-self-center h-fit pt-1 sm:h-1/8 w-1/2 justify-center items-center self-center mt-1 rounded-sm font-serif text-white text-sm"
                        animate={{ opacity: 1, scale: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAuth('11116')}
                    >
                        {
                            isLogin ? 'Login' : 'Sign up'
                        }
                    </motion.div>
                    <br />
                    <hr datacontent="OR" />
                    <br />
                    {/*This need to be complete late on */}
                    <div className="grid-cols-3 self-center relative h-fit w-3/4 min-h-16">
                        {
                            signInMethods.map(item => (
                                <div key={item} className="inline-flex w-1/3 h-1/1">
                                    <motion.div className="inline-flex w-9/10 h-3/4 bg-blue-100 rounded-xl text-xs"
                                        initial={false}
                                        exit={false}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileTap={{ scale: 0.8 }}
                                        transition={{ type: 'spring', duration: 1 }}
                                    >
                                        {item}
                                    </motion.div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex flex-row justify-center h-fit w-1/1 text-xs">
                        <p>{isLogin ? "Don't h" : "H"}ave an account? Let's <a onClick={() => setIsLogin(!isLogin)}
                            className="cursor-pointer"
                        >{isLogin ? 'Login' : 'Sign up'}</a></p>
                    </div>
                </div>
            </form >
        </div >
    );
}

export default Login;