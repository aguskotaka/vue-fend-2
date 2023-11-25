<template>
    <div>
        <h1>Logout Page</h1>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    methods: {
        handleLogout() {
            this.$store.dispatch("logout")
                .then(() => {
                    this.$router.push("/login");
                })
                .catch((error) => {
                    console.error("Logout failure", error);
                });
        },
    },
};
</script>
