import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

function FileCheck() {
  const [fileExists, setFileExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFile = async () => {
      setLoading(true);
      setError(null);
      setFileExists(null);

      try {
        const response = await axios.get('http://localhost:3001/check');
        if (response.status === 200) {
          setFileExists(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setFileExists(false);
        } else {
          setError('Erro ao verificar o arquivo');
        }
      } finally {
        setLoading(false);
      }
    };

    checkFile();

    const intervalId = setInterval(checkFile, 10000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {fileExists !== null && (
        <div>
          {fileExists ? (
            <FaCheck style={{ color: 'green', fontSize: '2em' }} />
          ) : (
            <FaTimes style={{ color: 'red', fontSize: '2em' }} />
          )}
        </div>
      )}
    </div>
  );
}

export default FileCheck;
