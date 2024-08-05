import React from 'react';
import Axios from 'axios';
//import '../../Styles/Resultados.css'

function Results() {
  
  const handleButtonClick = async (e) => { 

    e.preventDefault(); // Previne comportamento padrão de recarregar a página
    try {
      const response = await Axios.get('http://localhost:3001/results');
      
      if (response.status === 200) {
        window.location.href = 'http://localhost:3001/depscan-report-universal.html';
      }
    } catch (error) {
      console.error('Erro ao obter os dados:', error);
    }
  };

  return (    
    <div className="contentRes">
      <header>
      <h3>Redirecionar para a página de resultados</h3>
      <button onClick={handleButtonClick} id="Result" class='style-button'>Redirecionar</button>
      </header>
    <div class='vazia'>

    </div>
    </div>
  );
}

export default Results;