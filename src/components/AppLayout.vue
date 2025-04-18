<script setup>
import { RouterView } from 'vue-router';
import axiosClient from '../axios';
import router from '../router';

function logout() {
  axiosClient.post('/api/logout').then(response => {
    router.push({ name: 'Login' });
  });
}
</script>

<template>
    <header class="flex p-2 justify-between items-center">
        <h2 class="btn btn-ghost font-mono">Task Rocket</h2>
        <div class="flex items-center justify-center gap-1">
            <button @click="logout" class="btn btn-sm btn-error">Logout</button>
        </div>
    </header>
    <main>
        <RouterView />
    </main>
</template>