import React, { useState } from "react";
import { TbLogout } from 'react-icons/tb';
import api from '../config/configAPI';
import ContainerStatus from './ContainerStatus';
import Results from "./Results";
//import PercentFile from "./Percent";
import '../../Styles/MainPage.css';
import CheckFile from './CheckFile';



export default function HomeCrud() {
  
  const sair = () => {
    localStorage.clear();
    window.location.reload();
  }

  const [arquivo, setArquivo] = useState('');
  const [status, setStatus] = useState({
    type:'',
    mensagem: ''
  });

  const uploadArquivo = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const headers = {
      'headers':{
        'Content-Type': 'multipart/form-data'
      }
    }
    await api.post('/upload-arquivo', formData, headers)
    .then((response) => {
      //console.log(response);
      setStatus({
        type:'success',
        mensagem: response.data.mensagem
      });
      const botaoEnviar = document.getElementById('Enviar');

      // Desativar o botão 'Enviar'
      botaoEnviar.disabled = true;

      const botaoScan = document.getElementById('Scann');
      botaoScan.disabled = false; 
    }).catch((err) => {
      if(err.response){
        setStatus({
          type:'error',
          mensagem: err.response.data.mensagem
        });
      }else{
        setStatus({
          type:'error',
          mensagem: err.response.data.mensagem
        });
      }

    });

  }

   
  const scan = e => {
    e.preventDefault();
    api.post('/scann-arquivo')
    .then((response) => {
      setStatus({
        type:'APPS',
        mensagem: response.data.mensagem
      });
    });
  }
  

  return (
    <body>
    <div className="main"> 
    <div className="content">
      <button onClick={sair}
       className="exit">
        <TbLogout/>
      </button>
    </div>
      <h2>Upload do arquivo compactado a ser escaneado</h2>
      {status.type === 'success'? <p style={{color: "green"}}>{status.mensagem}</p>: ""}
      {status.type === 'error'? <p style={{color: "red"}}>{status.mensagem}</p>: ""}
      <form onSubmit={uploadArquivo} enctype="multpart/form-data" method="post">
        <input type="file" name="arquivo" onChange={e => setArquivo(e.target.files[0])} required/> <br/><br/>
        <button type="submit" id="Enviar" class="style-button">Enviar</button><br/>
      </form>
      <form onSubmit={scan}>        
        <button type="submit" id="Scann" disabled class="style-button">Escanear</button>
      </form>
      {status.type === 'APPS'? <p style={{color: "#ADD8E6"}}>{status.mensagem}</p>: ""}      
      <ContainerStatus/>
      <CheckFile/> 
      <Results/>      
    </div>
    </body>  
  );
};