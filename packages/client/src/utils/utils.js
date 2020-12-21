import { reactive } from 'vue'

Array.prototype.sum = function() {
  return this.reduce((a, b) => a + (b || 0))
}

function useReactive(obj) {
  let target = obj
  if (typeof obj !== 'object') {
    target = { obj }
  }
  const origin = JSON.parse(JSON.stringify(target))
  let data = reactive(target)

  const reset = () => {
    Object.keys(target).map((key) => (data[key] = origin[key]))
  }

  const set = (obj) => {
    if (typeof obj !== 'object') {
      throw new Error('obj must be an object')
    }
    Object.keys(obj).map((key) => (data[key] = obj[key]))
  }

  return [data, set, reset]
}

export { useReactive }
