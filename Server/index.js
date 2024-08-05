const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const uploadUser = require('./middlewares/uploadArquivo');
const saltRounds = 10;
const DockerCommands = require('./DockerCommands');
var pathArquivo = '';

{/*Conexão Com o banco de dados */}

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "app",
});

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Acces-Control-Allow-Headers", "X-PINGOTHER, Content-type, Authorization");
  app.use(cors());
  next();
});


app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length == 0) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO usuarios (email, password) VALUE (?,?)",
          [email, hash],
          (error, response) => {
            if (err) {
              res.send(err);
            }

            res.send({ msg: "Usuário cadastrado com sucesso" });
          }
        );
      });
    } else {
      res.send({ msg: "Email já cadastrado" });
    }
  });
});

{/*Verificação de login*/}

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (error) {
          res.send(error);
        }
        if (response === true) {
          res.send(response)
          
        } else {
          res.send({ msg: "email ou senha incorreta" });
        }
      });
    } else {
      res.send({ msg: "Usuário não registrado!" });
    }
  });
});

{/* Upload do arquivo */}
//const fs = require('fs');
const path = require('path');
const ArchiveExtractor = require('./archiveExtractor');
const fs = require('fs').promises;

// Função recursiva para deletar diretórios e seus conteúdos
const deleteFilesInDirectory = async (directory) => {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    const deletePromises = files.map(async (file) => {
      const fullPath = path.join(directory, file.name);
      if (file.isDirectory()) {
        await deleteFilesInDirectory(fullPath); // Recursivamente excluir conteúdo do diretório
        await fs.rmdir(fullPath); // Excluir diretório
      } else {
        await fs.unlink(fullPath); // Excluir arquivo
      }
    });
    await Promise.all(deletePromises);
  } catch (err) {
    throw new Error(`Erro ao deletar arquivos e pastas no diretório ${directory}: ${err.message}`);
  }
};

app.post("/upload-arquivo", uploadUser.single('arquivo'), async (req, res) => {  
  
  // Pastas a serem limpas
  const folder1 = './public/tmp/';
  const folder2 = './public/Resultados/';
  const folder3 = './public/upload/';

  // Exclui todos os arquivos nas duas pastas
   deleteFilesInDirectory(folder1);
   deleteFilesInDirectory(folder2);
   deleteFilesInDirectory(folder3);

  if (req.file) {
    const pathArquivo = req.file.path;
    console.log(pathArquivo);    

    // Criar uma instância da classe
    const extractor = new ArchiveExtractor();

    // Caminho do arquivo de arquivo
    const archivePath = pathArquivo; // ou .rar

    // Pasta de extração temporária
    const extractPath = folder1;

    // Extrair o arquivo
    try {
      await extractor.extractArchive(pathArquivo, extractPath);
      return res.json({
        erro: false,
        mensagem: "Upload realizado com sucesso!" 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: true,
        mensagem: "Erro ao extrair o arquivo."
      });
    }
  } else {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: O arquivo não é compactado, upload não realizado com sucesso!"
    });
  }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{/* Scan do arquivo */}

app.post("/scann-arquivo", (req, res) => {
 
  const ListDir = require('./ListDir');

  const folderPath = './public/tmp';

  const PathScan = '../Server/';

  const listDir = new ListDir(folderPath);

  // Definindo uma função de retorno de chamada para encontrar o diretório mais recente
  const callback = async (err, latestDirectoryPath) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log('O diretório mais recente é:', latestDirectoryPath);
      
      var latestDirectoryPathTratado = latestDirectoryPath.replace("\\","/").replace("\\","/");

      // Chame o método executarComando com o comando Docker desejado
      DockerCommands.executarComando('docker run --rm -e "WORKSPACE=C:/Users/Paulo/Desktop/TelaLogin/Server" -v "C:/Users/Paulo/Desktop/TelaLogin/Server:/app:cached" shiftleft/scan scan --src /app/'+ latestDirectoryPathTratado +' --out_dir /app/public/Resultados')
        .then((stdout) => {
          console.log('Saída do comando Docker:', stdout);
        })
        .catch((error) => {
          console.error('Erro ao executar o comando Docker:', error);
        });

      return res.json({
        erro: false,
        mensagem:'Inciado o escaneamento do: ' + latestDirectoryPathTratado
      });
  };

  // Chamando o método findLatestDirectory com a função de retorno de chamada
  listDir.findLatestDirectory(callback);

});

const Docker = require('dockerode');

const docker = new Docker({ host: 'localhost', port: 2375 });

app.get('/containers', (req, res) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Erro ao listar contêineres:', err);
      res.status(500).json({ error: 'Erro ao listar contêineres' });
    } else {
      const runningContainers = containers.filter(containerInfo => containerInfo.State === 'running');
      if (runningContainers.length === 0) {
        res.json({ message: 'Ferramenta ainda não iniciada' });
      } else {
        const containerStatus = runningContainers.map(containerInfo => ({
          id: containerInfo.Id,
          name: containerInfo.Names[0],
          status: containerInfo.Status,
          image: containerInfo.Image
        }));
        res.json(containerStatus);
      }
    }
  });
});

app.use(express.static(path.join(__dirname, './public/Resultados')));

app.get('/results', (req, res) => {
  res.status(200).send('Dados obtidos com sucesso');
});

const fz = require('fs');
const pasta = require('path');

app.get('/api/files-count', (req, res) => {
  const directoryPasta = pasta.join(__dirname, './public/Resultados');

  fz.readdir(directoryPasta, (err, files) => {
      if (err) {
          return res.status(500).json({ error: 'Unable to scan directory' });
      }
      const fileCount = files.length;
      res.json({ fileCount });
  });
});

const fx = require('fs').promises;

app.get('/check', async (req, res) => {
  const directoryPath = path.join(__dirname, './public/Resultados');
  const specificFileName = 'depscan-report-universal.html';
  const filePath = path.join(directoryPath, specificFileName);

  try {
    await fx.access(filePath);
    return res.status(200).json({ message: 'Arquivo existe' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ message: 'Arquivo não existe' });
    } else {
      console.error('Erro ao verificar o arquivo', err);
      return res.status(500).json({ message: 'Erro ao verificar o arquivo' });
    }
  }
});


app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
