<template>
    <div>
        <h1>Register Page</h1>
        <form @submit.prevent="register">
            <input type="email" v-model="email" placeholder="Email">
            <input type="text" v-model="username" placeholder="Username">
            <input type="password" v-model="password" placeholder="Password">
            <button type="submit">Register</button>
        </form>
    </div>
</template>
  
<script>
import axios from "axios";

export default {
    data() {
        return {
            email: "",
            username: "",
            password: "",
        };
    },
    methods: {
        register() {
            // Mengirim permintaan registrasi ke API Laravel
            axios
                .post("http://127.0.0.1:8000/api/register", {
                    email: this.email,
                    username: this.username,
                    password: this.password,
                })
                .then((response) => {
                    // Tangani respons sukses (misalnya, arahkan pengguna ke halaman login)
                    console.log("Registrasi berhasil", response.data);

                    // Contoh: Redirect ke halaman login
                    this.$router.push("/login");
                })
                .catch((error) => {
                    // Tangani kesalahan (misalnya, tampilkan pesan kesalahan)
                    console.error("Kesalahan saat registrasi", error);
                });
        },
    },
};
</script>
  