<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {getTableDataApi} from "@/api/product";
import {usePagination} from "@/hooks/usePagination";
import {CirclePlus, Delete, Download, Refresh, RefreshRight, Search} from "@element-plus/icons-vue";
import type {FormInstance} from "element-plus";

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
</style>
