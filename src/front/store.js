export const initialStore = () => {
  const token = localStorage.getItem("token-user");
  const user = localStorage.getItem("user");

  return {
    message: null,
    token: token || null,
    user: user ? JSON.parse(user) : null,
    coach: null,
    isAuthenticated: token ? true : false,
  };
};


export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "login-user":
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case "logout-user":
      return {
        ...store,
        token: null,
        user: null,
        isAuthenticated: false,
      };

    case "login-coach":
      return {
        ...store,
        token: action.payload.token,
        coach: action.payload.coach,
        isAuthenticated: true,
      };

      case "is-authenticated":
        return {
          ...store,
          isAuthenticated: true
        }

    case "logout-coach":
      return {
        ...store,
        token: null,
        coach: null,
        isAuthenticated: false,
      };

      case 'login_admin':
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        role: action.payload.role,
        isAuthenticated: true
      };

    case 'logout_admin':
      return {
        ...store,
        token: null,
        user: null,
        role: null,
        isAuthenticated: false
      };

    default:
      throw Error("Unknown action.");
  }
}
