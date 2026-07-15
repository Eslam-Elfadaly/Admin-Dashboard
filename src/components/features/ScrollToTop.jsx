import { useEffect } from "react";
import { useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();

   useEffect(() => {
    document
      .getElementById("main-content")
      ?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }, [pathname]);

  return null;
}

export default ScrollToTop;