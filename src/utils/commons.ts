import Cookies from "js-cookie";

export const cookiesGetItem = (key: string) => {
    const item = Cookies.get(key);
    return item;
  };