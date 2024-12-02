<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getUserList } from "@/api/user";
import type { ComponentSize } from "element-plus";

let current = ref(1);
let size = ref(10);
let total = ref(0);
const pageSize = ref<ComponentSize>("default");

const userList = ref([]);
onMounted(() => {
  getUserList({ current: current.value, size: size.value }).then(response => {
    current.value = response.data.current;
    size.value = response.data.size;
    total.value = response.data.total;
    userList.value = response.data.records;
  });
});

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<template>
  <div>
    <el-table
      :data="userList"
      :highlight-current-row="true"
      style="width: 100%"
    >
      <el-table-column type="index" width="50" />
      <el-table-column align="center" label="头像" prop="avatar" width="180">
        <template v-slot="{ row }">
          <img
            :src="row.avatar"
            alt="avatar"
            style="width: 50px; height: 50px; border-radius: 50%"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名"
        prop="username"
        width="180"
      />
      <el-table-column
        align="center"
        label="昵称"
        prop="nickname"
        width="180"
      />
      <el-table-column align="center" label="性别" prop="genderName" />
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="手机号" prop="phone" />
      <el-table-column align="center" label="状态" prop="enabled">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" prop="created" />
      <el-table-column
        align="center"
        label="上次登录时间"
        prop="lastLoginTime"
      />
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="current"
        v-model:page-size="size"
        :page-sizes="[10, 30, 50, 100]"
        :size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
