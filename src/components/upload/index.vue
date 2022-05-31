<template>
  <el-upload
    class="avatar-uploader"
    :action="uploadUrl"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    accept="image/*"
    :headers="{
      Authorization
    }"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <el-icon v-else class="avatar-uploader-icon">
      <g-icon name="plus" />
    </el-icon>
  </el-upload>
</template>

<script>
import { getApiBaseUrl } from '@/utils'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'Index',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const uploadUrl = getApiBaseUrl() + 'v1/upload/file'
    const Authorization = computed(() => store.getters['user/tokenVal'])
    const imageUrl = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    function handleAvatarSuccess({ data }) {
      imageUrl.value = data.url
    }
    function beforeAvatarUpload(rawFile) {
      if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB!')
        return false
      }
      return true
    }
    return {
      uploadUrl,
      imageUrl,
      handleAvatarSuccess,
      beforeAvatarUpload,
      Authorization
    }
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
