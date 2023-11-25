<template>
    <div>
      <h1>User Page</h1>
      <h1>Token:{{ token }}</h1>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
    return {
        posts: [],
        token: localStorage.getItem("token"), // Mengambil token dari penyimpanan lokal
    };
},

    methods: {
      logout() {
        // Menggunakan metode ini untuk mengarahkan ke halaman logout
        this.$router.push("/logout");
      },
    },
  };
  </script>
  