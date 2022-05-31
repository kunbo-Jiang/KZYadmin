<template>
  <el-scrollbar class="sidebar">
    <div class="logo">
      康之源
    </div>
    <el-divider style="margin: 0;box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%)" />
    <el-menu
      background-color="#263238"
      text-color="#ffffff"
      active-text-color="#409EFF"
      class="sidebar-menu"
      :default-active="active || 'home'"
      :collapse-transition="true"
      :collapse="isCollapse">
      <el-menu-item index="home" @click="router.push({ name: 'home' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>首页</span>
        </template>
      </el-menu-item>
      <el-menu-item index="banner" @click="router.push({ name: 'banner' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>轮播图管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="service" @click="router.push({ name: 'service' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>服务管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="coupon" @click="router.push({ name: 'coupon' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>优惠券管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="organ" @click="router.push({ name: 'organ' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>组织管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="notice" @click="router.push({ name: 'notice' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>通知管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="manage" @click="router.push({ name: 'manage' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>账号管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="user" @click="router.push({ name: 'user' })">
        <g-iconfont name="user" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>用户管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="viplevel" @click="router.push({ name: 'viplevel' })">
        <g-iconfont name="home" class="sidebar-menu-icon" size="14px" />
        <template #title>
          <span>会员等级管理</span>
        </template>
      </el-menu-item>
      <sub-menu v-for="menu in menus" :key="menu.id" :menu="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { computed, defineComponent, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import SubMenu from './sub-menu.vue'

export default defineComponent({
  components: { SubMenu },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const document = computed(() => store.state.setting.document)
    const active = computed(() => store.state.menu.active)
    const isCollapse = computed(() => store.state.menu.isCollapse)
    const menus = computed(() => store.getters['menu/processedMenu'])

    /**
     * @description: 路由变化事件
     * @param {*}
     * @return {*}
     */
    const routeHandle = argRoute => {
      const name = argRoute.name
      store.dispatch('menu/setActive', name)
    }

    watchEffect(() => {
      routeHandle(route)
    })

    return {
      document,
      active,
      isCollapse,
      menus,
      router
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_mixin.scss';
.sidebar-menu:not(.el-menu--collapse) {
  width: 200px; // todo: 侧边栏的宽度
}
.sidebar,
.sidebar-menu,
::v-deep(.el-menu),
::v-deep(.el-menu-item:hover, .el-menu-item:focus, .el-menu-item:active),
::v-deep(.el-submenu__title:hover) {
  background-color: #263238;
}
.sidebar .logo {
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}
.sidebar-menu {
  border: none;
}
::v-deep(.sidebar-menu-icon) {
  margin: 0 5px;
  font-size: 12px;
}
::v-deep(.el-menu-item) {
  display: block;
  padding-right: 20px;
  @include single-ellipse;
}
::v-deep(.el-sub-menu) {
  display: block;
}
::v-deep(.el-sub-menu__title) {
  display: block;
  @include single-ellipse;
  & > .el-sub-menu__icon-arrow {
    position: absolute;
    right: 8px;
  }
}
</style>
