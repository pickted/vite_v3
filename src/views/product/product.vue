<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {getTableDataApi} from "@/api/product";
import {usePagination} from "@/hooks/usePagination";
import {CirclePlus, Delete, Download, Refresh, RefreshRight, Search} from "@element-plus/icons-vue";
import {ElMessage, FormInstance, ListItem, UploadProps} from "element-plus";
import {fileUpload} from "@/api/upload";
import {categoryList} from "@/api/category";

const {paginationData, handleSizeChange, handleCurrentChange} = usePagination();
defineOptions({
  name: "Product"
})

const dialogVisible = ref(false)
const loading = ref<boolean>(false)

const tableData = ref<[]>([])

const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  productName: "",
  productId: "",
  categoryName: ""
})

const form = reactive({
  productId: '',
  productName: '',
  productImage: '',
  categoryId: '',
  accountType: '',
  introduction: '',
})

const categoryInfos = ref<ListItem[]>([])

const imageUrl = ref<string>()

const getTableData = () => {
  getTableDataApi({
    currentPage: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    productName: searchData.productName || undefined,
    productId: searchData.productId || undefined,
    categoryName: searchData.categoryName || undefined
  }).then((response) => {
    paginationData.total = response.result.resultCount
    tableData.value = response.result.resultList
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
    console.log("product finally")
  })
}

const onSubmit = () => {
  console.log('submit!')
}

const handleUpdate = (row: any) => {

}

const handleDelete = (row: any) => {

}

const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}

const resetSearch = () => {
  console.log("111", searchFormRef.value?.resetFields())
  handleSearch()
}

const getCategoryList = () => {
  categoryList().then((response) => {
    categoryInfos.value = response.result
  })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log('beforeAvatarUpload')
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片大小不能超过2MB!')
    return false
  }
  return true
}

const fileUploadImg = (file: any) => {
  const formData = new FormData();
  console.log("file:", file)
  formData.append("file", file.file)
  fileUpload(formData).then((response) => {
    imageUrl.value = response.result.key;
    imageUrl.value = form.productImage
  })
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="productName" label="品牌名称">
          <el-input v-model="searchData.productName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="productId" label="品牌编号">
          <el-input v-model="searchData.productId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="categoryName" label="类目">
          <el-input v-model="searchData.categoryName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加品牌</el-button>
          <!--          <el-button type="danger" :icon="Delete">批量删除</el-button>-->
        </div>
        <!--        <div>-->
        <!--          <el-tooltip content="下载">-->
        <!--            <el-button type="primary" :icon="Download" circle />-->
        <!--          </el-tooltip>-->
        <!--          <el-tooltip content="刷新当前页">-->
        <!--            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />-->
        <!--          </el-tooltip>-->
        <!--        </div>-->
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <!--      <el-table-column type="selection" width="50" align="center"/>-->
          <el-table-column prop="productName" label="品牌名称" align="center"/>
          <!--      <el-table-column prop="roles" label="角色" align="center">-->
          <!--        <template #default="scope">-->
          <!--          <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>-->
          <!--          <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <el-table-column prop="productId" label="平台品牌编号" align="center"/>
          <el-table-column prop="specsNums" label="下属规格" align="center"/>
          <el-table-column prop="categoryName" label="类目" align="center">
            <!--        <template #default="scope">-->
            <!--          <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>-->
            <!--          <el-tag v-else type="danger" effect="plain">禁用</el-tag>-->
            <!--        </template>-->
          </el-table-column>
          <!--      <el-table-column prop="createTime" label="创建时间" align="center"/>-->
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!--    新增/修改-->
    <el-dialog v-model="dialogVisible" title="添加品牌" width="500" draggable>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="品牌名称:">
          <el-input v-model="form.productName"/>
        </el-form-item>
        <el-form-item label="品牌图片:">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="fileUploadImg"
          >
            <img v-if="imageUrl" :src="'https://equitymall.yuanjiazheng.com/file' + imageUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌类目:">
          <el-select v-model="form.categoryId" @click="categoryList" placeholder="请选择类目">
            <el-option v-for="item in categoryInfos" :key="item.valueOf()" :label="item.valueOf()" :value="item.valueOf()"/>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型:">
          <el-select v-model="form.accountType" placeholder="请选择账号类型">
            <el-option label="QQ" value="1"/>
            <el-option label="手机" value="2"/>
            <el-option label="邮箱" value="3"/>
            <el-option label="其他" value="4"/>
          </el-select>
        </el-form-item>

        <el-form-item label="使用说明">
          <el-input v-model="form.introduction" type="textarea"/>
        </el-form-item>
        <!--          <el-form-item>-->
        <!--            <el-button type="primary" @click="onSubmit">创建</el-button>-->
        <!--            <el-button>取消</el-button>-->
        <!--          </el-form-item>-->
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

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
