<template>
  <div>
    <div class="header">
      <el-button @click="onDialogShow()">新增组织</el-button>
    </div>
    <el-table :data="organ.lists">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名字" />
      <el-table-column prop="img" label="图片">
        <template #default="scope">
          <el-image :src="scope.row.img" style="width: 100%;height: 300px" />
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="简介" />
      <el-table-column prop="url" label="跳转链接" />
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
        <el-form-item label="图片地址" prop="img">
          <upload-view v-model="dialog.form.img" />
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input v-model="dialog.form.summary" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="dialog.form.status"
            :active-value="1"
            :inactive-value="-1" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="dialog.form.url" />
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
  img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
}
import { ElMessage, ElMessageBox } from 'element-plus'
import UploadView from '@/components/upload/index.vue'
import { getOrgansApi, putOrganApi, addOrganApi, delOrganApi } from '@/api/organ'
import { onBeforeMount, reactive, computed, ref, unref } from 'vue'
export default {
  components: {
    UploadView
  },
  setup() {
    const form = ref()
    const organ = reactive({
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
      const { data } = await getOrgansApi({
        page_num: organ.page_num,
        page_size: organ.page_size
      })
      const { Organs = [], total = 0 } = data || {}
      organ.lists = Organs
      organ.total = total
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
        .then(() => delOrganApi({
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
    function onDialogShow(_form = { img: '', name: '', status: 1, summary: '', url: '' }) {
      dialog.form = _form
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const promise = dialog.form.id ? putOrganApi(dialog.form) : addOrganApi(dialog.form)
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
      organ,
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
