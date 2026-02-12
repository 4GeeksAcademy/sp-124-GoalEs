export const initialStore = () => {
  return {
    message: null,
    token: null,
    user: null,
    isAuthenticated: false
  }
}


export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'login':
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        role: action.payload.role,
        isAuthenticated: true
      };

    case 'logout':
      return {
        ...store,
        token: null,
        user: null,
        role: null,
        isAuthenticated: false
      };

    default:
      throw Error('Unknown action.');
  }
}

