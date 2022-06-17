<template>
  <el-card
    class="login-card width-500"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.1)">
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      status-icon>
      <h1>康之源Club后台管理系统</h1>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账户" clearable>
          <template #prefix>
            <span><g-iconfont name="user" /></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          placeholder="密码"
          show-password
          clearable>
          <template #prefix>
            <span><g-iconfont name="lock" /></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="margin_t-22 width-full" type="primary" @click="submit()">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onBeforeMount, nextTick, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { ElNotification } from 'element-plus'

import { getUUID } from '@/utils'

import { captchaApi } from '@/api/login'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const data = reactive({
      loading: false,
      captchaPath: ''
    })

    const refForm = ref()
    const form = reactive({
      username: '',
      password: ''
    })
    const rules = reactive(function() {
      return {
        username: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }())

    /**
     * @description: 获取验证码图片
     * @param {*}
     * @return {*}
     */
    const captcha = () => {
      form.uuid = getUUID()
      data.captchaPath = captchaApi({ uuid: form.uuid })
    }

    /**
     * @description: 登录表单提交
     * @param {*}
     * @return {*}
     */
    const submit = () => {
      refForm.value.validate(valid => {
        if (valid) {
          data.loading = true
          const loginForm = {
            phone: form.username,
            password: form.password
          }
          store.dispatch('user/login', loginForm).then(r => {
            if (r) {
              if (route.query.targetUrl) {
                location.href = decodeURIComponent(route.query.targetUrl)
                return
              }
              router.push({ name: 'home' })
            } else {
              captcha()
            }
            nextTick(() => {
              data.loading = false
            })
          })
        }
      })
    }

    onBeforeMount(() => {
      captcha()
    })

    onBeforeUnmount(() => {
      ElNotification.closeAll()
    })

    return {
      ...toRefs(data),
      refForm,
      form,
      rules,
      captcha,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
}
</style>
