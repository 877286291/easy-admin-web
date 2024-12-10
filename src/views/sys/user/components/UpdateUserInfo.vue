<script lang="ts" setup>
import { ref, watch } from "vue";
import { getRolesByUserId, type UserInfo } from "@/api/user";
import { getRoleList } from "@/api/role";
import ReSegmented from "@/components/ReSegmented";
// 定义组件接收的 props
const props = defineProps({
  drawerVisible: Boolean,
  userInfo: Object as PropType<UserInfo>
});

// 定义事件发射器
const emit = defineEmits(["update:drawerVisible"]);

// 使用一个 ref 变量来管理可见性状态
const localDrawerVisible = ref(props.drawerVisible);
const localUserInfo = ref(props.userInfo);
let userRoles = ref([]);
const roleList = ref([]);
const genderOptions = ref([
  { label: "未知", value: 0 },
  { label: "男", value: 1 },
  { label: "女", value: 2 }
]);
// 监听 props 的变化并更新
watch(
  () => [props.drawerVisible, props.userInfo],
  ([newDrawerVisible, newUserInfo]) => {
    localDrawerVisible.value = newDrawerVisible;
    localUserInfo.value = newUserInfo;
    if (newDrawerVisible) {
      getRoleList().then(response => {
        roleList.value = response.data;
        getRoles(localUserInfo.value.id);
      });
    }
  }
);

// 确认按钮点击事件
function confirmClick() {
  console.log("confirm click");
}

// 关闭抽屉的方法，发射事件通知父组件更新
function closeDrawer() {
  emit("update:drawerVisible", false);
}
const getRoles = (userId?: string) => {
  userRoles.value = [];
  getRolesByUserId(userId).then(response => {
    response.data.forEach(role => {
      userRoles.value.push({
        value: role.code,
        label: role.name
      });
    });
  });
};
</script>
<template>
  <!-- 使用 localDrawerVisible 进行双向绑定 -->
  <el-drawer
    v-model="localDrawerVisible"
    :with-header="true"
    direction="rtl"
    size="35%"
    :destroy-on-close="true"
    @close="closeDrawer"
  >
    <!-- 抽屉的头部 -->
    <template #header>
      <span>编辑用户信息</span>
    </template>

    <!-- 用户信息显示 -->
    {{ localUserInfo.userInfo }}

    <!-- 表单 -->
    <el-form label-position="top" label-width="100px">
      <!-- 用户名和昵称 -->
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="localUserInfo.username" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="昵称" prop="nickname" required>
            <el-input v-model="localUserInfo.nickname" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 手机号和邮箱 -->
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="手机号" prop="phone" required>
            <el-input v-model="localUserInfo.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="localUserInfo.email" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 角色选择 -->
      <el-form-item label="角色">
        <el-select
          v-model="userRoles"
          placeholder="请选择角色"
          size="default"
          multiple
        >
          <el-option
            v-for="item in roleList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="11"
          ><el-form-item label="性别">
            <re-segmented
              :options="genderOptions"
              :resize="true"
            /> </el-form-item
        ></el-col>
        <el-col :span="11"
          ><el-form-item label="用户状态">
            <el-switch
              v-model="localUserInfo.enabled"
              class="customSwitch2"
              style="
                --el-switch-on-color: #6abe39;
                --el-switch-off-color: #e84749;
              "
              active-text="已启用"
              inactive-text="已禁用"
            /> </el-form-item
        ></el-col>
      </el-row>
    </el-form>

    <!-- 抽屉的底部 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 0;
}
.customSwitch2 {
  .el-switch__label--left {
    position: relative;
    left: 80px;
    color: #fff;
    z-index: -1111;
    span {
      width: 60px;
    }
  }
  .el-switch__label--right {
    position: relative;
    right: 80px;
    color: #fff;
    z-index: -1111;
    span {
      display: inline-block;
      width: 60px;
    }
  }
  .el-switch__core {
    width: 65px !important;
  }
  .el-switch__label--right.is-active {
    z-index: 10;
    color: #fff !important;
  }
  .el-switch__label--left.is-active {
    z-index: 10;
    color: #fff !important;
  }
}
</style>
