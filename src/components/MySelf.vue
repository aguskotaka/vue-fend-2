<template>
    <div>
        <h1>Profil Saya</h1>
        <div v-if="user">
            <p><strong>Nama : </strong>{{ user.username }}</p>
            <p><strong>Nama : </strong>{{ user.email }}</p>
        </div>
        <div v-else>
            <p>Sudah Login kah ?</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            token: localStorage.getItem("token"),
            user: null,
        };
    },
    mounted() {
        this.fetchUser();
    },
    methods: {
        fetchUser() {
            if (this.token) {
                axios
                    .get("http://127.0.0.1:8000/api/me", {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    })
                    .then((response) => {
                        this.user = response.data;
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            } else {
                console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
            }
        },
    },
};  
</script>