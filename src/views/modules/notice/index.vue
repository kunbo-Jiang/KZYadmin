<template>
  <div>
    <div class="header">
      <el-button @click="onDialogShow()">新增banner</el-button>
    </div>
    <el-table :data="notice.lists">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名字" />
      <el-table-column prop="text" label="内容" />
      <el-table-column prop="status" label="状态" :formatter="formatter" />
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialog.form.name" />
        </el-form-item>
        <el-form-item label="内容" prop="text">
          <el-input v-model="dialog.form.text" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="dialog.form.status"
            :active-value="1"
            :inactive-value="-1" />
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
  text: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNoticesApi, putNoticeApi, addNoticeApi, delNoticeApi } from '@/api/notice'
import { onBeforeMount, reactive, computed, ref, unref } from 'vue'
export default {
  setup() {
    const form = ref()
    const notice = reactive({
      lists: [],
      total: 0,
      page_num: 1,
      page_size: 500
    })
    const dialog = reactive({
      visible: false,
      form: {}
    })
    const dialogTitle = computed(() => dialog?.form?.id ? '编辑' : '新增')
    async function init() {
      const { data } = await getNoticesApi({
        page_num: notice.page_num,
        page_size: notice.page_size
      })
      const { notices = [], total = 0 } = data || {}
      notice.lists = notices
      notice.total = total
    }
    const formatter = (row) => {
      return ({
        '-1': '禁用',
        '1': '启用'
      })?.[row.status] ?? '启用'
    }
    function onDeleteClick(row) {
      ElMessageBox.confirm(
        '确定要删除吗？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      )
        .then(() => delNoticeApi({
          id: row.id
        })).then(res => {
          if (res.code === 0) {
            init()
            dialog.visible = false
            return
          }
          ElMessage.error(res.msg)
        })
        .catch((e) => {
          console.log(e)
        })
    }
    function onDialogShow(_form = { text: '', name: '', status: 1 }) {
      dialog.form = _form
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const promise = dialog.form.id ? putNoticeApi(dialog.form) : addNoticeApi(dialog.form)
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
      notice,
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
