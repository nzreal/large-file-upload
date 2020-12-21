const SIZE = 10 * 1024 * 1024;

// 控制并发数
async function limitRequests(requestList, limit = 4) {
  const reqLen = requestList.length;
  // 若请求数小于limit限制直接返回无需限制
  if (reqLen <= limit) {
    return Promise.all(requestList.map((request) => request()));
  }

  let completeCount = 0; // 完成
  let pendingCount = 0; // 请求中
  return new Promise((resolve) => {
    const loop = () => {
      while (completeCount + pendingCount < reqLen && pendingCount < limit) {
        pendingCount++;
        const request = requestList.shift();
        request().then(() => {
          completeCount++;
          pendingCount--;
          if (completeCount === reqLen) {
            // 当所有请求都结束后
            resolve();
          } else loop();
        });
      }
    };
    loop();
  });
}

function createFileChunks(file, chunkSize = SIZE) {
  // 切片文件
  const chunkList = [];
  const fileSize = file.size;
  let curSize = 0;
  while (curSize < fileSize) {
    chunkList.push({ file: file.slice(curSize, curSize + chunkSize) });
    curSize += chunkSize;
  }
  return chunkList;
}

function createFileChunkRequests(file, chunkSize, newName) {
  const { name } = file;
  const filename = newName || name;
  const chunkList = createFileChunks(file, chunkSize).map(
    ({ file }, index) => ({
      chunk: file,
      hash: filename + '_' + index,
    })
  );
  // 发送请求的list
  const requestList = chunkList.map(({ chunk, hash }) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('hash', hash);
    formData.append('filename', filename);
    return formData;
  });

  return requestList;
}

export { createFileChunkRequests, createFileChunks, limitRequests };
