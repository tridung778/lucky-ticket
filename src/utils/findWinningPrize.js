export const findWinningPrize = (number, lotteryResults) => {
  if (!lotteryResults || typeof lotteryResults !== "object") {
    console.error("Invalid lottery results format:", lotteryResults);
    return [];
  }

  const results = [];
  const specialPrize = lotteryResults["G.DB"]?.[0];

  const checkPrize = (category, length) => {
    if (
      lotteryResults[category]?.some((n) => n.endsWith(number.slice(-length)))
    ) {
      results.push(category);
    }
  };

  checkPrize("G.7", 2); // Giải 8
  checkPrize("G.6", 3); // Giải 7
  checkPrize("G.5", 4); // Giải 6
  checkPrize("G.4", 4); // Giải 5
  checkPrize("G.3", 5); // Giải 4
  checkPrize("G.2", 5); // Giải 3
  checkPrize("G.1", 5); // Giải nhì

  if (specialPrize === number) {
    results.push("G.DB"); // Giải đặc biệt
  } else if (specialPrize?.slice(-5) === number.slice(-5)) {
    results.push("G.PhuDB"); // Giải phụ đặc biệt
  } else {
    const diffCount = Array.from(specialPrize || "").filter(
      (digit, i) => digit !== number[i]
    ).length;
    if (diffCount === 1) results.push("G.KhuyenKhich"); // Giải khuyến khích
  }

  return results;
};
