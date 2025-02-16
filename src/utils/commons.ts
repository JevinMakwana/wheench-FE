import Cookies from "js-cookie";

export const cookiesGetItem = (key: string) => {
  const item = Cookies.get(key);
  return item;
};

export const cookiesSetItem = (key: string, value: string, ) => {
  Cookies.set(key, value, { path: "/", domain: window.location.hostname });
};

