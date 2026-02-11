import { useEffect, useState } from "react";

function formatRemaining(expiryDate) {
  if (!expiryDate) return "Expired";

  const ms =
    typeof expiryDate === "number"
      ? (expiryDate < 1e12 ? expiryDate * 1000 : expiryDate)
      : Date.parse(expiryDate);

  if (!Number.isFinite(ms)) return "Expired";

  const diff = ms - Date.now();
  if (diff <= 0) return "Expired";

  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return `${h}h ${m}m ${sec}s`;
}

function Countdown({ expiryDate }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <>{formatRemaining(expiryDate)}</>;
}

export default Countdown;