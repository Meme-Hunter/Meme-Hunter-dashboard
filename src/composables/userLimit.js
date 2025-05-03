import { ref } from 'vue'

export const userLimit = ref(100)

export const useUserLimit = () => {
  return {
    userLimit,
  }
}
