import { useEffect, useState } from "react";
import { getData } from "../../utils/fecht-api";
import Search from "../../components/Search";
import { mangDai } from "../../utils/mangDai";
import { Button, TextField } from "@mui/material";
import { convertLotteryResults } from "../../utils/convertLotteryResults";
import { findWinningPrize } from "../../utils/findWinningPrize";

const Home = () => {
  const [data, setData] = useState(null);
  const [value, setValue] = useState(mangDai[0]); // Giá trị mặc định là phần tử đầu tiên của mảng
  const [inputValue, setInputValue] = useState("");
  const [number, setNumber] = useState();
  const [result, setResult] = useState("");

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getData(value.code);
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [value]);

  const handleSearch = () => {
    if (["mb", "mn", "mt"].includes(data.t.navCate)) {
      const results = data.t.issueList.flatMap((item) => {
        const lotteryResults = convertLotteryResults(item.detail);
        const prizes = findWinningPrize(number, lotteryResults) || [];

        if (!Array.isArray(prizes)) {
          console.error("findWinningPrize returned an invalid result:", prizes);
          return [];
        }

        return prizes.length > 0
          ? prizes.map(
              (prize) =>
                `Số ${number} trúng giải ${prize} ngày ${item.turnNum} đài ${data.t.name}`
            )
          : [];
      });

      if (results.length > 0) {
        setResult(results.join("\n"));
      } else {
        setResult(`Số ${number} không trúng giải nào`);
      }
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <div>
        {/* Hiển thị giá trị được chọn và giá trị nhập vào */}
        <p>{`Giá trị được chọn: ${value ? value.name : "null"}`}</p>
        <p>{`Giá trị nhập vào: ${value ? value.code : "null"}`}</p>
      </div>
      {/* Truyền props vào component Search */}
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
      />
      <Button variant="contained" onClick={handleSearch}>
        Tìm kiếm
      </Button>
      <div>{result}</div>
      {/* Hiển thị dữ liệu từ API */}
      {data && (
        <div>
          <h2>Dữ liệu từ API:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
