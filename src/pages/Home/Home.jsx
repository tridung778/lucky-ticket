import { useCallback, useEffect, useState } from "react";
import { getData } from "../../utils/fecht-api";
import Search from "../../components/Search";
import { mangDai } from "../../utils/mangDai";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
  findWinningPrizeNorthSide,
  findWinningPrizeSouthSide,
} from "../../utils/findWinningPrize";
import Swal from "sweetalert2";
import {
  convertLotteryResultsNorthSide,
  convertLotteryResultsSouthSide,
} from "./../../utils/convertLotteryResults";

const Home = () => {
  const [data, setData] = useState(null);
  const [value, setValue] = useState(mangDai[0]); // Giá trị mặc định là phần tử đầu tiên của mảng
  const [inputValue, setInputValue] = useState("");
  const [number, setNumber] = useState();

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getData(value.code);
        if (!res || !res.t) {
          throw new Error("Dữ liệu không hợp lệ");
        }
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
          icon: "error",
          confirmButtonText: "Đóng",
        });
      }
    };
    fetchData();
  }, [value]);

  const handleSearch = useCallback(() => {
    if (!/^\d+$/.test(number)) {
      Swal.fire({
        title: "Vui lòng nhập đúng định dạng số",
        icon: "info",
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (["mb", "mn", "mt"].includes(data.t.navCate)) {
      const results = data.t.issueList.flatMap((item) => {
        let lotteryResults = [];
        const prizes = [];
        if (data.t.navCate === "mb") {
          lotteryResults = convertLotteryResultsNorthSide(item.detail);
          prizes.push(...findWinningPrizeNorthSide(number, lotteryResults));
        }
        if (data.t.navCate === "mn" || data.t.navCate === "mt") {
          lotteryResults = convertLotteryResultsSouthSide(item.detail);
          prizes.push(...findWinningPrizeSouthSide(number, lotteryResults));
        }
        return prizes.length > 0
          ? prizes.map(
              (prize) =>
                `Số ${number} trúng giải ${prize} ngày ${item.turnNum} đài ${data.t.name}`
            )
          : [];
      });

      Swal.fire({
        title: "Kết quả trúng thưởng",
        html:
          results.length > 0
            ? `<div style="text-align: left;">${results.join("<br>")}</div>`
            : `Số ${number} không trúng giải nào`,
        icon: results.length > 0 ? "success" : "info",
        confirmButtonText: "Đóng",
      });
    }
  }, [data, number]);

  return (
    <Box
      sx={{
        height: "80vh", // Full height on small screens, 80vh on medium and larger screens
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        flexDirection: "column",
        my: "auto",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: '"Press Start 2P", cursive',
          textAlign: "center",
          fontSize: { xs: "2.5rem", md: "3.5rem" },
        }}
      >
        Tra vé nhanh 🚀
      </Typography>
      <Typography>
        Một trang web giúp hỗ trợ tra cứu vé số nhanh hơn!
      </Typography>
      {/* Truyền props vào component Search */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column on small screens, row on medium and larger screens
          gap: 2,
          alignItems: "center",
          marginTop: 2,
          width: "100%", // Full width
          maxWidth: "600px", // Max width for larger screens
        }}
      >
        <Search
          value={value}
          setValue={setValue}
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={mangDai} // Full width for Search component
        />
        <TextField
          id="outlined-basic"
          label="Nhập số muốn tìm"
          variant="outlined"
          onChange={(e) => setNumber(e.target.value)}
          sx={{ flex: 1, width: 300 }} // Full width for TextField
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleSearch}
          sx={{ width: { sm: "auto", xs: 300 }, p: 1.5 }}
        >
          Tìm kiếm
        </Button>
      </Box>
      <Typography>
        Copyright ©{" "}
        <span style={{ color: "#5eb7ff" }}>
          <a href="https://www.facebook.com/minhtenladung">tridung778</a>
        </span>
      </Typography>
      {/* Hiển thị dữ liệu từ API */}
      {/* {data && (
        <div>
          <h2>Dữ liệu từ API:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )} */}
    </Box>
  );
};

export default Home;
