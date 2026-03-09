export const localPathToFile = async (localPath, fileName = 'canvas-poster.jpg') => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    let blob;

    // ========== APP端专属处理（核心兼容） ==========
    if (systemInfo.platform === 'app-plus') {
      // 1. APP端路径标准化（兼容iOS/Android不同路径格式）
      let realPath = localPath;
      // Android端补全file://协议，iOS端自动兼容
      if (uni.osName === 'android' && !realPath.startsWith('file://')) {
        // Android绝对路径格式：file:///storage/emulated/0/Android/data/包名/_doc/xxx.jpg
        realPath = `file://${realPath}`;
      }
      // iOS端路径补全（可选，iOS默认识别_doc路径）
      if (uni.osName === 'ios' && !realPath.startsWith('file://')) {
        realPath = `file://${plus.io.convertLocalFileSystemURL(realPath)}`;
      }

      console.log('【APP端】最终文件路径：', realPath);

      // 2. APP端文件系统API（使用plus.io替代uni.getFileSystemManager，兼容性更强）
      const fileSystem = plus.io;
      // 读取文件为二进制数据
      const fileData = await new Promise((resolve, reject) => {
        fileSystem.resolveLocalFileSystemURL(realPath, (entry) => {
          entry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (err) => reject(err);
            fileReader.readAsArrayBuffer(file);
          }, (err) => reject(err));
        }, (err) => reject(err));
      });

      // 3. 转Blob对象
      blob = new Blob([fileData], { type: 'image/jpeg' });

    // ========== 小程序端处理 ==========
    } else if (systemInfo.platform !== 'h5' && uni.canIUse('getFileSystemManager')) {
      const fs = uni.getFileSystemManager();
      fs.accessSync(localPath); // 检查文件存在性
      const fileBuffer = fs.readFileSync(localPath);
      blob = new Blob([fileBuffer], { type: 'image/jpeg' });

    // ========== H5端处理 ==========
    } else {
      let h5Path = localPath;
      // H5端补全根路径
      if (!h5Path.startsWith('http') && !h5Path.startsWith('/')) {
        h5Path = `/${h5Path}`;
      }
      const response = await fetch(h5Path);
      if (!response.ok) throw new Error(`H5读取失败：${response.status}`);
      blob = await response.blob();
    }

    // ========== 统一生成File对象 ==========
    const file = new File([blob], fileName, {
      type: 'image/jpeg',
      lastModified: Date.now()
    });

    console.log(`【${systemInfo.platform}】转File成功：`, file);
    return file;
  } catch (error) {
    console.error('本地路径转File失败：', error.message);
    // APP端额外提示
    if (systemInfo.platform === 'app-plus') {
      console.error('APP端错误补充：请检查文件路径/权限，或确认文件是否存在');
    }
    throw error;
  }
};