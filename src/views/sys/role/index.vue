<script lang="ts" setup>
const tableData = [];
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Date" prop="date" width="180" />
    <el-table-column label="Name" prop="name" width="180" />
    <el-table-column label="Address" prop="address" />
  </el-table>
</template>

<style lang="scss" scoped></style>
