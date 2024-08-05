import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import '../../Styles/Status.css'


function ContainerStatus() {
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchContainerStatus = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("http://localhost:3001/containers");
      if (response.data.message) {
        setMessage(response.data.message);
        setContainers([]);
      } else {
        setMessage(null);
        setContainers(response.data);
      }
    } catch (error) {
      setError('Erro ao obter os dados dos contêineres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainerStatus();
    const interval = setInterval(fetchContainerStatus, 1000); // Atualiza a cada 10 segundos
    return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
  }, []);

  return (
    <div>
      <h2 className='h1status'>Status da ferramenta</h2>
      {error && <div>{error}</div>}
      {message && <div>{message}</div>}
      <ul>
        {containers.map(container => (
          <li key={container.id}>
            Ferramenta: {container.image} | Tempo de execução: {container.status}
            {' '}
            <div className="status-icon">
              {container.image === 'shiftleft/scan' && <FaSpinner className="spinner" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContainerStatus;



