import { createInitialStoreState } from '@/store/state'

export default {
  async logout () {
    this.replaceState(createInitialStoreState())
  }
}
