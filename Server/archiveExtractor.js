const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const unrar = require('node-unrar');

class ArchiveExtractor {
    constructor() {}

    // Função para extrair arquivos ZIP
    extractZip(zipFilePath, extractPath) {
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractPath, true);
    }

    // Função para extrair arquivos RAR
    extractRar(rarFilePath, extractPath) {
        unrar.unrar(rarFilePath, extractPath, null, (err, files) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(files);
        });
    }

    // Verifica o tipo de arquivo e chama a função correspondente para extrair
    extractArchive(archivePath, extractPath) {
        const ext = path.extname(archivePath).toLowerCase();
        if (ext === '.zip') {
            this.extractZip(archivePath, extractPath);
        } else if (ext === '.rar') {
            this.extractRar(archivePath, extractPath);
        } else {
            console.error(archivePath);
        }
    }
}

module.exports = ArchiveExtractor;
