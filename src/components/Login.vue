<template>
  <div>
    <h1>Login Page</h1>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>

    <div v-if="showAdvertisement">
      <h1><strong>{{ currentAdvertisement.adv_title }}</strong></h1>
      <img v-if="currentAdvertisement.adv_file" :src="getImageUrl(currentAdvertisement.adv_file)" alt="Adv Image" />
      <br>
      <h3><strong>Link: </strong><a :href="currentAdvertisement.adv_link">{{ currentAdvertisement.adv_link }}</a></h3>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: "",
      password: "",
      ads:[],
      showAdvertisement: false,
      currentAdvertisement: {},
    };
  },
  mounted() {
    this.fetchAds();
  },
  methods: {
    handleLogin() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      })
      .then((response) => {
          console.log("Login successful. Response:", response);
          const level = response.data.level;
          console.log("User level:", level);
          if (level === 'admin') {
            this.$router.push("/admin");
          } else {
            this.$router.push("/posts");
          }
        })
        .catch((error) => {
          console.error("Login failure", error);
        });
    },
    getImageUrl(imageFileName) {
      const baseUrl = 'http://localhost:8000';
      if (imageFileName.startsWith('http')) {
        return imageFileName;
      }
      return `${baseUrl}/storage/adv_file/${imageFileName}`;
    },
    fetchAds() {
      axios
        .get("http://127.0.0.1:8000/api/adv", {
        })
        .then((response) => {
          this.ads = response.data;
          this.displayAdvertisements();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      },
      displayAdvertisements() {
      if (this.ads.length > 0) {
        this.showAdvertisement = true;
        this.currentAdvertisement = this.ads[0];
        setTimeout(() => {
          this.showAdvertisement = false;
          this.displayAdvertisements(); // Call the function again for the loop
        }, this.currentAdvertisement.adv_duration_seconds * 1000);
      }
    },
  },
};
</script>
  