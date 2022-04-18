import fetch from  'node-fetch'

async function _auth(token,endpoint='login',query='') {
    //const response = await fetch(`https://triadonosstimetracking.herokuapp.com/api/${endpoint}?token=${token}&${query}`, {
    const response = await fetch(`http://localhost:5000/api/${endpoint}?token=${token}&${query}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' }
      })
      .catch(res=>{
          console.log(res);
      })
      
    const data = await response.json();
    
    return data;
}

export default _auth