import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutLinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useSelector } from "react-redux";
import { moneyAdapter } from "../../functions/Adapter";

const Featured = () => {
  const { totalOrder, typeMoney } = useSelector((state) => state.global);

  const totalToday = () => {
    var total = 0;
    const today = new Date();
    totalOrder.data?.forEach((item) => {
      const date = new Date(item.created_at);
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
    totalOrder.data?.forEach((item) => {
      const date = new Date(item.created_at);
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
    totalOrder.data?.forEach((item) => {
      const date = new Date(item.created_at);
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

      tempa[0] = tempa[0].replace("$", "").replace(",", "");
      tempb[0] = tempb[0].replace("$", "").replace(",", "");

      return (tempa[0] / tempb[0]) * 100;
    } else if (typeMoney === "VND") {
      tempa = a.replace("VND", "");
      tempb = b.replace("VND", "");
      tempa = tempa.replace(".", "");
      tempb = tempb.replace(".", "");

      return (tempa / tempb) * 100;
    }
  };

  const targetWeek = moneyAdapter(250 * 23000, typeMoney);
  const targetMonth = moneyAdapter(1000 * 23000, typeMoney);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon className="icon" fontSize="small" />
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
                {moneyAdapter(1000 * 23000, typeMoney)}
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

export default Featured;
