<template>
  <div>
    <div class="header">
      <el-button @click="onDialogShow()">新增优惠券</el-button>
      <el-radio-group v-model="activeTab" @change="onChange">
        <el-radio-button v-for="item of tabs" :label="item.value" :key="item.label">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :data="coupon.lists">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="use_rule" label="使用规则" />
      <el-table-column prop="end_time" label="结束时间" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="discount" label="折扣" />
      <el-table-column prop="count" label="数量" />
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
        <el-form-item label="折扣" prop="discount">
          <el-input-number
            v-model="dialog.form.discount"
            :max="1"
            :step="0.01"
            :min="0" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input-number
            v-model="dialog.form.count"
            :step="1"
            :min="1" />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="dialog.form.end_time"
            type="datetime"
            format="YYYY/MM/DD hh:mm:ss"
            placeholder="Select date and time" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="dialog.form.status"
            :active-value="1"
            :inactive-value="-1" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="dialog.form.type">
            <el-radio-button v-for="item of tabs" :label="item.value" :key="item.label">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用规则" prop="use_rule">
          <el-input v-model="dialog.form.use_rule" />
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
  name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  discount: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  end_time: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  use_rule: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
// 保健品:health 生物科技:tech
const tabs = [
  { label: '保健品', value: 'health' },
  { label: '生物科技', value: 'tech' }
]
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCouponsApi, putCouponApi, addCouponApi, delCouponApi } from '@/api/coupon'
import { onBeforeMount, reactive, computed, ref, unref } from 'vue'
export default {
  setup() {
    const form = ref()
    const activeTab = ref('health')
    const coupon = reactive({
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
      const { data } = await getCouponsApi({
        page_num: coupon.page_num,
        page_size: coupon.page_size,
        type: unref(activeTab)
      })
      const { Coupons = [], total = 0 } = data || {}
      coupon.lists = Coupons.map(it => {
        return {
          ...it,
          end_time: dayjs(it.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      coupon.total = total
    }
    const formatter = (row) => {
      return ({
        '-1': '禁用',
        '1': '启用'
      })?.[row.status] ?? '启用'
    }
    function onDeleteClick(row) {
      ElMessageBox.confirm(
        '确定要删除这条数据吗？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      )
        .then(() => delCouponApi({
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
    function onDialogShow(_form = { discount: 0, end_time: 0, name: '', status: 1, type: 'health', use_rule: '' }) {
      dialog.form = _form
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const cForm = JSON.parse(JSON.stringify(dialog.form))
        cForm.end_time = dayjs(cForm.end_time).unix()
        const promise = dialog.form.id ? putCouponApi(cForm) : addCouponApi(cForm)
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
      coupon,
      dialog,
      dialogTitle,
      rules,
      onDialogShow,
      submit,
      form,
      tabs,
      activeTab,
      onChange: init
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

</style>
