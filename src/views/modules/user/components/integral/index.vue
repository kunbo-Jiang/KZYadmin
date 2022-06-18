<template>
  <div class="header">
    <el-button @click="onIntegralClick()">增加记录</el-button>
    <el-button @click="onIntegralExport()" :loading="ext.loading">导出记录</el-button>
    <el-button @click="dialogTotal.visible = true">更改积分总额</el-button>
  </div>
  <el-table :data="data.lists">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="user_id" label="用户id" />
    <el-table-column prop="type" label="类型" :formatter="formatType" />
    <el-table-column prop="begin_date" label="开始日期" :formatter="formatBeginTime" />
    <el-table-column prop="end_date" label="结束日期" :formatter="formatEndTime" />
    <el-table-column prop="profit" label="待换积分" />
    <el-table-column prop="num" label="本金" />
    <el-table-column prop="status" label="状态" :formatter="formatStatus" />
    <el-table-column prop="exchange_rate" label="兑换率" :formatter="formatRate" />
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
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="dialog.form.type"
          class="m-2"
          placeholder="Select"
          size="large">
          <el-option
            v-for="item in integrals"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="begin_date">
        <el-date-picker
          v-model="dialog.form.begin_date"
          type="datetime"
          format="YYYY/MM/DD hh:mm:ss"
          placeholder="Select date and time" />
      </el-form-item>
      <el-form-item label="结束时间" prop="end_date">
        <el-date-picker
          v-model="dialog.form.end_date"
          type="datetime"
          format="YYYY/MM/DD hh:mm:ss"
          placeholder="Select date and time" />
      </el-form-item>
      <el-form-item label="本金" prop="num">
        <el-input-number
          :min="1"
          :step="0.000001"
          v-model="dialog.form.num" />
      </el-form-item>
      <el-form-item label="待换积分" prop="profit">
        <el-input-number :step="0.000001" :min="1" v-model="dialog.form.profit" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="dialog.form.status"
          class="m-2"
          placeholder="Select"
          size="large">
          <el-option
            v-for="item in statusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="兑换率" prop="exchange_rate">
        <el-input-number
          :step="0.01"
          :min="0"
          :max="100"
          v-model="dialog.form.exchange_rate" />
        <span style="margin-left: 5px"> %</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog title="积分总额" v-model="dialogTotal.visible" width="30%">
    <el-form
      ref="totalForm"
      :model="dialogTotal.form"
      :rules="ruleTotal"
      label-width="120px">
      <el-form-item label="活期积分" prop="type">
        <el-input-number
          :min="0"
          :step="0.000001"
          v-model="dialogTotal.form.current_integral" />
      </el-form-item>
      <el-form-item label="锁定积分" prop="begin_date">
        <el-input-number
          :min="0"
          :step="0.000001"
          v-model="dialogTotal.form.lock_integral" />
      </el-form-item>
      <el-form-item>
        <el-button @click="submitTotal()">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'

const integralEnums = {
  lock: '锁定',
  current: '活期'
}
const integrals = [
  { label: integralEnums.lock, value: 'lock' },
  { label: integralEnums.current, value: 'current' }
]
const statusArr = [
  { label: '已结束', value: 'end' },
  { label: '违约', value: 'break' },
  { label: '待兑换', value: 'unexchanged' }
]
const rules = {
  type: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  begin_date: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  end_date: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  profit: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  exchange_rate: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  num: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
const ruleTotal = {
  lock_integral: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  current_integral: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
}
import { getIntegralsApi, addIntegralApi, getIntegralExportListApi, delIntegralApi, putIntegralApi } from '@/api/integral'
import { reactive, onBeforeMount, ref, unref } from 'vue'
import { getInterestsApi, putInterestApi } from '@/api/interest'
import { ElMessageBox, ElMessage } from 'element-plus'
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
    const totalForm = ref()
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
      page_size: 500
    })
    const ext = reactive({
      loading: false,
      url: ''
    })
    const dialogTotal = reactive({
      visible: false,
      form: {
        coupon_count: 2,
        current_integral: 0,
        id: 1,
        lock_integral: 0,
        money: 1,
        user_id: 1
      }
    })

    function init() {
      getIntegralsApi({
        page_num: data.page_num,
        page_size: data.page_size,
        user_id: props.userid
      }).then(res => {
        const { Integrals = [], total } = res.data || {}
        data.lists = Integrals.map((it) => ({
          ...it,
          exchange_rate: it.exchange_rate * 100
        }))
        data.total = total
      }).catch(err => {
        console.log(err)
      })

      getInterestsApi({
        page_num: 1,
        page_size: 10,
        user_id: props.userid
      }).then(res => {
        const { data: { Interests = [] } } = res || {}
        dialogTotal.form = Interests?.[0] ?? {}
      }).catch(err => {
        console.log(err)
      })
    }
    function onIntegralExport () {
      ext.loading = true
      getIntegralExportListApi(props.userid).then(res => {
        const { data: { url } } = res || {}
        window.open(url)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        ext.loading = false
      })
    }

    function onIntegralClick() {
      dialog.form = {
        type: 'lock',
        begin_date: new Date(),
        end_date: new Date(),
        amount: 0,
        profit: 0,
        status: 'end',
        exchange_rate: 0,
        num: 1
      }
      dialog.visible = true
    }
    function formatBeginTime(row) {
      return dayjs(row.begin_date).format('YYYY-MM-DD HH:mm:ss')
    }
    function formatEndTime(row) {
      return dayjs(row.end_date).format('YYYY-MM-DD HH:mm:ss')
    }
    function formatType(row) {
      return integralEnums?.[row.type] ?? integralEnums.current
    }
    function formatStatus(row) {
      return (statusArr?.find?.(it => it.value === row.status) ?? statusArr[0]).label
    }

    function onDeleteClick(item) {
      ElMessageBox.confirm(
        '确定要删除吗?',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }
      ).then(() => delIntegralApi(item.id)).then(() => init()).catch((e) => {
        console.log(e)
      })
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const params = JSON.parse(JSON.stringify(dialog.form))
        params.exchange_rate = params.exchange_rate / 100
        params.user_id = props.userid
        params.begin_date = dayjs(params.begin_date).format('YYYY-MM-DD')
        params.end_date = dayjs(params.end_date).format('YYYY-MM-DD')
        const promise = params.id ? putIntegralApi(params) : addIntegralApi(params)
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
    function submitTotal() {
      unref(totalForm).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const params = JSON.parse(JSON.stringify(dialogTotal.form))
        putInterestApi(params)
          .then(() => init())
          .then(() => {
            dialogTotal.visible = false
          })
          .catch(() => {
            ElMessage.error('更新积分总额失败！')
          })
      })
    }
    function onEditClick(_data) {
      dialog.form = _data
      dialog.visible = true
    }
    function formatRate(_data) {
      return `${ _data.exchange_rate }%`
    }
    return {
      data,
      formatBeginTime, formatEndTime, formatStatus,
      formatType,
      onIntegralExport,
      onIntegralClick,
      dialog,
      rules,
      form,
      integrals,
      submit,
      ext,
      statusArr,
      onDeleteClick,
      dialogTotal,
      ruleTotal,
      totalForm,
      submitTotal,
      onEditClick,
      formatRate
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 10px;
}

</style>
