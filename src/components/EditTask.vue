<script setup>
import { ref, watch } from 'vue';
import { useModalStore } from '../store/modal';
import { useTaskStore } from '../store/task';
import { useLoadingStore } from '../store/loading';

const modalStore = useModalStore();
const taskStore = useTaskStore();
const loadingStore = useLoadingStore();

const updateData = ref({
    title: '',
    description: '',
    due_date: '',
    status: false,
});
const errors = ref({});

const taskToUpdate = ref(null);
const today = new Date().toISOString().split('T')[0]

watch(

    () => modalStore.modalType,
    (newType) => {
        if (newType === 'edit' && modalStore.data) {
            taskToUpdate.value = modalStore.data;
            updateData.value = {
                ...modalStore.data,
                status: modalStore.data.status === 1 ? true : false,
            };
        }
    },
    { immediate: true }
);


function updateTask() {

    loadingStore.setLoading(true);

    const payload = {
        title: updateData.value.title,
        description: updateData.value.description,
        due_date: updateData.value.due_date,
        status: updateData.value.status ? 1 : 0,
    };

    errors.value = {};
    taskStore.updateTask(payload, taskToUpdate.value.id)
        .then(() => {
            modalStore.closeModal();
            loadingStore.setLoading(false);
        })
        .catch((error) => {
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
    <dialog :open="modalStore.isModalOpen && modalStore.modalType === 'edit'"
        class="modal modal-bottom sm:modal-middle z-40">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Edit Task</h3>
            <form @submit.prevent="updateTask" class="space-y-4">
                <div>
                    <label class="block mb-1 font-medium">Title</label>
                    <input type="text" v-model="updateData.title" class="input input-bordered w-full" />
                    <p v-if="errors.title" class="text-error text-sm mt-1">{{ errors.title[0] }}</p>
                </div>
                <div>
                    <label class="block mb-1 font-medium">Description</label>
                    <input type="text" v-model="updateData.description" class="input input-bordered w-full" />
                    <p v-if="errors.description" class="text-error text-sm mt-1">{{ errors.description[0] }}</p>
                </div>
                <div>
                    <label class="block mb-1 font-medium">Due Date</label>
                    <input type="date" :min="today" v-model="updateData.due_date" class="input input-bordered w-full" />
                    <p v-if="errors.due_date" class="text-error text-sm mt-1">{{ errors.due_date[0] }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="updateData.status" class="checkbox" />
                    <label>Status</label>
                </div>
                <div class="modal-action">
                    <button type="submit" class="btn btn-primary">Update</button>
                    <form method="dialog">
                        <button class="btn" @click="modalStore.closeModal">Close</button>
                    </form>
                </div>
            </form>
        </div>
    </dialog>
    <Loading v-if="loadingStore.loading" />
</template>
