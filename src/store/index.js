import { createStore } from "vuex";

/*Persitencia de datos con localStorage*/
const StoredUser = localStorage.getItem("user");

export default createStore({
  state: {
    user: StoredUser ? JSON.parse(StoredUser) : null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
  actions: {
    login({ commit }, user) {
      commit("setUser", user);
    },
    /*limpio la información del usuario */
    logout({ commit }) {
      commit("setUser", null);
      localStorage.removeItem("user");
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  modules: {},
});
