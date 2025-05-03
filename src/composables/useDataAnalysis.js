import { ref } from 'vue'
import * as globalConfig from '../../static/config'

export function useRole() {
  const roles = ref(globalConfig.role)
  const createRoleSelectOptions = () => {
    return globalConfig.role.map((item) => {
      return {
        value: item,
        label: item,
      }
    })
  }
  const options = ref(createRoleSelectOptions())
  return { roles, options }
}
