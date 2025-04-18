<script setup>
import img from '@/assets/images/lara.jpg';
import axiosClient from '../axios';
import router from '../router';
import AddTask from '../components/AddTask.vue';
import { computed, onMounted, ref } from 'vue';
import { useTaskStore } from '../store/task';
import { useModalStore } from '../store/modal';
import DeleteTask from '../components/DeleteTask.vue';
import EditTask from '../components/EditTask.vue';
import { useLoadingStore } from '../store/loading';

const taskStore = useTaskStore();
const modalStore = useModalStore();
const loadingStore = useLoadingStore();

function openAddModal() {
  modalStore.openModal('add');
}

function openEditModal(task) {
  modalStore.openModal('edit', task);
}

function openDeleteModal(id) {
  modalStore.openModal('delete', id);
}

function markAsCompleted(taskId, value) {

  
  const payload = {
    status: value,
  };
  
  loadingStore.setLoading(true);

  taskStore.markAsCompleted(payload, taskId)
    .then(() => {
      modalStore.closeModal();
      loadingStore.setLoading(false);
    })
    .catch((error) => {
      console.error('Error updating task:', error);
      loadingStore.setLoading(false);
    });
}

const tasks = computed(() => taskStore.tasks);

onMounted(() => {
  taskStore.fetchTasks();
  console.log(tasks.value);

})
</script>
<template>


  <div class="m-6 shadow rounded-box">
    <div class="flex items-center justify-between px-6 py-2">
      <h1 class="font-semibold">My Tasks</h1>
      <button @click="openAddModal" class="btn btn-sm btn-success">New +</button>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in tasks" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.due_date }}</td>
            <td>
              <select @change="markAsCompleted(task.id, $event.target.value)" class="select select-xs w-fit text-success-content"
                :class="task.status == 0 ? 'select-error  ' : 'select-success'">
                <option :selected="task.status == 1" value="1">Completed</option>
                <option :selected="task.status == 0" value="0">Pending</option>
              </select>
            </td>
            <td class="flex gap-1">
              <button @click="openEditModal(task)" class="btn btn-xs btn-outline btn-warning">Edit</button>
              <button @click="openDeleteModal(task.id)" class="btn btn-xs btn-outline btn-error">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <AddTask />
  <EditTask />
  <DeleteTask />
  <Loading v-if="loadingStore.loading"/>
</template>