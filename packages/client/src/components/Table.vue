<template>
  <table class="the-table">
    <thead>
      <tr>
        <th v-for="(item) in columns" :key="item.dataIndex" class="table-title">{{item.title}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in dataSource" :key="item.hash">
        <td>{{item.hash}}</td>
        <td>{{getSize(item.total)}}</td>
        <td>
          <Meter class="chunkMeter" :value="item.progress" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Meter from "./Meter";
export default {
  name: "Table",
  components: { Meter },
  props: {
    columns: Array,
    dataSource: Array,
    rowKey: String,
  },
  setup() {
    function getSize(size) {
      if (size >= 1024) {
        return Math.floor(size / 1024) + " kb";
      } else if (size >= 1024 * 1024) {
        return Math.floor(size / 1024 / 1024) + " mb";
      }
    }

    return {
      getSize,
    };
  },
};
</script>

<style lang="less" scoped>
.the-table {
  border: 0;
  margin: 20px auto;
  border-collapse: collapse;
  width: 90%;
  padding: 15px;

  .divider {
    display: block;
    width: 100%;
    height: 0;
    border-top: 1px solid #dcdcdc;
  }

  thead {
    border-bottom: 1px solid #e7e7e7;
  }

  tbody {
    tr {
      border-bottom: 1px solid #e7e7e7;
      height: 35px;
      td {
        padding: 0 20px 0 20px;
        text-align: center;
      }
    }
  }

  .chunkMeter {
    width: 160px;
  }

  .table-title {
    color: rgb(82, 82, 82);
    padding: 10px;
  }
}
</style>