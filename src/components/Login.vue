<template>
    <div>
      <h1>Login Page</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      handleLogin() {
        this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        })
          .then(() => {
            this.$router.push("/posts");
          })
          .catch((error) => {
            console.error("Login failure", error);
          });
      },
    },
  };
  </script>
  