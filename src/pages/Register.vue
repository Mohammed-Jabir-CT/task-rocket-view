<script setup>
import { ref } from 'vue';
import axiosClient from '../axios';
import router from '../router';
import AuthLayout from '../components/AuthLayout.vue';
import { useLoadingStore } from '../store/loading';

const loadingStore = useLoadingStore();
const data = ref({
    fullname: '',
    email: '',
    password: '',
    passwordConfirmation: '',
});
const errorMessage = ref('');

function submitForm() {
    loadingStore.setLoading(true);

    const payload = {
        fullname: data.value.fullname,
        email: data.value.email,
        password: data.value.password,
        password_confirmation: data.value.passwordConfirmation,
    };

    axiosClient.get('/sanctum/csrf-cookie').then(() => {
        axiosClient.post('/api/register', payload).then(() => {
            loadingStore.setLoading(false);
            router.push({ name: 'Home' });
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
            <legend class="fieldset-legend">Register</legend>
            <form @submit.prevent="submitForm">

                <label class="fieldset-label">Full Name</label>
                <input v-model="data.fullname" name="fullname" type="text" id="fullname" class="input"
                    placeholder="Full Name" required autofocus />

                <label class="fieldset-label">Email</label>
                <input v-model="data.email" name="email" type="email" id="inputEmail" class="input"
                    placeholder="Email" required />

                <label class="fieldset-label">Password</label>
                <input v-model="data.password" name="password" type="password" id="inputPassword" class="input"
                    placeholder="Password" required />

                <label class="fieldset-label">Confirm Password</label>
                <input v-model="data.passwordConfirmation" name="password_confirmation" type="password"
                    id="confirmPassword" class="input" placeholder="Confirm Password" required />

                <button type="submit" class="btn btn-neutral mt-4">Register</button>
            </form>

            <div>
                <router-link class="link link-sm" to="/login">Already Have an Account? Log In</router-link>
            </div>

            <div v-if="errorMessage" class="text-error text-center mt-3">
                {{ errorMessage }}
            </div>
        </fieldset>
        <Loading v-if="loadingStore.loading"/>
    </AuthLayout>
</template>
