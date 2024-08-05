import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Styles/Percent.css';




/*function PercentFile() {
    const [fileCount, setFileCount] = useState(null);
    const TOTAL_FILES = 13;

    useEffect(() => {
        const fetchFileCount = () => {
            axios.get('http://localhost:3001/api/files-count')
                .then(response => {
                    setFileCount(response.data.fileCount);
                })
                .catch(error => {
                    console.error('Não foi possivel acessar o servidor!', error);
                });
        };

        // Fetch the initial count
        fetchFileCount();

        // Set up an interval to fetch the file count every second
        const intervalId = setInterval(fetchFileCount, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const calculatePercentage = () => {
        if (fileCount !== null) {
            return (fileCount / TOTAL_FILES) * 100;
        }
        return 0;
    };

    
    return (
        <div className="App">
        <header className="App-header">
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${calculatePercentage()}%` }}
                ></div>
            </div>
            {fileCount !== null ? (
                <p>{calculatePercentage().toFixed(0)}%</p>
            ) : (
                <p>Loading...</p>
            )}
        </header>
        </div>
    );
}

export default PercentFile;*/