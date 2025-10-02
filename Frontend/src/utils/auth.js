export const logout = () => {
  localStorage.removeItem("token"); // Remove JWT
  window.location.href = "/login";   // Redirect to login page
};
