import Cookies from "js-cookie";

export const cookiesGetItem = (key: string) => {
  const item = Cookies.get(key);
  return item;
};

export const cookiesSetItem = (key: string, value: string,) => {
  Cookies.set(key, value, { path: "/", domain: window.location.hostname });
};


export const storeUserInfo = (data: any) => {
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  localStorage.setItem('user', JSON.stringify(data.user)); // Store user details in localStorage
}

export const removeHostingTrip = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  user && delete user.hostingTripId
  storeUserInfo({user});
}