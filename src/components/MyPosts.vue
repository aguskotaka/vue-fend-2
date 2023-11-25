<template>
    <div>
        <h1>Daftar Post</h1>
        <p>Token: {{ token }}</p>
        <ul>
            <li v-for="post in posts" :key="post.id">
                <img :src="getImageUrl(post.image)" alt="Post Image" />
                <h3>{{ post.title }}</h3>
                <p>{{ post.news }}</p>
                <p>Author: {{ post.writer.username }}</p>
                <button @click="deletePost(post.id)">Hapus</button>
                <button @click="editPost(post)">Edit</button>

                <div v-if="post.editing">
                    <form @submit.prevent="updatePost(post)">
                        <label>Title :</label>
                        <input v-model="post.updatedTitle" required />
                        <label>News :</label>
                        <textarea v-model="post.updatedNews" required></textarea>
                        <label>Image :</label>
                        <input type="file" id="image" ref="image" @change="onFileChange($event, post)" accept="image/*" />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </li>
        </ul>
    </div>
</template>
  
<script>
import axios from "axios";

export default {
    data() {
        return {
            email: "",
            password: "",
            token: localStorage.getItem("token"),
            posts: [],
        };
    },
    methods: {
        getImageUrl(imageFileName) {
            const baseUrl = 'http://localhost:8000';
            return `${baseUrl}/storage/posts/${imageFileName}`;
        },
        fetchData() {
            if (this.token) {
                axios
                    .get("http://127.0.0.1:8000/api/myposts", {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    })
                    .then((response) => {
                        this.posts = response.data.data.map((post) => ({
                            ...post,
                            editing: false,
                            updatedTitle: post.title,
                            updatedNews: post.news,
                            updatedImage: null,
                        }));
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            } else {
                console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
            }
        },
        deletePost(postId) {
            if (this.token) {
                axios
                    .delete(`http://127.0.0.1:8000/api/posts/${postId}`, {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    })
                    .then(() => {
                        this.fetchData();
                    })
                    .catch((error) => {
                        console.error("Error deleting post:", error);
                    });
            } else {
                console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
            }
        },
        editPost(post) {
            post.editing = true;
        },
        updatePost(post) {
            if (this.token) {
                const formData = new FormData();
                formData.append("title", post.updatedTitle);
                formData.append("news", post.updatedNews);

                

                // Check if the image is present
                if (post.updatedImage) {
                    formData.append("image", post.updatedImage);
                }

                formData.append("_method", "PATCH");
                console.log(formData);
                axios
                    .post(`http://127.0.0.1:8000/api/posts/${post.id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then(() => {
                        post.editing = false;
                        this.fetchData();
                    })
                    .catch((error) => {
                        console.error("Error updating post:", error);
                    });
            } else {
                console.error("Token belum ada, Login dulu ya.");
            }
        },
        onFileChange(event, post) {
    post.updatedImage = event.target.files[0];
},

        
    },
    mounted() {
        this.fetchData();
    },
};
</script>
  