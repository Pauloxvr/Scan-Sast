const { exec } = require('child_process');

class DockerCommands {
    constructor() {}

    // Método para executar comandos Docker
    static executarComando(comando) {
        return new Promise((resolve, reject) => {
            exec(comando, (erro, stdout, stderr) => {
                if (erro) {
                    console.error("Erro ao executar o comando Docker: ${erro}");
                    reject(erro);
                    return;
                }
                resolve(stdout);
            });
        });
    }
}

module.exports = DockerCommands;