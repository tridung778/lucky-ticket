import { useCallback, useEffect, useState } from "react";
import { getData } from "../../utils/fecht-api";
import Search from "../../components/Search";
import { mangDai } from "../../utils/mangDai";
import { Box, Button, TextField, Typography } from "@mui/material";
import { convertLotteryResults } from "../../utils/convertLotteryResults";
import {
  findWinningPrizeNorthSide,
  findWinningPrizeSouthSide,
} from "../../utils/findWinningPrize";
import Swal from "sweetalert2";

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
        const lotteryResults = convertLotteryResults(item.detail);
        const prizes = [];
        if (data.t.navCate === "mb") {
          prizes.push(...findWinningPrizeNorthSide(number, lotteryResults));
        }
        if (data.t.navCate === "mn" || data.t.navCate === "mt") {
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
        padding: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" sx={{ fontFamily: '"Press Start 2P", cursive' }}>
        Tra vé nhanh 🚀
      </Typography>
      {/* Truyền props vào component Search */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <Search
          value={value}
          setValue={setValue}
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={mangDai}
        />
        <TextField
          id="outlined-basic"
          label="Nhập số muốn tìm"
          variant="outlined"
          onChange={(e) => setNumber(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Box>
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
