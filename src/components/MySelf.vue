<template>
    <div>
        <h1>Profil Saya</h1>
        <div v-if="user">
            <p><strong>Nama : </strong>{{ user.username }}</p>
            <p><strong>Email : </strong>{{ user.email }}</p>
            <p><strong>Level : </strong>{{ user.level }}</p>
        </div>
        <div v-else>
            <p>Sudah Login kah ?</p>
        </div>

        <div v-if="showAdvertisement">
            <p><strong>Adv Title: </strong>{{ currentAdvertisement.adv_title }}</p>
            <img v-if="currentAdvertisement.adv_file" :src="getImageUrl(currentAdvertisement.adv_file)" alt="Adv Image" />
                <br>
            <p><strong>Adv File: </strong>{{ currentAdvertisement.adv_file }}</p>
            <p><strong>Adv Link: </strong><a :href="currentAdvertisement.adv_link">{{ currentAdvertisement.adv_link }}</a>
            </p>
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
            ads: [], // Add this line
            showAdvertisement: false,
            currentAdvertisement: {},
        };
    },
    mounted() {
        this.fetchUser();
        this.fetchAds();
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
        getImageUrl(imageFileName) {
            const baseUrl = 'http://localhost:8000';
            if (imageFileName.startsWith('http')) {
                return imageFileName;
            }
            return `${baseUrl}/storage/adv_file/${imageFileName}`;
        },
        fetchAds() {
            if (this.token) {
                axios
                    .get("http://127.0.0.1:8000/api/adv", {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    })
                    .then((response) => {
                        this.ads = response.data;
                        this.displayAdvertisements();
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            } else {
                console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
            }
        },
        displayAdvertisements() {
            // Implement logic to display advertisements based on duration and loop
            // For simplicity, just display the first advertisement for now.
            if (this.ads.length > 0) {
                this.showAdvertisement = true;
                this.currentAdvertisement = this.ads[0];
                // Set a timeout to hide the advertisement after its duration
                setTimeout(() => {
                    this.showAdvertisement = false;
                }, this.currentAdvertisement.adv_duration_seconds * 1000); // Convert seconds to milliseconds

                // Set an interval to display the next advertisement after its loop duration
                setInterval(() => {
                    this.showAdvertisement = true;
                    this.currentAdvertisement = this.ads[0];
                    setTimeout(() => {
                        this.showAdvertisement = false;
                    }, this.currentAdvertisement.adv_duration_seconds * 1000);
                }, this.currentAdvertisement.adv_loop_seconds * 1000); // Convert seconds to milliseconds
            }
        },
    },
};
</script>
  