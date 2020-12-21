const express = require('express');
const multiparty = require('multiparty');
const fse = require('fs-extra');
const path = require('path');
const Response = require('../dao/Response');

const router = express.Router();

const UPLOAD_DIR = path.resolve(__dirname, '..', 'files');

// TODO:好像此处有点问题会导致文件部分损坏
const pipeStream = (path, writeStream) =>
  new Promise(async (resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on('end', () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });

async function mergeChunk(chunkPath, filename, size) {
  if (!fse.existsSync(chunkPath)) {
    return;
  }

  const chunks = fse.readdirSync(chunkPath);
  // 根据hash下表给文件切片排序
  chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);

  const pipeList = chunks.map((chunk, index) =>
    pipeStream(
      path.resolve(chunkPath, chunk),
      fse.createWriteStream(path.resolve(UPLOAD_DIR, filename), {
        start: index * size,
        end: (index + 1) * size,
      })
    )
  );
  await Promise.all(pipeList);

  fse.rmdirSync(chunkPath);
}

router.post('/upload', (req, res, next) => {
  fse.ensureDir(UPLOAD_DIR);
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return;
    }
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;

    const chunkDir = path.resolve(UPLOAD_DIR, filename + '-tmp');

    fse.ensureDirSync(chunkDir);
    // fse.writeFile(file, () => {
    //   console.log('文件接收成功')
    // })
    fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.json(
      new Response({
        msg: '切片传输成功',
      })
    );
  });
});

router.post('/mergeChunk', async (req, res, next) => {
  const { filename, size } = req.body;
  const chunkPath = path.resolve(UPLOAD_DIR, filename + '-tmp');
  await mergeChunk(chunkPath, filename, size);
  res.send(
    new Response({
      msg: '文件上传成功',
    })
  );
});

module.exports = router;
