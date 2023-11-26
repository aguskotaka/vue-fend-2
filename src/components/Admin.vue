<template>
    <div>
        <h1>Report Posts</h1>
        <ul>
            <li v-for="post in reportPosts" :key="post.id">
                <h2>{{ post.post.id }}</h2>

                <!-- Check if post.image is defined before using it -->
                <img v-if="post.post.image" :src="getImageUrl(post.post.image)" alt="Post Image" />

                <!-- Display other post details -->
                <h2>{{ post.post.news }}</h2>
                <p>Written by: {{ post.author.username }}</p>
                <p>Reported by: {{ post.report_by.username }}</p>
                <p>Reason: {{ post.reason }}</p>

                <!-- Add a button to trigger the deleteReport method -->
                <button @click="deleteReport(post.post.id)">Delete Report and Post</button>
            </li>
        </ul>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            token: localStorage.getItem('token'),
            reportPosts: [],
        };
    },
    created() {
        this.fetchReportPosts();
    },
    methods: {
        getImageUrl(imageFileName) {
            const baseUrl = 'http://localhost:8000';

            // Check if post.image is already a complete URL
            if (imageFileName.startsWith('http')) {
                return imageFileName;
            }

            // If not, construct the URL with the base URL
            return `${baseUrl}/storage/posts/${imageFileName}`;
        },

        fetchReportPosts() {
            axios.get('http://127.0.0.1:8000/api/reportposts', {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then(response => {
                    this.reportPosts = response.data.data;
                })
                .catch(error => {
                    console.error('Error fetching report posts:', error);
                });
        },

        deleteReport(postId) {
            axios.delete(`http://127.0.0.1:8000/api/reportposts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then(response => {
                    console.log(response.data.message);
                    // Optionally, update the local data to reflect the deleted report and post
                    this.reportPosts = this.reportPosts.filter(post => post.post.id !== postId);
                })
                .catch(error => {
                    console.error('Error deleting report and post:', error);
                });
        },
    },
};
</script>
  