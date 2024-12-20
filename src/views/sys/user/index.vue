<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getUserList, updateUserStatus, UserInfo } from "@/api/user";
import type { ComponentSize } from "element-plus";
import { message } from "@/utils/message";
import { ArrowDownBold } from "@element-plus/icons-vue";
import UpdateUserInfo from "./components/UpdateUserInfo.vue";

let current = ref(1);
let size = ref(30);
let total = ref(0);
const pageSize = ref<ComponentSize>("default");
const loading = ref(false);
const userList = ref([]);
const drawerVisible = ref(false);
let selectUserInfo = {} as UserInfo;

onMounted(() => {
  loading.value = true;
  getUserList({ current: current.value, size: size.value })
    .then(response => {
      if (response.code === 200) {
        current.value = response.data.current;
        size.value = response.data.size;
        total.value = response.data.total;
        userList.value = response.data.records;
      }
    })
    .finally(() => (loading.value = false));
});

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const getTagType = (genderName: string) => {
  switch (genderName) {
    case "男":
      return "primary";
    case "女":
      return "danger";
    default:
      return "info";
  }
};
const handleSwitchChange = (row: any) => {
  loading.value = true;
  updateUserStatus(row.id, row.enabled)
    .then(response => {
      if (response.code === 200) {
        message("更新用户状态成功", { type: "success" });
      } else {
        row.enabled = !row.enabled;
        message("更新用户状态失败");
      }
    })
    .finally(() => (loading.value = false));
};

function handleEditUserInfo(index: number, row: UserInfo) {
  drawerVisible.value = true;
  selectUserInfo = { ...row };
}
</script>

<template>
  <div>
    <UpdateUserInfo
      v-model:drawerVisible="drawerVisible"
      :user-info="selectUserInfo"
    />
    <el-table
      :data="userList"
      :highlight-current-row="true"
      :loading="loading"
      style="width: 100%"
      table-layout="auto"
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
      <el-table-column align="center" label="性别" prop="genderName">
        <template v-slot="{ row }">
          <el-tag :type="getTagType(row.genderName)">
            {{ row.genderName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="手机号" prop="phone" />
      <el-table-column align="center" label="状态" prop="enabled">
        <template v-slot="{ row }">
          <div class="custom-switch">
            <el-switch
              v-model="row.enabled"
              :loading="loading"
              active-text="已启用"
              inactive-text="已禁用"
              @change="handleSwitchChange(row)"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" prop="created" />
      <el-table-column
        align="center"
        label="上次登录时间"
        prop="lastLoginTime"
      />
      <el-table-column align="center" label="操作" width="180px">
        <template #default="scope">
          <el-link
            type="primary"
            @click="handleEditUserInfo(scope.$index, scope.row)"
          >
            修改
          </el-link>
          <el-divider direction="vertical" />
          <el-link type="danger"> 删除</el-link>
          <el-divider direction="vertical" />
          <el-link type="primary">
            更多
            <el-icon>
              <ArrowDownBold />
            </el-icon>
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="current"
        v-model:page-size="size"
        :page-sizes="[30, 50, 100]"
        :size="pageSize"
        :total="total"
        layout="sizes, prev, pager, next"
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
