<template>
  <div>
    <div class="header">
      <el-button @click="onDialogShow()">新增vip等级</el-button>
    </div>
    <el-table :data="viplevel.lists">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名字" />
      <el-table-column prop="type" label="类型" :formatter="formatter" />
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
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="dialog.form.type">
            <el-radio-button v-for="item of vipLevelsTypes" :label="item.value" :key="item.label">{{ item.label }}</el-radio-button>
          </el-radio-group>
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
  name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
}
import { vipLevelsTypes } from '@/utils/constant'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getViplevelsApi, putViplevelApi, addViplevelApi, delViplevelApi } from '@/api/viplevel'
import { onBeforeMount, reactive, computed, ref, unref } from 'vue'
export default {
  setup() {
    const form = ref()

    const viplevel = reactive({
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
      const { data } = await getViplevelsApi({
        page_num: viplevel.page_num,
        page_size: viplevel.page_size
      })
      const { VipLevels = [], total = 0 } = data || {}
      viplevel.lists = VipLevels
      viplevel.total = total
    }

    const formatter = (row) => {
      return (vipLevelsTypes?.find?.(it => it.value === row.type) ?? vipLevelsTypes[0]).label
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
        .then(() => delViplevelApi({
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

    function onDialogShow(_form = { type: 'health', name: '' }) {
      dialog.form = _form
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const promise = dialog.form.id ? putViplevelApi(dialog.form) : addViplevelApi(dialog.form)
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
      viplevel,
      dialog,
      dialogTitle,
      rules,
      onDialogShow,
      submit,
      form,
      vipLevelsTypes
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}

</style>
