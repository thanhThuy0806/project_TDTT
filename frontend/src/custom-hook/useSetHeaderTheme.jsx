import { createContext, useContext, useEffect, useState } from "react";



/*
    Custom hook for changing the background of the header of the home page
*/
const headerImages = [
    '/src/assets/images/german-bridge.jpg',
    '/src/assets/images/vn-food.jpg',
    '/src/assets/images/plane-wing.jpg',
    '/src/assets/images/hotel.jpg',
]


const HeaderThemeContext = createContext(null);

export const HeaderThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        theme: headerImages[0],
        index: 0,
        direction: 0
    });
    const updateTheme = (imagePath) => {
        const idx = headerImages.findIndex(image => image === imagePath);

        setTheme(prev => ({
            theme: imagePath,
            index: idx,
            direction: idx > prev.index ? 1 : -1
        }));
    }

    // cached header images
    useEffect(() => {
        headerImages.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return (
        <HeaderThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </HeaderThemeContext.Provider>
    );
}
export const useHeaderTheme = () => {
    const context = useContext(HeaderThemeContext);
    if (!context) {
        throw new Error('useHeaderTheme must be used within HeaderThemeProvider');
    }

    return context;
}