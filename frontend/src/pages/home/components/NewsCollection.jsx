


// mock data
const news = [
    {
        name: 'Thành Phố Hồ Chí Minh',
        queryId: '581250825430'
    },
    {
        name: 'Thành Phố Hồ Chí Minh',
        queryId: '581250833430'
    },
    {
        name: 'Thành Phố Hồ Chí Minh',
        queryId: '581250811430'
    },
    {
        name: 'Sạt lở ở Đà Lạt',
        queryId: '209532545432'
    },
    {
        name: 'Sạt lở ở Đà Lạt',
        queryId: '2095323325432'
    },
    {
        name: 'Sạt lở ở Đà Lạt',
        queryId: '209532345932'
    },
    {
        name: 'Sạt lở ở Đà Lạt',
        queryId: '209532345732'
    }
]
export function NewsCollection({ ...props }) {
    // nên định nghĩa hàm để lấy thông tin về bài báo
    // bài báo được chọn nên lưu trữ trong một Context khi người dùng chọn một bài báo nào đó thì context sẽ thay đổi theo bài báo đó và người dùng có thể xem bài báo đó ở trang khác
    return (
        <div {...props}>
            <div >
                <p>News</p>
            </div>
            <div className={`flex flex-col overflow-y-scroll no-scrollbar gap-2 h-[95%]`}>
                {
                    news.map(item => (
                        <div className="bg-pink-400 min-h-20 rounded-xl cursor-pointer pt-1 pl-2"
                            key={item.queryId}
                        >
                            {item.name}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}