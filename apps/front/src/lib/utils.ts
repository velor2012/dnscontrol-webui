import { customRef } from "vue"

export function useDebouncedRef(value: () => void, delay = 200) {
    let timeout: number | undefined = undefined
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          if(timeout == undefined){
              newValue()
              timeout = -1
          }else{
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                newValue()
                value = newValue
                trigger()
              }, delay)
          }
        }
      }
    })
  }