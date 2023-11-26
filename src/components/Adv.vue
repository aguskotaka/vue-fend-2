<template>
    <div>
        <h1>Advertisements</h1>
        <ul>
            <li v-for="adv in ads" :key="adv.id">
                <img v-if="adv.adv_file" :src="getImageUrl(adv.adv_file)" alt="Adv Image" />
                <br>
                <a :href="adv.adv_link">Link : {{ adv.adv_link }} </a>
                <p><strong>Duration : </strong>{{ parseInt(adv.adv_duration_seconds) }}</p>
                <p><strong>Loop Duration : </strong>{{ +adv.adv_loop_seconds }}</p>
                <button @click="deleteAdv(adv.id)">Delete</button>
            </li>
        </ul>

        <form @submit.prevent="createAdv">
            <label for="adv_title">Title:</label>
            <input v-model="newAdv.title" type="text" id="adv_title" required>

            <label for="adv_file">Image:</label>
            <input type="file" @change="onFileChange" id="adv_file" required>

            <label for="adv_link">Link:</label>
            <input v-model="newAdv.link" type="text" id="adv_link">

            <label for="adv_duration_seconds">Duration (seconds):</label>
            <input v-model="newAdv.duration" type="number" id="adv_duration_seconds" min="1" required>

            <label for="adv_loop_seconds">Loop Duration (seconds):</label>
            <input v-model="newAdv.loop" type="number" id="adv_loop_seconds" min="1" required>

            <button type="submit">Create Advertisement</button>
        </form>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            token: localStorage.getItem("token"),
            ads: [],
            newAdv: {
                title: "",
                file: null,
                link: "",
                duration: 0,
                loop: 0,
            },
        };
    },
    mounted() {
        this.fetchAds();
    },
    methods: {
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
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            } else {
                console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
            }
        },
        onFileChange(event) {
            this.newAdv.file = event.target.files[0];
        },
        createAdv() {
            const formData = new FormData();
            formData.append("adv_title", this.newAdv.title);
            formData.append("adv_file", this.newAdv.file);
            formData.append("adv_link", this.newAdv.link);
            formData.append("adv_duration_seconds", this.newAdv.duration);
            formData.append("adv_loop_seconds", this.newAdv.loop);

            axios
                .post("http://127.0.0.1:8000/api/adv", formData, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.ads.push(response.data.data);
                    this.resetForm();
                })
                .catch((error) => {
                    console.error("Error creating advertisement:", error);
                });
        },
        deleteAdv(id) {
            axios
                .delete(`http://127.0.0.1:8000/api/adv/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then(() => {
                    this.ads = this.ads.filter((adv) => adv.id !== id);
                })
                .catch((error) => {
                    console.error("Error deleting advertisement:", error);
                });
        },
        resetForm() {
            this.newAdv.title = "";
            this.newAdv.file = null;
            this.newAdv.link = "";
            this.newAdv.duration = 0;
            this.newAdv.loop = 0;
        },
    },
};
</script>
  