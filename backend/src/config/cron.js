import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 2000) console.log("Làm mới dữ liệu thành công");
      else
        console.log(
          "Làm mới dữ liệu thất bại với mã trạng thái: ",
          res.statusCode
        );
    })
    .on("error", (err) => {
      console.log("Lỗi khi làm mới dữ liệu: ", err.message);
    });
});

export default job;
