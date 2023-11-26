import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import MySelf from "../components/MySelf.vue";
import UserPage from "../components/UserPage.vue";
import Login from "../components/login.vue";
import Register from "../components/Register.vue";
import Logout from "../components/Logout.vue";
import Posts from "../components/Posts.vue";
import Admin from "../components/Admin.vue";
import Adv from "../components/Adv.vue";
import MyPosts from "../components/MyPosts.vue";
import PostsCreate from "../components/PostsCreate.vue";
import PostsUpdate from "../components/PostsUpdate.vue";

const routes = [
  { path: "/userpage", component: UserPage },
  { path: "/home", component: Home },
  { path: "/myself", component: MySelf },
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/register", component: Register },
  { path: "/postscreate", component: PostsCreate},
  { path: "/postsupdate/:postId", name: "PostUpdate", component: PostsUpdate, props: true },
  { path: "/posts", component: Posts},
  { path: "/admin", component: Admin},
  { path: "/adv", component: Adv},
  { path: "/myposts", component: MyPosts},
  // ...rute-rute lainnya sesuai kebutuhan Anda
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
