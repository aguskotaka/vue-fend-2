import axios from 'axios';

const state = {
  currentUser: null,
  token: null,
};

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  CLEAR_AUTH_DATA(state){
    state.currentUser= null;
    state.token= null;
  }
};

const actions = {
  login({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      axios
        .post("http://127.0.0.1:8000/api/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          const { user, token } = response.data;

          // Store user and token in Vuex state
          commit("SET_CURRENT_USER", user);
          commit("SET_TOKEN", token);

          // Save token in localStorage
          localStorage.setItem("token", token);

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logout({commit}){
    const token = localStorage.getItem("token");
        if (token) {
            axios.post("http://127.0.0.1:8000/api/logout", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Logout berhasil", response.data);

                commit('CLEAR_AUTH_DATA');
                localStorage.removeItem('token');
                this.$router.push("/login");
            })
            .catch((error) => {
                console.error("Logout gagal", error);
            });
        } else {
            console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
        }
    
  },
};

const getters = {
  getCurrentUser: (state) => state.currentUser,
  getToken: (state) => state.token,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
