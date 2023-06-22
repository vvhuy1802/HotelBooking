import "./hotelfeatured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutLinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useSelector } from "react-redux";
import { moneyAdapter } from "../../../functions/Adapter";
import { AddOrder } from "../../../middlewares/order";

const HotelFeatured = () => {
  const { typeMoney, targetThisMonth } = useSelector(
    (state) => state.global
  );
  const { order } = useSelector((state) => state.order);
  const totalToday = () => {
    var total = 0;
    const today = new Date();
    order.forEach((item) => {
      const date = new Date(item.check_in);
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear() &&
        item.status !== "Cancelled"
      ) {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const totalThisWeek = () => {
    const now = new Date(); // Lấy ngày hiện tại
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    ); // Lấy ngày bắt đầu của tuần
    const endOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (6 - now.getDay())
    ); // Lấy ngày kết thúc của tuần
    var total = 0;
    order.forEach((item) => {
      const date = new Date(item.check_in);
      if (
        date >= startOfWeek &&
        date <= endOfWeek &&
        item.status !== "Cancelled"
      ) {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const totalThisMonth = () => {
    const now = new Date(); // Lấy ngày hiện tại
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Lấy ngày bắt đầu của tháng
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Lấy ngày kết thúc của tháng

    var total = 0;
    order.forEach((item) => {
      const date = new Date(item.check_in);
      if (
        date >= startOfMonth &&
        date <= endOfMonth &&
        item.status !== "Cancelled"
      ) {
        total += item.total;
      }
    });
    return moneyAdapter(total, typeMoney);
  };

  const compare = (a, b) => {
    if (typeMoney === "USD") {
      var tempa = a.split(".");
      var tempb = b.split(".");

      tempa[0] = tempa[0].replace("$", "").replace(",", "");
      tempb[0] = tempb[0].replace("$", "").replace(",", "");

      return tempa[0] - tempb[0];
    } else if (typeMoney === "VND") {
      tempa = a.replace("VND", "");
      tempb = b.replace("VND", "");
      tempa = tempa.replace(".", "");
      tempb = tempb.replace(".", "");

      return tempa - tempb;
    }
  };

  const percentToday = (a, b) => {
    if (typeMoney === "USD") {
      var tempa = a.split(".");
      var tempb = b.split(".");

      tempa[0] = tempa[0].replace("$", "").replace(/,/g, "");
      tempb[0] = tempb[0].replace("$", "").replace(/,/g, "");

      return ((tempa[0] / tempb[0]) * 100).toFixed(2);
    } else if (typeMoney === "VND") {
      tempa = a.replace("VND", "");
      tempb = b.replace("VND", "");
      tempa = tempa.replace(/\./g, "");
      tempb = tempb.replace(/\./g, "");

      return ((tempa / tempb) * 100).toFixed(2);
    }
  };

  const targetWeek = moneyAdapter((targetThisMonth / 4) * 23000, typeMoney);
  const targetMonth = moneyAdapter(targetThisMonth * 23000, typeMoney);

  const handleAddVirtualData = async () => {
    const id_user = [
      "640ac9668df7f8a1209eebc1",
      "6410ac705b9b6e3be5bb05e0",
      "640aca4c8df7f8a1209eebc4",
      "641345867aaa3bc49837d05c",
    ];
    const data_room_hotel = [
      {
        id_hotel: "raondalat",
        id_room: [
          "6400be1bf2a68a5c0483e175",
          "6400be5ef2a68a5c0483e179",
          "6400be98f2a68a5c0483e17d",
          "6400bebff2a68a5c0483e181",
        ],
      },
      {
        id_hotel: "aaronhotel",
        id_room: [
          "6400b92396d921ff1835ffa8",
          "6400ba36f2a68a5c0483e131",
          "6400ba56f2a68a5c0483e135",
          "6400ba89f2a68a5c0483e139",
        ],
      },
      {
        id_hotel: "amishotel",
        id_room: [
          "6400bae0f2a68a5c0483e13d",
          "6400bb29f2a68a5c0483e141",
          "6400bb57f2a68a5c0483e145",
          "6400bb7df2a68a5c0483e149",
          "6400bb9ff2a68a5c0483e14d",
        ],
      },
      {
        id_hotel: "azuraresort",
        id_room: [
          "6400bc11f2a68a5c0483e153",
          "6400bc32f2a68a5c0483e157",
          "6400bc4ef2a68a5c0483e15b",
          "6400bc7ff2a68a5c0483e15f",
        ],
      },
      {
        id_hotel: "maybungalow",
        id_room: [
          "6400bd11f2a68a5c0483e165",
          "6400bd81f2a68a5c0483e169",
          "6400bda9f2a68a5c0483e16d",
          "6400bdcbf2a68a5c0483e171",
        ],
      },
    ];
    const total = [
      1300000, 1442828, 800000, 900000, 1200000, 200000, 600000, 700000,
      1000000, 1500000, 1800000, 2500000, 3000000, 3500000, 4000000, 4500000,
      5000000,
    ];

    function randomDate(startDate, endDate) {
      let start = startDate.getTime();
      let end = endDate.getTime();
      let random = Math.floor(Math.random() * (end - start)) + start;
      return new Date(random);
    }

    function addDays(date, days) {
      let timestamp = date.getTime();
      timestamp += days * 24 * 60 * 60 * 1000;
      return new Date(timestamp);
    }

    for (let i = 0; i < 512; ) {
      const r = Math.floor(Math.random() * data_room_hotel.length);

      let start = randomDate(new Date(2021, 0, 1), new Date(2023, 6, 22));
      let end = addDays(start, Math.floor(Math.random() * 10));

      start = `${start.getFullYear()}-${
        start.getMonth() + 1
      }-${start.getDate()}`;
      end = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

      const temp = {
        id_user: id_user[Math.floor(Math.random() * id_user.length)],
        id_room:
          data_room_hotel[r].id_room[
            Math.floor(Math.random() * data_room_hotel[r].id_room.length)
          ],
        id_hotel: data_room_hotel[r].id_hotel,
        total: total[Math.floor(Math.random() * total.length)],
        check_in: start,
        check_out: end,
        status: "Completed",
        paymented: true,
      };

      await AddOrder(temp).then((res) => {
        if (res.status === 200) {
          i++;
          console.log("success");
        } else {
          console.log(res);
        }
      });
    }
  };

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon
          className="icon"
          fontSize="small"
          onClick={() => {
            // handleAddVirtualData();
          }}
        />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={percentToday(totalToday(), targetMonth)}
            text={`${percentToday(totalToday(), targetMonth)}%`}
            strokeWidth={3}
          />
        </div>
        <p className="title">Total orders made today</p>
        <p className="amount">{totalToday()}</p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult positive">
              <div className="resultAmount">
                {moneyAdapter(30000 * 23000, typeMoney)}
              </div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">This Week</div>
            <div
              className={`itemResult ${
                compare(totalThisWeek(), targetWeek) < 0
                  ? "negative"
                  : "positive"
              }`}
            >
              {compare(totalThisWeek(), targetWeek) < 0 ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowUpOutLinedIcon fontSize="small" />
              )}
              <div className="resultAmount">{totalThisWeek()}</div>
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">This Month</div>
            <div
              className={`itemResult ${
                compare(totalThisMonth(), targetMonth) < 0
                  ? "negative"
                  : "positive"
              }`}
            >
              {compare(totalThisMonth(), targetMonth) < 0 ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowUpOutLinedIcon fontSize="small" />
              )}
              <div className="resultAmount">{totalThisMonth()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelFeatured;
