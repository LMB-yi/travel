<!-- src/views/Admin.vue -->
<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1 class="page-title">管理员中心</h1>
    </div>

    <!-- 导航标签 -->
    <el-tabs v-model="activeTab" class="admin-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="添加景点" name="add-attraction">
        <div class="tab-content">
          <el-form :model="attractionForm" label-width="120px" class="attraction-form">
            <el-form-item label="景点名称" required>
              <el-input
                v-model="attractionForm.name"
                placeholder="请输入景点名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="所在地区" required>
              <el-select v-model="attractionForm.region" placeholder="选择地区">
                <el-option label="华北" value="north" />
                <el-option label="华东" value="east" />
                <el-option label="华南" value="south" />
                <el-option label="西南" value="southwest" />
                <el-option label="西北" value="northwest" />
                <el-option label="东北" value="northeast" />
                <el-option label="华中" value="central" />
              </el-select>
            </el-form-item>

            <el-form-item label="分类" required>
              <el-select v-model="attractionForm.category" placeholder="选择分类">
                <el-option label="自然风光" value="nature" />
                <el-option label="历史古迹" value="historical" />
                <el-option label="城市观光" value="urban" />
                <el-option label="美食体验" value="food" />
                <el-option label="购物中心" value="shopping" />
                <el-option label="户外活动" value="outdoor" />
              </el-select>
            </el-form-item>

            <el-form-item label="门票价格">
              <el-input-number
                v-model="attractionForm.price"
                :min="0"
                :precision="2"
                placeholder="请输入门票价格"
              />
            </el-form-item>

            <el-form-item label="游览时间(小时)">
              <el-input-number
                v-model="attractionForm.visit_time"
                :min="0.5"
                :step="0.5"
                placeholder="请输入游览时间"
              />
            </el-form-item>

            <el-form-item label="图片上传">
              <el-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :show-file-list="true"
                :before-upload="beforeUpload"
                drag
                name="image"
              >
                <el-icon class="el-icon--upload"><Upload /></el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
              <el-image
                v-if="attractionForm.image_url"
                :src="attractionForm.image_url"
                fit="cover"
                style="width: 200px; height: 150px; margin-top: 10px"
              />
            </el-form-item>

            <el-form-item label="景点描述" required>
              <el-input
                v-model="attractionForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入景点描述"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="addAttraction" :loading="addingAttraction"
                >保存</el-button
              >
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="查看景点" name="view-attractions">
        <div class="tab-content">
          <h3 class="section-title">景点管理</h3>
          <el-table
            :data="attractions"
            row-key="id"
            stripe
            class="attraction-table"
            style="min-height: 400px; border: 1px solid #e4e7ed"
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="景点名称" />
            <el-table-column prop="region" label="所在地区">
              <template #default="scope">
                {{ getRegionName(scope.row.region) }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类">
              <template #default="scope">
                {{ getCategoryName(scope.row.category) }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="门票价格" width="120">
              <template #default="scope">
                {{ scope.row.price ? `¥${Number(scope.row.price).toFixed(2)}` : '免费' }}
              </template>
            </el-table-column>
            <el-table-column prop="visit_time" label="游览时间(小时)" width="150" />
            <el-table-column prop="image_url" label="图片" width="120">
              <template #default="scope">
                <el-image
                  v-if="scope.row.image_url"
                  :src="scope.row.image_url"
                  fit="cover"
                  style="width: 80px; height: 60px"
                />
                <span v-else>无图片</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="scope">
                {{
                  scope.row.created_at
                    ? dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss')
                    : 'Invalid Date'
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editAttraction(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteAttraction(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="查看用户" name="view-users">
        <div class="tab-content">
          <h3 class="section-title">用户管理</h3>
          <el-table :data="users" stripe class="user-table">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="created_at" label="注册时间" width="180">
              <template #default="scope">
                {{
                  scope.row.created_at
                    ? dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss')
                    : 'Invalid Date'
                }}
              </template>
            </el-table-column>
            <el-table-column prop="is_admin" label="是否管理员" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.is_admin === 1" type="success">是</el-tag>
                <el-tag v-else type="info">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteUser(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑景点对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑景点" width="600px" @close="resetEditForm">
      <el-form :model="editForm" label-width="120px" class="attraction-form">
        <el-form-item label="景点名称" required>
          <el-input
            v-model="editForm.name"
            placeholder="请输入景点名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="所在地区" required>
          <el-select v-model="editForm.region" placeholder="选择地区">
            <el-option label="华北" value="north" />
            <el-option label="华东" value="east" />
            <el-option label="华南" value="south" />
            <el-option label="西南" value="southwest" />
            <el-option label="西北" value="northwest" />
            <el-option label="东北" value="northeast" />
            <el-option label="华中" value="central" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" required>
          <el-select v-model="editForm.category" placeholder="选择分类">
            <el-option label="自然风光" value="nature" />
            <el-option label="历史古迹" value="historical" />
            <el-option label="城市观光" value="urban" />
            <el-option label="美食体验" value="food" />
            <el-option label="购物中心" value="shopping" />
            <el-option label="户外活动" value="outdoor" />
          </el-select>
        </el-form-item>

        <el-form-item label="门票价格">
          <el-input-number
            v-model="editForm.price"
            :min="0"
            :precision="2"
            placeholder="请输入门票价格"
          />
        </el-form-item>

        <el-form-item label="游览时间(小时)">
          <el-input-number
            v-model="editForm.visit_time"
            :min="0.5"
            :step="0.5"
            placeholder="请输入游览时间"
          />
        </el-form-item>

        <el-form-item label="图片">
          <el-image
            v-if="editForm.image_url"
            :src="editForm.image_url"
            fit="cover"
            style="width: 200px; height: 150px"
          />
          <span v-else>无图片</span>
        </el-form-item>

        <el-form-item label="景点描述" required>
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入景点描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateAttraction" :loading="updatingAttraction"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="userEditDialogVisible"
      title="编辑用户"
      width="400px"
      @close="resetUserEditForm"
    >
      <el-form :model="userEditForm" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input
            v-model="userEditForm.username"
            placeholder="请输入用户名"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="是否管理员">
          <el-switch v-model="userEditForm.is_admin" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userEditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser" :loading="updatingUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import axios from 'axios'
import api from '@/services/api'
import dayjs from 'dayjs'

// 认证store
const authStore = useAuthStore()

// 激活的标签页
const activeTab = ref('view-attractions')

// 景点表单
const attractionForm = ref({
  name: '',
  region: '',
  category: '',
  price: null,
  visit_time: null,
  image_url: '',
  description: '',
})

// 编辑表单
const editForm = ref({
  id: null,
  name: '',
  region: '',
  category: '',
  price: null,
  visit_time: null,
  image_url: '',
  description: '',
})

// 编辑对话框
const editDialogVisible = ref(false)

// 用户编辑表单
const userEditForm = ref({
  id: null,
  username: '',
  is_admin: 0,
})

// 用户编辑对话框
const userEditDialogVisible = ref(false)

// 加载状态
const addingAttraction = ref(false)
const updatingAttraction = ref(false)
const loadingAttractions = ref(false)
const loadingUsers = ref(false)
const updatingUser = ref(false)

// 数据列表
const attractions = ref([])
const users = ref([])

// 上传相关
const uploadUrl = computed(
  () => `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/upload`,
)

const uploadHeaders = computed(() => {
  const token = authStore.token
  return {
    Authorization: `Bearer ${token}`,
  }
})

// 地区映射
const regionMap = {
  north: '华北',
  east: '华东',
  south: '华南',
  southwest: '西南',
  northwest: '西北',
  northeast: '东北',
  central: '华中',
}

// 分类映射
const categoryMap = {
  nature: '自然风光',
  historical: '历史古迹',
  urban: '城市观光',
  food: '美食体验',
  shopping: '购物中心',
  outdoor: '户外活动',
}

// 获取地区名称
const getRegionName = (value) => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  return regionMap[stringValue] || stringValue
}

// 获取分类名称
const getCategoryName = (value) => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  return categoryMap[stringValue] || stringValue
}

// 上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

// 上传成功处理
const handleUploadSuccess = (response) => {
  if (response && response.success) {
    attractionForm.value.image_url = response.data.image_url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 上传失败处理
const handleUploadError = () => {
  ElMessage.error('图片上传失败')
}

// 添加景点
const addAttraction = async () => {
  try {
    addingAttraction.value = true

    // 验证表单
    if (
      !attractionForm.value.name ||
      !attractionForm.value.region ||
      !attractionForm.value.category ||
      !attractionForm.value.description
    ) {
      ElMessage.error('请填写必填字段')
      return
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/attractions`,
      attractionForm.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    )

    if (response.data.success) {
      ElMessage.success('景点添加成功')
      resetForm()
      fetchAttractions()
      activeTab.value = 'view-attractions'
    } else {
      ElMessage.error(response.data.message || '添加失败')
    }
  } catch (error) {
    console.error('Add attraction error:', error)
    ElMessage.error('服务器错误，请稍后重试')
  } finally {
    addingAttraction.value = false
  }
}

// 重置表单
const resetForm = () => {
  attractionForm.value = {
    name: '',
    region: '',
    category: '',
    price: null,
    visit_time: null,
    image_url: '',
    description: '',
  }
}

// 获取景点列表
const fetchAttractions = async () => {
  try {
    loadingAttractions.value = true

    const response = await api.get('/admin/attractions')

    if (response.success) {
      attractions.value = response.data || []
    } else {
      ElMessage.error(response.message || '获取景点列表失败')
    }
  } catch (error) {
    console.error('Fetch attractions error:', error)
    ElMessage.error(error.message || '服务器错误，请稍后重试')
  } finally {
    loadingAttractions.value = false
  }
}

// 获取用户列表
const fetchUsers = async () => {
  try {
    loadingUsers.value = true

    const response = await api.get('/admin/users')

    if (response.success) {
      users.value = response.data || []
    } else {
      ElMessage.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('Fetch users error:', error)
    ElMessage.error(error.message || '服务器错误，请稍后重试')
  } finally {
    loadingUsers.value = false
  }
}

// 编辑景点
const editAttraction = (attraction) => {
  editForm.value = { ...attraction }
  editDialogVisible.value = true
}

// 更新景点
const updateAttraction = async () => {
  try {
    updatingAttraction.value = true

    // 验证表单
    if (
      !editForm.value.name ||
      !editForm.value.region ||
      !editForm.value.category ||
      !editForm.value.description
    ) {
      ElMessage.error('请填写必填字段')
      return
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/attractions/${editForm.value.id}`,
      editForm.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    )

    if (response.data.success) {
      ElMessage.success('景点更新成功')
      editDialogVisible.value = false
      fetchAttractions()
    } else {
      ElMessage.error(response.data.message || '更新失败')
    }
  } catch (error) {
    console.error('Update attraction error:', error)
    ElMessage.error('服务器错误，请稍后重试')
  } finally {
    updatingAttraction.value = false
  }
}

// 删除景点
const deleteAttraction = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个景点吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/attractions/${id}`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    )

    if (response.data.success) {
      ElMessage.success('景点删除成功')
      fetchAttractions()
    } else {
      ElMessage.error(response.data.message || '删除失败')
    }
  } catch (error) {
    if (error.name !== 'Cancel') {
      console.error('Delete attraction error:', error)
      ElMessage.error('服务器错误，请稍后重试')
    }
  }
}

// 重置编辑表单
const resetEditForm = () => {
  editForm.value = {
    id: null,
    name: '',
    region: '',
    category: '',
    price: null,
    visit_time: null,
    image_url: '',
    description: '',
  }
}

// 重置用户编辑表单
const resetUserEditForm = () => {
  userEditForm.value = {
    id: null,
    username: '',
    is_admin: 0,
  }
}

// 编辑用户
const editUser = (user) => {
  userEditForm.value = { ...user }
  userEditDialogVisible.value = true
}

// 更新用户
const updateUser = async () => {
  try {
    updatingUser.value = true

    // 验证表单
    if (!userEditForm.value.username) {
      ElMessage.error('请填写用户名')
      return
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/users/${userEditForm.value.id}`,
      userEditForm.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    )

    if (response.data.success) {
      ElMessage.success('用户更新成功')
      userEditDialogVisible.value = false
      fetchUsers()
    } else {
      ElMessage.error(response.data.message || '更新失败')
    }
  } catch (error) {
    console.error('Update user error:', error)
    ElMessage.error('服务器错误，请稍后重试')
  } finally {
    updatingUser.value = false
  }
}

// 删除用户
const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm('确定要删除这个用户吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/users/${user.id}`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    )

    if (response.data.success) {
      ElMessage.success('用户删除成功')
      fetchUsers()
    } else {
      ElMessage.error(response.data.message || '删除失败')
    }
  } catch (error) {
    if (error.name !== 'Cancel') {
      console.error('Delete user error:', error)
      ElMessage.error('服务器错误，请稍后重试')
    }
  }
}

// 处理标签页切换
const handleTabChange = (tab) => {
  if (tab === 'view-attractions') {
    fetchAttractions()
  } else if (tab === 'view-users') {
    fetchUsers()
  }
}

// 页面加载时获取数据
onMounted(() => {
  if (activeTab.value === 'view-attractions') {
    fetchAttractions()
  } else if (activeTab.value === 'view-users') {
    fetchUsers()
  }
})
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-header {
  margin-bottom: 30px;
  text-align: center;
}

.admin-tabs {
  margin-bottom: 30px;
}

.tab-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.attraction-form {
  max-width: 800px;
}

.section-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.attraction-table,
.user-table {
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
