import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "./components/AppLayout.vue";
import Login from "./pages/Login.vue";
import Home from "./pages/Home.vue";
import Register from "./pages/Register.vue";
import useUserStore from "./store/user";

const routes = [
    {
        path: "/",
        component: AppLayout,
        children: [
            {
                path: "/",
                name: "Home",
                component: Home
            }
        ],
        beforeEnter: async (to, from, next) => {
            try {
                const userStore = useUserStore();
                await userStore.fetchUser();
                next();
            } catch (error) {
                next(false); // Cancel navigation if data fetching fails
            }
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/"
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;