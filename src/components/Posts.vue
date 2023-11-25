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
        <p>Total Comments: {{ post.comment_total }}</p>
        <form @submit.prevent="addComment(post.id)">
          <input v-model="post.newComment" type="text" placeholder="Add a comment..." />
          <button type="submit">Submit</button>
        </form>
        <ul>
          <li v-for="comment in post.comments" :key="comment.id">
            <div v-if="editedCommentId === comment.id">
              <input v-model="editCommentContent" type="text" />
              <button @click="saveEditedComment(comment.id)">Save</button>
              <button @click="cancelEdit">Cancel</button>
            </div>
            <div v-else>
              <p>{{ comment.comments_content }}</p>
              <p v-if="comment.commentator">Commentator: {{ comment.commentator.username }}</p>
              <p v-else>Commentator: </p>
              <div v-if="isCommentAuthor(comment)">
                <button @click="editComment(comment.id)">Edit</button>
                <button @click="deleteComment(comment.id)">Delete</button>
              </div>
            </div>
          </li>
        </ul>
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
      currentUser: {},
      editedCommentId: null,
    };
  },
  methods: {
    getImageUrl(imageFileName) {
      // Replace this with the base URL of your Laravel server
      const baseUrl = 'http://localhost:8000';

      // Construct the full URL for the image
      return `${baseUrl}/storage/posts/${imageFileName}`;
    },
    fetchData() {
  if (this.token) {
    axios
      .get("http://127.0.0.1:8000/api/posts", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((response) => {
        this.posts = response.data.data;

        // Fetch authenticated user data
        axios
          .get("http://127.0.0.1:8000/api/me", {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((userResponse) => {
            this.currentUser = userResponse.data;
          })
          .catch((userError) => {
            console.error("Error fetching user data:", userError);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } else {
    console.error("Token tidak ditemukan. Silakan login terlebih dahulu.");
  }
},


    // INI BAGIAN COMMENT ========================================================================================================================
    isCommentAuthor(comment) {
      console.log('Pengguna ID:', this.currentUser.id);
      console.log('Commentator ID:', comment.commentator ? comment.commentator.id : null);

      return (
        this.token &&
        comment.commentator &&
        comment.commentator.id === this.currentUser.id
      );
    },
    findCommentById(commentId) {
    for (const post of this.posts) {
      const foundComment = post.comments.find((comment) => comment.id === commentId);
      if (foundComment) {
        return foundComment;
      }
    }
    return null;
  },
    addComment(postId) {
      const post = this.posts.find((p) => p.id === postId);

      if (post.newComment) {
        axios
          .post(
            "http://127.0.0.1:8000/api/comment",
            {
              post_id: postId,
              comments_content: post.newComment,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            const newComment = response.data.data;
            post.comments.push(newComment);
            post.newComment = "";
          })
          .catch((error) => {
            console.error('Error adding comment:', error);
          });
      } else {
        console.error('Comment content is required.');
      }
    },
    editComment(commentId) {
    const comment = this.findCommentById(commentId);
    if (comment) {
      this.editedCommentId = commentId;
      this.editCommentContent = comment.comments_content;
    } else {
      console.error(`Comment with ID ${commentId} not found.`);
    }
  },
    saveEditedComment(commentId) {
      axios.patch(`http://127.0.0.1:8000/api/comment/${commentId}`, {
        comments_content: this.editCommentContent,
      }, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
        .then(response => {
          const editedComment = response.data.data;
          const postIndex = this.posts.findIndex(post => post.comments.some(comment => comment.id === commentId));
          const commentIndex = this.posts[postIndex].comments.findIndex(comment => comment.id === commentId);
          this.posts[postIndex].comments.splice(commentIndex, 1, editedComment);
          this.editedCommentId = null;
          this.editCommentContent = '';
        })
        .catch(error => {
          console.error('Error editing comment:', error);
        });
    },

    cancelEdit() {
      this.editedCommentId = null;
      this.editCommentContent = '';
    },

    deleteComment(commentId) {
      axios.delete(`http://127.0.0.1:8000/api/comment/${commentId}`,{
        headers:{
          Authorization: `Bearer ${this.token}`,
        }
      })
        .then(response => {
          const post = this.posts.find(post => post.comments.some(comment => comment.id === commentId));
          const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
          post.comments.splice(commentIndex, 1);
          alert('Comment deleted successfully!');
        })
        .catch(error => {
          console.error('Gagal Menghapus Comment: ', error);
          alert('Failed to delete comment. Please try again.');
        });
    },

    // INI BAGIAN COMMENT ========================================================================================================================

  },
  mounted() {
    this.fetchData();
  }
};
</script>
  