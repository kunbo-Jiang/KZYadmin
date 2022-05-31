<template>
  <el-table :data="data.lists">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="user_id" label="用户id" />
    <el-table-column prop="name" label="用户昵称" />
    <el-table-column prop="phone" label="用户手机号" />
    <el-table-column prop="address" label="用户地址" />
    <el-table-column prop="is_default	" label="是否是默认地址" :formatter="formatterAddress" />
  </el-table>
</template>

<script>
import { getAddressesApi } from '@/api/address'
import { reactive, onBeforeMount } from 'vue'
export default {
  name: 'Index',
  props: {
    userid: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const data = reactive({
      lists: [],
      total: 0,
      page_num: 1,
      page_size: 50
    })

    function init() {
      getAddressesApi({
        page_num: data.page_num,
        page_size: data.page_size,
        userid: props.userid
      }).then(res => {
        console.log(res)
        const { Addresss, total } = res.data || {}
        data.lists = Addresss
        data.total = total
      }).catch(err => {
        console.log(err)
      })
    }

    onBeforeMount(() => {
      init()
    })
    function formatterAddress(row) {
      return row.is_default > 0 ? '是' : '否'
    }
    return {
      data,
      formatterAddress

    }
  }
}
</script>

<style scoped>

</style>
