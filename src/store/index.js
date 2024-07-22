import { createStore } from "vuex";

/*Persitencia de datos con localStorage*/
const StoredUser = localStorage.getItem("user");

export default createStore({
  state: {
    user: StoredUser ? JSON.parse(StoredUser) : null,
  },
  mutations: {
    /*actualizo el state user y también guardo el usuario en localStorage*/
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
  actions: {
    /*accion que reacciona al Login "dispatch" */
    login({ commit }, user) {
      commit("setUser", user);
    },
    /*limpio la información del usuario */
    // logout({ commit }) {
    //   commit("setUser", null);
    //   localStorage.removeItem("user");
    // },
  },
  //para poder acceder a state
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  modules: {},
});
