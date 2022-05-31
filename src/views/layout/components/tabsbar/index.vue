<template>
  <div class="tabs">
    <el-tabs
      type="card"
      v-model="active"
      @tab-click="clickHandle"
      @tab-remove="removeHandle">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.value"
        :label="tab.label_cn"
        :name="tab.value"
        :closable="tab.closable" />
    </el-tabs>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const tabActive = computed(() => store.state.tab.active)
    const tabs = computed(() => store.state.tab.tabs)

    const active = computed({
      get: () => {
        return tabActive.value
      },
      set: (val) => {
        store.dispatch('tab/setActive', val)
      }
    })

    onBeforeRouteUpdate((to) => {
      store.dispatch('tab/changeHandle', to)
      const meta = to.meta
      if (meta.multiple) {
        store.dispatch('setting/setRefresh', true)
        nextTick(() => {
          store.dispatch('setting/setRefresh', false)
        })
      }
    })

    onBeforeMount(() => {
      store.dispatch('tab/changeHandle', route)
    })

    /**
     * @description: 标签点击路由跳转事件
     * @param {*}
     * @return {*}
     */
    const clickHandle = ({ index }) => {
      const tab = tabs.value[+index]
      router.push({
        name: tab.name,
        query: tab.query,
        params: tab.params
      })
    }

    /**
     * @description: 标签删除事件
     * @param {*}
     * @return {*}
     */
    const removeHandle = name => {
      store.dispatch('tab/removeHandle', [name])
    }

    return {
      active,
      tabs,
      clickHandle,
      removeHandle
    }
  }
})
</script>

<style lang="scss" scoped>
.tabs {
  padding: 9px 10px 0 10px;
  ::v-deep(.el-tabs__header) {
    margin: 0;
    border: none;
  }
}
</style>
