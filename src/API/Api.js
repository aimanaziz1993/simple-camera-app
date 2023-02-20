import axios from "axios";

const get = async (url, params) => 
{
    const response = await axios.get(url, params).then((res) => {
        return res
    }).catch((err) => {
        console.log(err);
    });

    return response;
}

const post = async ( formData, url ) => {

    // const url = hash ? `http://localhost:3000/api/users?u_=${hash}` : `http://localhost:3000/api/users`;

    const response = await axios.post(url, formData).then((res) => {
        return res.data;

    }).catch((err) => {
        return err.response;
    })

    return response
}

const update = () => 
{

}

export {
    get,
    post,
    update
}

// function Api({ fileArray, details }) {

    
// }

// export default Api;