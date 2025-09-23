import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedImagesStore = defineStore('selected-images', () => {
  const selected = ref([])

  const addSelected = (obj) => {
    if (!selected.value.some(i => i.id === obj.id)) {
      selected.value.push(obj)
    }
  }

  const removeSelected = (id) => {
    selected.value = selected.value.filter(i => i.id !== id)
  }

  return { selected, addSelected, removeSelected }
})
