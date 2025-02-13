import { useEffect, useState } from "react";
import { getData } from "../../utils/fecht-api";
import Search from "../../components/Search";
import { mangDai } from "../../utils/mangDai";

const Home = () => {
  const [data, setData] = useState("");
  const [value, setValue] = useState(mangDai[0]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getData("hcmvip").then((res) => setData(res));
  }, []);

  return (
    <div>
      Home
      <Search
        value={value}
        setValue={setValue}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
};

export default Home;
