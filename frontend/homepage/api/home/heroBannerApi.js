/* File này chứa các thông tin Lấy thông tin cho Hero Banner
* nằm ở Header của trang web
* các hàm luôn trả về object chứa các thông tin liên quan đến thời tiết,
    xã hội, con người... và hình ảnh minh họa ví dụ như mưa nhiều thì sẽ có bức ảnh trời mưa
*/



// các trường của Object: title, short description, path( dẫn tới bài báo), src(ảnh minh họa cho hero banner)


// hàm này có thể mở rộng để lấy thêm nhiều tham số
// input: topic - chủ đề được bàn tới ví dụ như thời tiết
//          date - có thể lấy thông tin từ nhiều ngày
// output: object về thông tin cần lưu ý
// mock data
export async function getInformation(topic, date, xCorr, yCorr) {
    return ({
        topic: 'weather',
        place: {
            provice: 'Tay Ninh',
            country: 'Viet Nam',
            detail: 'Ba Den Mountain',
            // số sai đấy:)
            x: 101.111,
            y: 101.111
        },
        date: '2026-03-28',
        detail: {
            describe: 'A sunny day',
            tempature: 30,      // Celcius
            uv: 0.5,
            humid: 0.65,
            windSpeed: 10       // m/s
        },
        src: '/path-to-images'
    })
}