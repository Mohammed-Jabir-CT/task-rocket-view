<script setup>
import { useModalStore } from '@/store/modal';
import { useTaskStore } from '../store/task';
import { useLoadingStore } from '../store/loading';
const modalStore = useModalStore();
const taskStore = useTaskStore();
const loadingStore = useLoadingStore();


function confirmDelete() {
    if (modalStore.data) {
        loadingStore.setLoading(true);

        taskStore.deleteTask(modalStore.data)
            .then(() => {
                modalStore.closeModal();
                loadingStore.setLoading(false);
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
                loadingStore.setLoading(false);
            });
    }
}
</script>

<template>
    <dialog :open="modalStore.isModalOpen && modalStore.modalType === 'delete'"
        class="modal modal-bottom sm:modal-middle z-40">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Are you sure you want to delete?</h3>
            <p class="py-4">This action cannot be undone.</p>
            <div class="modal-action">
                <div class="flex items-center justify-end gap-1">
                    <button @click="confirmDelete" class="btn btn-error">Delete</button>
                    <form method="dialog">
                        <button class="btn" @click="modalStore.closeModal">Close</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>
    <Loading v-if="loadingStore.loading" />
</template>
