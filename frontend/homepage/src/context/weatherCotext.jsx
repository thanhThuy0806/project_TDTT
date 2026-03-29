/* Chứa thông tin toàn cục về thời tiết hiện tại
    thời tiết hiện tại là thời tiết của địa điểm mà người sử dụng chọn trước tại thời điểm hiện tại
*/

import { createContext, useContext, useState } from "react";


export const WeatherContext = createContext();

/* Object curWeather {
    'name',
    'temparture',
    'humid',
    'windSpeed',
    'UV',
    'otherInfor'
} */
export const WeatherProvider = ({children}) => {
    // nên lấy thông tin tại vị trí mặc định là GPS cho lần khởi tại đầu tiên
    // hoặc vị trí thủ đố của quốc gia người sử dụng ở
    const [curWeather, setCurWeather] = useState(getCurWeather(0,0));

    return (
        <WeatherContext.Provider value={{curWeather, setCurWeather}}>
        {children}
        </WeatherContext.Provider>
    );
}

export const useCurWeather = () => useContext(WeatherContext);

export const getCurWeather = (x, y) => {
    // thực hiện call API thời tiết và trả về kêt quả thời tiết gồm
    // các trường về thông tin thời tiết như trên, hiện tại chỉ sử dụng mock data
    // dùng useEffect hoặc TansackQuery
    const weather = {
        name: 'sunny',
        temparture: 26,
        humid: 0.75,
        windSpeed: 15,
        uv: 0.84,
        otherInfor: 'the is a mock data'
    }

    return weather;
}