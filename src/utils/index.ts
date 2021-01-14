import path from 'path';
import fs from 'fs';
// 创建目录
export function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
// 拷贝文件
export function copyDir(src, dst) {
    // 读取目录中的所有文件/目录
    let paths = fs.readdirSync(src);
    paths.forEach(function (path) {
        let _src = src + '/' + path,
            _dst = dst + '/' + path,
            readable, writable;
        let st = fs.statSync(_src);
        // 判断是否为文件
        if (st.isFile()) {
            // 创建读取流
            readable = fs.createReadStream(_src);
            // 创建写入流
            writable = fs.createWriteStream(_dst);
            // 通过管道来传输流
            readable.pipe(writable);
        } else if (st.isDirectory()) {
            // 如果是目录则递归调用自身
            // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
            // 已存在
            if (fs.existsSync(_dst)) {
                copyDir(_src, _dst);
            } else {
                // 不存在
                fs.mkdirSync(_dst);
                copyDir(_src, _dst);
            }
        }
    });
}
