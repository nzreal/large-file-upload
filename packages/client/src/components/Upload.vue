<template>
  <div>
    <input type="file" id="file" @change="onFileChange" />
    <button class="btn selectBtn" @click="selectFile">
      <slot v-if="!fileInfo.isFile" />
      <div v-else>重新选择</div>
    </button>
    &nbsp;
    <div class="fileName">{{ fileInfo.isFile ? fileInfo.fileName : '暂无选择文件' }}</div>&nbsp;
    <button v-if="fileInfo.isFile" class="btn upload" @click="onConfirm">上传</button>
    &nbsp;
    <button v-if="fileInfo.isFile" class="btn cancel" @click="onCancel">取消</button>
  </div>
</template>

<script>
// import { ref } from "vue";
import { useReactive } from "@/utils/utils";

const useBtnFunc = (props) => {
  const [fileInfo, setFile, resetFile] = useReactive({
    isFile: false,
    fileName: undefined,
    size: undefined,
    file: undefined,
  });

  const selectFile = () => document.getElementById("file").click();

  const onFileChange = (e) => {
    const {
      files: [file],
    } = e.target;
    if (!file) {
      return;
    }
    setFile({
      isFile: true,
      fileName: file.name,
      size: file.size,
      file,
    });
    props.onChange(file);
  };

  const onCancel = () => {
    resetFile();
    const obj = document.getElementById("file");
    obj.value = "";
  };

  const onConfirm = async () => {
    await props.onUpload(fileInfo.file);
    setTimeout(() => {
      resetFile();
    }, 1000);
  };

  return {
    fileInfo,
    selectFile,
    onFileChange,
    onCancel,
    onConfirm,
  };
};

export default {
  name: "Upload",
  props: {
    onChange: Function,
    onUpload: Function,
  },
  setup(props) {
    const {
      fileInfo,
      selectFile,
      onFileChange,
      onCancel,
      onConfirm,
    } = useBtnFunc(props);

    return {
      fileInfo,
      selectFile,
      onFileChange,
      onCancel,
      onConfirm,
    };
  },
};
</script>

<style lang="less" scoped>
.btn {
  text-align: center;
  border-radius: 3px;
  min-width: 70px;
  height: 30px;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 1px;
  transition: 0.15s ease-in;

  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }

  &:focus {
    opacity: 0.75;
    outline: 0;
  }
}

.selectBtn {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(36, 36, 36);
  color: rgb(0, 0, 0);
}

.upload {
  background-color: rgb(64, 169, 255);
  border: 1px solid rgb(25, 152, 255);
  color: rgb(255, 255, 255);
}

.cancel {
  background-color: rgb(255, 87, 87);
  border: 1px solid rgb(243, 38, 38);
  color: rgb(255, 255, 255);
}

.fileName {
  text-align: center;
  display: inline-block;
  min-width: 100px;
}

#file {
  display: none;
}
</style>
