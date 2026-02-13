export const initialStore = () => {
  return {
    message: null,

    token: null,
    coach: null,
    isAuthenticated: false
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

      case "login":
  return {
    ...store,
    token: action.payload.token,
    coach: action.payload.coach,
    isAuthenticated: true
  };

case "logout":
  return {
    ...store,
    token: null,
    coach: null,
    isAuthenticated: false
  };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
  }    
}
