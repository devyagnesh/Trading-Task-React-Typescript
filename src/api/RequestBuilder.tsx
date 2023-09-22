import axios from "axios";

export const RequestBuilder = function(){
    const BASE_URL  = `https://www.alphavantage.co`;

    const BASE_REQUEST = axios.create({
        baseURL : BASE_URL,
        headers : {
            'Content-Type':'application/json',
        }
    });

    return BASE_REQUEST;
}

