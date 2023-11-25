<template>
    <div>
        <h1>Create Post</h1>
        <form @submit.prevent="createPost">
            <div>
                <label for="image">Image:</label>
                <input type="file" id="image" ref="image" accept="image/*" @change="onImageChange" />
            </div>
            <div>
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="title" />
            </div>
            <div>
                <label for="news">Paragraph:</label>
                <textarea id="news" v-model="news"></textarea>
            </div>
            <button type="submit">Create Post</button>
        </form>
    </div>
</template>
  
<script>
import axios from "axios";

export default {
    data() {
        return {
            image: null,
            title: "",
            news: "",
        };
    },
    methods: {
        onImageChange(e) {
            this.image = e.target.files[0];
        },
        createPost() {
            const formData = new FormData();
            formData.append("image", this.image);
            formData.append("title", this.title);
            formData.append("news", this.news);

            axios
                .post("http://127.0.0.1:8000/api/posts", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((response) => {
                    console.log("Post created", response.data);

                    // Redirect or perform other actions after successful post creation
                })
                .catch((error) => {
                    console.error("Post creation failed", error);
                });
        },
    },
};
</script>
  