<template>
  <div>
    <div class="header">
      <el-button @click="onDialogShow()">新增管理员</el-button>
    </div>
    <el-table :data="manage.lists">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名字" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="user_role" label="权限" :formatter="formatter" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="onDialogShow(scope.row)" :disabled="scope.row.user_role === 2">编辑</el-button>
          <el-button type="danger" @click="onDeleteClick(scope.row)" :disabled="scope.row.user_role === 2">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog.visible" :title="dialogTitle">
      <el-form
        ref="form"
        :model="dialog.form"
        :rules="rules"
        label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialog.form.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dialog.form.phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="dialog.form.password" />
        </el-form-item>
        <template v-if="!dialog.form.id">
          <el-form-item label="权限" prop="user_role">
            <el-radio-group v-model="dialog.form.user_role">
              <el-radio-button v-for="item of roles" :label="item.role" :key="item.label">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const roles = [
  { role: 1, label: '管理员' }
  // { role: 2, label: '超级管理员' }
]
const rules = {
  phone: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  user_role: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOpusersApi, putOpuserApi, addOpuserApi, delOpuserApi } from '@/api/manage'
import { onBeforeMount, reactive, computed, ref, unref } from 'vue'
export default {
  setup() {
    const form = ref()
    const manage = reactive({
      lists: [],
      total: 0,
      page_num: 1,
      page_size: 50
    })
    const dialog = reactive({
      visible: false,
      form: {}
    })
    const dialogTitle = computed(() => dialog?.form?.id ? '编辑' : '新增')

    async function init() {
      const { data } = await getOpusersApi({
        page_num: manage.page_num,
        page_size: manage.page_size
      })
      const { OpUsers = [], total = 0 } = data || {}
      manage.lists = OpUsers
      manage.total = total
    }
    const formatter = (row) => {
      return (roles?.find?.(it => it.role === row.user_role) ?? roles[0]).label
    }
    function onDeleteClick(row) {
      ElMessageBox.confirm(
        '确定要删除这个轮播图吗',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      )
        .then(() => delOpuserApi({
          id: row.id
        })).then(res => {
          if (res.code === 0) {
            init()
            dialog.visible = false
            return
          }
          ElMessage.error(res.msg)
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled'
          })
        })
    }
    function onDialogShow(_form = { phone: '', name: '', user_role: 1, password: '' }) {
      dialog.form = _form
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const promise = dialog.form.id ? putOpuserApi(dialog.form) : addOpuserApi(dialog.form)
        promise.then(res => {
          if (res.code === 0) {
            init()
            dialog.visible = false
            return
          }
          ElMessage.error(res.msg)
        }).catch(() => {
          ElMessage.error('操作失败')
        })
      })
    }
    onBeforeMount(() => {
      init()
    })
    return {
      formatter,
      onDeleteClick,
      manage,
      dialog,
      dialogTitle,
      rules,
      onDialogShow,
      submit,
      form,
      roles
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}

</style>
