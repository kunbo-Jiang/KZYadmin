<template>
  <div>
    <div class="header">
      <el-button @click="onDialogShow()">新增服务</el-button>
    </div>
    <el-table :data="service.lists">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="servicer_name" label="名称" />
      <el-table-column prop="servicer_phone" label="电话" />
      <el-table-column prop="software_name" label="软件名字" />
      <el-table-column prop="software_version" label="软件版本" />
      <el-table-column prop="tech_support" label="支持公司" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="onDialogShow(scope.row)">编辑</el-button>
          <el-button type="danger" @click="onDeleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog.visible" :title="dialogTitle">
      <el-form
        ref="form"
        :model="dialog.form"
        :rules="rules"
        label-width="120px">
        <el-form-item label="姓名" prop="servicer_name">
          <el-input v-model="dialog.form.servicer_name" />
        </el-form-item>
        <el-form-item label="电话" prop="servicer_phone">
          <el-input v-model="dialog.form.servicer_phone" />
        </el-form-item>
        <el-form-item label="软件名字" prop="software_name">
          <el-input v-model="dialog.form.software_name" />
        </el-form-item>
        <el-form-item label="软件版本" prop="software_version">
          <el-input v-model="dialog.form.software_version" />
        </el-form-item>
        <el-form-item label="支持公司" prop="tech_support">
          <el-input v-model="dialog.form.tech_support" />
        </el-form-item>
        <el-form-item>
          <el-button @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const rules = {
  servicer_name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  servicer_phone: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  software_name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  software_version: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  tech_support: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
import { ElMessage, ElMessageBox } from 'element-plus'
import { getServicesApi, putServiceApi, addServiceApi, delServiceApi } from '@/api/service'
import { onBeforeMount, reactive, computed, ref, unref } from 'vue'
export default {
  setup() {
    const form = ref()
    const service = reactive({
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
      const { data } = await getServicesApi({
        page_num: service.page_num,
        page_size: service.page_size
      })
      console.log(data)
      const { CustomServices = [], total = 0 } = data || {}
      service.lists = CustomServices
      service.total = total
    }
    function onDeleteClick(row) {
      ElMessageBox.confirm(
        '确定要删除这个服务吗',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      )
        .then(() => delServiceApi({
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
    function onDialogShow(_form = { img: '', name: '', status: 1, url: '' }) {
      dialog.form = _form
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const promise = dialog.form.id ? putServiceApi(dialog.form) : addServiceApi(dialog.form)
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
      onDeleteClick,
      service,
      dialog,
      dialogTitle,
      rules,
      onDialogShow,
      submit,
      form
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}

</style>
