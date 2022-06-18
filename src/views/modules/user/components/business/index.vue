<template>
  <div class="header">
    <div>
      <el-button @click="onBusinessClick()">增加记录</el-button>
      <el-button @click="onBusinessExport()" :loading="ext.loading">导出记录</el-button>
    </div>
    <span>
      总值：{{ data.total_amount }}
    </span>
  </div>
  <el-table :data="data.lists">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="user_id" label="用户id" />
    <el-table-column prop="deal_time" label="交易时间" :formatter="formatTime" />
    <el-table-column prop="title" label="标题" />
    <el-table-column prop="type" label="类型" :formatter="formatType" />
    <el-table-column prop="amount" label="金额" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button @click="onEditClick(scope.row)">编辑</el-button>
        <el-button type="danger" @click="onDeleteClick(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="增加记录" v-model="dialog.visible">
    <el-form
      ref="form"
      :model="dialog.form"
      :rules="rules"
      label-width="120px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dialog.form.title" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="dialog.form.type"
          class="m-2"
          placeholder="Select"
          size="large">
          <el-option
            v-for="item in businesses"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number :step="1" :min="1" v-model="dialog.form.amount" />
      </el-form-item>
      <el-form-item>
        <el-button @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'

const businessEnums = {
  in: '充值',
  out: '提现',
  consume: '消费'
}
const businesses = [
  { label: businessEnums.in, value: 'in' },
  { label: businessEnums.out, value: 'out' },
  { label: businessEnums.consume, value: 'consume' }
]
const rules = {
  title: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
import { getBusinesApi, addBusinessApi, getBusinessExportListApi, delBusinnessApi, updateBusinnessApi } from '@/api/business'
import { reactive, onBeforeMount, ref, unref } from 'vue'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'Index',
  props: {
    userid: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const form = ref()
    const dialog = reactive({
      visible: false,
      form: {
        user_id: '',
        deal_time: 0,
        title: '',
        type: '',
        amount: 0
      }
    })
    const data = reactive({
      lists: [],
      total: 0,
      total_amount: 0,
      page_num: 1,
      page_size: 500
    })
    const ext = reactive({
      loading: false,
      url: ''
    })

    function init() {
      getBusinesApi({
        page_num: data.page_num,
        page_size: data.page_size,
        userid: props.userid
      }).then(res => {
        const { Businesss, total, total_amount = 0 } = res.data || {}
        data.lists = Businesss
        data.total = total
        data.total_amount = total_amount
      }).catch(err => {
        console.log(err)
      })
    }
    function onBusinessExport () {
      ext.loading = true
      getBusinessExportListApi(props.userid).then(res => {
        const { data: { url } } = res || {}
        window.open(url)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        ext.loading = false
      })
    }

    function onBusinessClick() {
      dialog.form = {
        user_id: props.userid,
        deal_time: 0,
        title: '',
        type: 'in',
        amount: 1
      }
      dialog.visible = true
    }
    function formatTime(row) {
      return dayjs(row.deal_time * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
    function formatType(row) {
      return businessEnums?.[row.type] ?? businessEnums.in
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const params = JSON.parse(JSON.stringify(dialog.form))
        params.deal_time = dayjs().unix()
        const promise = params.id ? updateBusinnessApi(params) : addBusinessApi(params)
        promise.then(() => init()).then(() => {
          dialog.visible = false
        }).catch((err) => {
          console.log(err)
        })
      })
    }

    onBeforeMount(() => {
      init()
    })

    function onEditClick(data) {
      dialog.form = data
      dialog.visible = true
    }

    function onDeleteClick(data) {
      ElMessageBox.confirm(
        '确定要删除吗?',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      ).then(() => delBusinnessApi(data.id).then(() => init()).catch((e) => {
        console.log(e)
      }))
    }
    return {
      data,
      formatTime, formatType,
      onBusinessClick,
      onBusinessExport,
      dialog,
      rules,
      form,
      businesses,
      submit,
      ext,
      onEditClick,
      onDeleteClick
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

</style>
