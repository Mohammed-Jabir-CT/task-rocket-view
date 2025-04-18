<script setup>
import { ref } from 'vue';
import AuthLayout from '../components/AuthLayout.vue';
import axiosClient from '../axios';
import router from '../router.js';
import { useLoadingStore } from '../store/loading.js';

const data = ref({
    email: '',
    password: ''
});
const loadingStore = useLoadingStore();

const errorMessage = ref('');

function submitForm() {
    loadingStore.setLoading(true);

    axiosClient.get('/sanctum/csrf-cookie').then(response => {
        axiosClient.post('/api/login', data.value).then(response => {
            loadingStore.setLoading(false);

            router.push({ 'name': 'Home' });
        }).catch(error => {
            loadingStore.setLoading(false);
            errorMessage.value = error.response.data.message;
        });
    });
}
</script>
<template>
    <AuthLayout>
        <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend class="fieldset-legend">Login</legend>
            <form @submit.prevent="submitForm">

                <label class="fieldset-label">Email</label>
                <input v-model="data.email" name="email" id="inputEmail" type="email" class="input" placeholder="Email"
                    required="required" />

                <label class="fieldset-label">Password</label>
                <input v-model="data.password" name="password" type="password" id="inputPassword" class="input"
                    placeholder="Password" required="required">

                <button type="submit" class="btn btn-neutral mt-4">Login</button>
            </form>
            <div>
                <router-link class="link link-sm" to="/register">Register an Account</router-link>
            </div>
            <div v-if="errorMessage" class="text-danger text-center mt-3">
                {{ errorMessage }}
            </div>
        </fieldset>
        <Loading v-if="loadingStore.loading"/>
    </AuthLayout>
</template>