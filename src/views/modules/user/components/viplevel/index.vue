<template>
  <el-form
    ref="form"
    :model="data.form"
    :rules="rules"
    label-width="120px">
    <el-form-item label="健康会员等级" prop="health_vip_level">
      <el-select
        v-model="data.form.health_vip_level"
        class="m-2"
        placeholder="Select"
        size="large">
        <el-option
          v-for="item in healthVipLevels"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="理财会员等级" prop="financial_vip_level">
      <el-select
        v-model="data.form.financial_vip_level"
        class="m-2"
        placeholder="Select"
        size="large">
        <el-option
          v-for="item in financialVipLevels"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="submit()">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref, unref } from 'vue'
import { putUserApi } from '@/api/user'
const rules = {
  health_vip_level: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  financial_vip_level: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
export default {
  name: 'Index',
  props: {
    userid: {
      type: [String, Number],
      required: true
    },
    healthVipLevels: {
      type: Array,
      required: true
    },
    financialVipLevels: {
      type: Array,
      required: true
    },
    financialVipLevel: {
      type: Number,
      required: true
    },
    healthVipLevel: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = ref()
    const data = reactive({
      form: {
        health_vip_level: props.healthVipLevel,
        financial_vip_level: props.financialVipLevel
      }
    })

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const user = JSON.parse(JSON.stringify(data.form))
        user.id = props.userid
        putUserApi(user)
          .then(() => {
            emit('onRefresh')
          }).catch((err) => {
            console.log(err)
          })
      })
    }
    return {
      data,
      rules,
      submit,
      form
    }
  }
}
</script>

<style scoped>

</style>
