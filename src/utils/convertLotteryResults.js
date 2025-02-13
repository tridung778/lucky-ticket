export function convertLotteryResults(arrString) {
  const keys = ["G.DB", "G.1", "G.2", "G.3", "G.4", "G.5", "G.6", "G.7"];
  const arr = JSON.parse(arrString);

  const lotteryResults = {};
  arr.forEach((item, index) => {
    lotteryResults[keys[index]] = item.split(",");
  });

  return lotteryResults;
}
