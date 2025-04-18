<script setup>
import { ref, watch } from 'vue';
import { useTaskStore } from '../store/task';
import { useModalStore } from '../store/modal';
import { useLoadingStore } from '../store/loading';

const taskStore = useTaskStore();
const modalStore = useModalStore();
const loadingStore = useLoadingStore();

const newData = ref({
  title: '',
  description: '',
  due_date: '',
});
const errors = ref({});
const today = new Date().toISOString().split('T')[0]

// Clear form when modal is opened
watch(
  () => modalStore.modalType,
  (newType) => {
    if (newType === 'add') {
      newData.value = {
        title: '',
        description: '',
        due_date: '',
      };
    }
  },
  { immediate: true }
);

function submitForm() {
  const payload = {
    title: newData.value.title,
    description: newData.value.description,
    due_date: newData.value.due_date,
  };

  errors.value = {};
  loadingStore.setLoading(true);

  taskStore.addTask(payload)
    .then(() => {
      modalStore.closeModal();
      loadingStore.setLoading(false);
    })
    .catch((error) => {
      console.error('Error adding task:', error);
      loadingStore.setLoading(false);
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
      } else {
        console.error('Error updating task:', error);
      }
    });
}
</script>

<template>
  <dialog :open="modalStore.isModalOpen && modalStore.modalType === 'add'"
    class="modal modal-bottom sm:modal-middle z-40">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Add Task</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Title</label>
          <input type="text" v-model="newData.title" class="input input-bordered w-full" required />
          <p v-if="errors.title" class="text-error text-sm mt-1">{{ errors.title[0] }}</p>
        </div>
        <div>
          <label class="block mb-1 font-medium">Description</label>
          <input type="text" v-model="newData.description" class="input input-bordered w-full" />
          <p v-if="errors.description" class="text-error text-sm mt-1">{{ errors.description[0] }}</p>
        </div>
        <div>
          <label class="block mb-1 font-medium">Due Date</label>
          <input type="date" :min="today" v-model="newData.due_date" class="input input-bordered w-full" required />
          <p v-if="errors.due_date" class="text-error text-sm mt-1">{{ errors.due_date[0] }}</p>
        </div>
        <div class="modal-action">
          <button type="submit" class="btn btn-primary">Create</button>
          <form method="dialog">
            <button class="btn" @click="modalStore.closeModal">Close</button>
          </form>
        </div>
      </form>
    </div>
  </dialog>
  <Loading v-if="loadingStore.loading" />
</template>
