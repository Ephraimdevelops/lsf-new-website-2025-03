import { useEffect, useState } from "react";
import { AppState } from "react-native";

export function useReviewClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = setInterval(refresh, 60_000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);
  return now;
}
