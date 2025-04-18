import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  const isModalOpen = ref(false);
  const modalType = ref(null);
  const data = ref(null);

  function openModal(type, payload = null) {    
    modalType.value = type;
    data.value = payload;
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    modalType.value = null;
    data.value = null;
  }

  return {
    isModalOpen,
    modalType,
    data,
    openModal,
    closeModal
  };
});
