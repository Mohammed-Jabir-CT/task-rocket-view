import { defineStore } from 'pinia'
import axiosClient from '../axios';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: []
  }),
  actions: {
    async fetchTasks(params = {}) {
      const response = await axiosClient.get('/api/tasks', {params});
      console.log(response);
      
      this.tasks = response.data.tasks;
    },
    async fetchTask(id) {
      const response = await axiosClient.get(`/api/tasks/${id}`);
      return response.data.task;
    },
    async addTask(newTask) {
      const response = await axiosClient.post('/api/tasks', newTask);
      await this.fetchTasks();
    },
    async updateTask(task, taskId) {            
      await axiosClient.put(`/api/tasks/${taskId}`, task);
      await this.fetchTasks();
    },
    async markAsCompleted(task, taskId){
      await axiosClient.patch(`/api/tasks/${taskId}`, task);
      await this.fetchTasks();
    },
    async deleteTask(taskId) {
      await axiosClient.delete(`/api/tasks/${taskId}`);
      await this.fetchTasks();
    }
  }
});
