const fs = require('fs');
const path = require('path');

class ListDir {
    constructor(folderPath) {
        this.folderPath = folderPath;
    }

    findLatestDirectory(callback) {
        fs.readdir(this.folderPath, (err, files) => {
            if (err) {
                callback('Erro ao ler o diretório: ' + err, null);
                return;
            }

            const directories = files.filter(file => fs.statSync(path.join(this.folderPath, file)).isDirectory());

            let latestDirectory;
            let latestTime = 0;
            directories.forEach(directory => {
                const stats = fs.statSync(path.join(this.folderPath, directory));
                const mtime = new Date(stats.mtime).getTime();
                if (mtime > latestTime) {
                    latestTime = mtime;
                    latestDirectory = directory;
                }
            });

            if (latestDirectory) {
                const latestDirectoryPath = path.join(this.folderPath, latestDirectory);
                callback(null, latestDirectoryPath);
            } else {
                callback('Nenhum diretório encontrado em ' + this.folderPath, null);
            }
        });
    }
}

module.exports = ListDir;
