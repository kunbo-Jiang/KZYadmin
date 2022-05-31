<template>
  <div>
    <el-table :data="user.lists">
      <el-table-column prop="id" label="用户id" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="avatar" label="图片">
        <template #default="scope">
          <el-image :src="scope.row.avatar" style="width: 100px;height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="open_id" label="openid" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="health_vip_level_name" label="健康会员等级" />
      <el-table-column prop="financial_vip_level_name" label="理财会员等级" />
      <el-table-column label="操作">
        <template #default="scope">
          <div class="btns">
            <el-button
              v-for="item of btnControls"
              :key="item.label"
              class="btn"
              @click="onDialogShow(scope.row, item)">{{ item.label }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog.visible" :title="dialog.title">
      <component
        :is="dialog.type"
        :userid="dialog.form.id"
        @onRefresh="onRefresh"
        :financialVipLevel="dialog.form.financial_vip_level"
        :healthVipLevel="dialog.form.health_vip_level"
        :healthVipLevels="health_vip_levels"
        :financialVipLevels="financial_vip_levels" />
    </el-dialog>
  </div>
</template>

<script>
const rules = {
  img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '跳转链接不能为空', trigger: 'blur' }]
}
import { vipLevelEnums } from '@/utils/constant'
const controlEnums = {
  address: 'AddressView',
  business: 'BusinessView',
  integral: 'IntegralView',
  viplevel: 'ViplevelView'
}
const btnControls = [
  {
    type: controlEnums.address,
    label: '地址管理'
  },
  {
    type: controlEnums.business,
    label: '交易记录管理'
  },
  {
    type: controlEnums.integral,
    label: '积分管理'
  },
  {
    type: controlEnums.viplevel,
    label: '会员等级管理'
  }
]
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsersApi, putUserApi, addUserApi, delUserApi } from '@/api/user'
import { getViplevelsApi as _getViplevelsApi } from '@/api/viplevel'
import { onBeforeMount, reactive, ref, unref } from 'vue'
import AddressView from './components/address/index.vue'
import BusinessView from './components/business/index.vue'
import IntegralView from './components/integral/index.vue'
import ViplevelView from './components/viplevel/index.vue'
export default {
  components: {
    AddressView,
    BusinessView,
    IntegralView,
    ViplevelView
  },
  setup() {
    const form = ref()
    const user = reactive({
      lists: [],
      total: 0,
      page_num: 1,
      page_size: 50
    })
    const health_vip_levels = ref([])
    const financial_vip_levels = ref([])
    const dialog = reactive({
      visible: false,
      type: controlEnums.address,
      title: '',
      loading: false,
      form: {}
    })

    function getViplevelsApi () {
      _getViplevelsApi({
        page_num: 1,
        page_size: 50
      }).then(res => {
        const { VipLevels = [] } = res.data || {}
        const healths = []
        const financials = []
        VipLevels.forEach(it => {
          if (it.type === vipLevelEnums.financial) {
            financials.push(it)
          } else if (it.type === vipLevelEnums.health) {
            healths.push(it)
          }
        })
        health_vip_levels.value = healths
        financial_vip_levels.value = financials
      }).catch(() => {
        console.log()
      })
    }

    async function init() {
      const { data } = await getUsersApi({
        page_num: user.page_num,
        page_size: user.page_size
      })
      const { Users = [], total = 0 } = data || {}
      user.lists = Users
      user.total = total
    }

    onBeforeMount(() => {
      init()
      getViplevelsApi()
    })

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
        .then(() => delUserApi({
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

    function onDialogShow(val, next) {
      dialog.form = val
      dialog.type = next.type
      dialog.title = next.label
      dialog.loading = true
      dialog.visible = true
    }

    function submit() {
      unref(form).validate((valid, fields) => {
        if (!valid) {
          return
        }
        const promise = dialog.form.id ? putUserApi(dialog.form) : addUserApi(dialog.form)
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

    function onRefresh() {
      dialog.visible = false
      init()
    }
    return {
      onDeleteClick,
      user,
      dialog,
      rules,
      onDialogShow,
      submit,
      form,
      btnControls,
      health_vip_levels,
      financial_vip_levels,
      onRefresh
    }
  }
}
</script>

<style scoped>
.btns {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn {
  width: 120px;
  margin-bottom: 5px;
}
.btn:first-child {
  margin-left: 10px;
}
</style>
