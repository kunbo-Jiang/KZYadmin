<template>
  <div class="headbar-container padding-n-10 flex-box">
    <el-tooltip
      placement="right"
      effect="dark"
      :show-after="1000"
      :enterable="false"
      content="菜单栏展开/收起">
      <g-icon
        class="cursor-pointer"
        :style="style"
        :name="isCollapse ? 'expand' : 'fold'"
        @click="foldHandle()" />
    </el-tooltip>
    <actionbar class="actionbar flex-item_f-1" />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import Actionbar from './actionbar.vue'

export default defineComponent({
  components: { Actionbar },
  setup() {
    const store = useStore()

    const navbar = computed(() => store.state.setting.navbar)
    const isCollapse = computed(() => store.state.menu.isCollapse)

    const style = computed(() => {
      return {
        'line-height': `${ navbar.value.headHeight }px`
      }
    })

    const foldHandle = () => {
      store.dispatch('menu/setIsCollapse', !isCollapse.value)
    }

    return {
      isCollapse,
      style,
      foldHandle
    }
  }
})
</script>

<style lang="scss" scoped>
.headbar-container {
  // & > i {
  //   cursor: pointer;
  // }
  .actionbar {
    float: right;
  }
}
</style>
