import React , {useEffect , useState} from 'react';
import axios from 'axios';

const App = () => {
    const [message,setMessage] = useState('salam')

    const apiUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'http://backend:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            console.log(apiUrl)
          try {
            const response = await  axios.get(apiUrl);
            
            setMessage(response.data.message);
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchData();
      }, []);
      

    return (
        <div>
            <h1>My message from backen i : {message}</h1>
        </div>
    )
}

export default App;