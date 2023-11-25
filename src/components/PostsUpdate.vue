<template>
    <div>
        <h2>Edit Post</h2>
        <form @submit.prevent="updatePost">
            <div>
                <label for="title">Title:</label>
                <input type="text" v-model="post.title" required />
            </div>
            <div>
                <label for="news">News:</label>
                <textarea v-model="post.news" required></textarea>
            </div>
            <div>
                <label for="image">Image:</label>
                <input type="file" @change="onImageChange" />
            </div>
            <div v-if="post.image">
                <img :src="getImageUrl(post.image)" alt="Post Image" style="max-width: 300px; max-height: 200px;" />
            </div>
            <button type="submit">Update Post</button>
        </form>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            post: {
                title: '',
                news: '',
                image: null,
            },
            newImage: null,
        };
    },
    methods: {
        updatePost() {
            const formData = new FormData();
            formData.append('title', this.post.title);
            formData.append('news', this.post.news);

            if (this.newImage) {
                formData.append('image', this.newImage);
            }
            formData.append("_method", "PATCH");

            axios.patch(`http://127.0.0.1:8000/api/posts/${postid}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((response) => {
                    console.log("Post updated", response.data);

                    // Redirect or perform other actions after successful post creation
                })
                .catch((error) => {
                    console.error("Post update failed", error);
                });

            alert('Post updated successfully!');
        },
        onImageChange(e) {
            this.newImage = e.target.files[0];
        },
        getImageUrl(imageName) {
            // Assuming the images are stored in the public storage directory
            return `/storage/posts/${imageName}`;
        },
    },
};
</script>
  
<style scoped>
/* Add your component styles here */
</style>
  