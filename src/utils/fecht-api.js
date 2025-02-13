import axios from "axios";

export const getData = async (code) => {
  const res = await axios.get(
    `https://xoso188.net/api/front/open/lottery/history/list/5/${code}`
  );
  return res.data;
};
