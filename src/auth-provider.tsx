import { AuthProvider } from "react-admin";

async function fetchUserInfo() {
  const response = await fetch("/api/portal/userinfo");
  const userInfo = await response.json();
  return userInfo;
}

const authProvider: AuthProvider = {
  login: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  getIdentity: () => fetchUserInfo(),
  getPermissions: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

export default authProvider;
