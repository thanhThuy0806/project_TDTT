import { useState, useContext, createContext } from "react";

const FacilityContext = createContext();

{/*Object facilites gôm
    [
        : tên, số lượng
    ]
*/}
export const FacilityProvider = ({children}) => {
    const [facilities, setFacilities] = useState(() => getFacilities(0, 0, 1));

    return (
        <FacilityContext value={{ facilities, setFacilities}}>
            {children}
        </FacilityContext>
    )
}

export const useFacilities = () => useContext(FacilityContext);

// input: x, y tọa độ trên bản đồ, r bán kính xung quanh khu vực(tính bằng km)
// output: danh sách các cơ sở vật chất được quan tâm trong khu vực
export function getFacilities(x, y, r) {
    // sử dụng API lấy thông tin về khu vực xung quanh
    const facilities = [
        {
            name: 'hospital',
            number: 5
        },
        {
            name: 'gasStation',
            number: 2
        }
    ];

    return facilities;
}