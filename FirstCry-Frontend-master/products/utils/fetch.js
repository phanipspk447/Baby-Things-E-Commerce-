import env from '../../env.obj.js';

async function fetchData(){
    try{
        let token = localStorage.getItem('token') || '';
        let res = await fetch(`${env.API_URL}/products`, {
            headers: {
                'authorization' : `Bearer ${token}`
            }
        });
        return await res.json();
        
    }catch(e){
        console.log(e);
    }
}
  
export default fetchData;