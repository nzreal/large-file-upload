<template>
  <div class="content">
    <Upload :onChange="onFileChange" :onUpload="onUpload">上传</Upload>
    <div class="total-meter">
      <div class="title">总进度条:</div>
      <Meter class="meter-body" :value="loaded" />
    </div>
    <Table :columns="columns" :dataSource="progressList" />
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import Upload from "@/components/Upload";
import Meter from "@/components/Meter";
import Table from "@/components/Table";
import request from "@/utils/request";

import { createFileChunkRequests, limitRequests } from "@/utils/largeFile";

function useProgress(fileInfo) {
  // 切片进度条和总进度
  const chunkProgressList = reactive([]);
  const totalProgress = ref(0);

  const createProgressHandler = (idx) => (e) => {
    const { loaded, total, hash } = e;
    chunkProgressList[idx] = {
      hash,
      loaded,
      total: total,
      progress: (loaded / total) * 100,
    };
    totalProgress.value =
      (chunkProgressList.map((item) => item.loaded).sum() / fileInfo.size) *
      100;
  };

  return {
    totalProgress,
    chunkProgressList,
    createProgressHandler,
  };
}

function useTableFunc() {
  const columns = [
    {
      title: "文件hash",
      dataIndex: "hash",
    },
    {
      title: "文件大小",
      dataIndex: "size",
    },
    {
      title: "下载进度",
      dataIndex: "progress",
    },
  ];

  return {
    columns,
  };
}

export default {
  name: "Home",
  components: {
    Upload,
    Meter,
    Table,
  },
  setup() {
    const fileInfo = reactive({
      size: undefined,
      fileName: undefined,
    });

    const progressList = ref([]);

    const {
      totalProgress,
      createProgressHandler,
      chunkProgressList,
    } = useProgress(fileInfo);

    const onFileChange = (file) => {
      fileInfo.size = file.size;
      fileInfo.fileName = file.name;
    };

    const mergeChunk = (data) =>
      request({
        url: "/mergeChunk",
        data,
      });

    const onUpload = async (file) => {
      const filename = file.name;
      const chunkSize = 10 * 1024 * 1024;
      // 切片上传的请求队列
      const chunkList = createFileChunkRequests(file, chunkSize);
      const requestList = chunkList.map((formData, index) => {
        progressList.value.push({
          hash: formData.get("hash"),
          loaded: 0,
          total: formData.get("chunk").size,
          progress: 0,
        });
        // 将request再包装一层用于控制并发量
        return () =>
          request({
            url: "/upload",
            data: formData,
            onProgress: (e) => {
              e.hash = formData.get("hash");
              createProgressHandler(index)(e);
            },
          });
      });
      // 控制上传并发量
      await limitRequests(requestList);

      return mergeChunk({ filename, size: chunkSize }).then((res) => {
        if (res.data.code === 200) {
          setTimeout(() => {
            alert("文件上传成功");
            totalProgress.value = 0;
          }, 1000);
        }
      });
    };

    const { columns } = useTableFunc();

    watch(chunkProgressList, (newList) => {
      progressList.value.forEach((item, i) => {
        if (newList[i]) {
          item.loaded = newList[i].loaded;
          item.progress = newList[i].progress;
        }
      });
    });

    return {
      loaded: totalProgress,
      onFileChange,
      progressList,
      onUpload,
      columns,
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 70%;
  min-width: 800px;
  margin: auto;
}

.total-meter {
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 18px;

  .title {
    display: flex;
    width: 80px;
    min-width: 80px;
    line-height: 100%;
    font-weight: bold;
  }

  .meter-body {
    margin-left: 15px;
    width: 100%;
    // min-width: 1000px;
    height: 20px;
  }
}
</style>
