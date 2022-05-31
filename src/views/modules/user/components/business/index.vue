<template>
  <div class="header">
    <el-button @click="onBusinessClick()">增加记录</el-button>
    <el-button @click="onBusinessExport()" :loading="ext.loading">导出记录</el-button>
  </div>
  <el-table :data="data.lists">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="user_id" label="用户id" />
    <el-table-column prop="deal_time" label="交易时间" :formatter="formatTime" />
    <el-table-column prop="title" label="标题" />
    <el-table-column prop="type" label="类型" :formatter="formatType" />
    <el-table-column prop="amount" label="金额" />
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
  out: '提现'
}
const businesses = [
  { label: businessEnums.in, value: 'in' },
  { label: businessEnums.out, value: 'out' }
]
const rules = {
  title: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
import { getBusinesApi, addBusinessApi, getBusinessExportListApi } from '@/api/business'
import { reactive, onBeforeMount, ref, unref } from 'vue'
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
      page_num: 1,
      page_size: 50
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
        const { Businesss, total } = res.data || {}
        data.lists = Businesss
        data.total = total
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
        console.log(params)
        addBusinessApi(params).then(() => init()).catch((err) => {
          console.log(err)
        })
      })
    }

    onBeforeMount(() => {
      init()
    })
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
      ext
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 10px;
}

</style>
