import Axios, {AxiosResponse} from "axios"


const API_KEY = "7fe5cda06031469cf40d04ee9674ff71";

const ax = Axios.create({
    baseURL: "https://api.openweathermap.org/data",
    params: {appid: API_KEY} // ...&appid=7fe5cda06031469cf40d04ee9674ff71
})




type WeatherT = {
    coord: {lon: number, lat: number}
}
export async function apiWGetWeather(latitude: number, longitude: number): Promise<AxiosResponse<WeatherT>>{
    return ax.get("2.5/weather", {
        params: {lat: latitude, lon: longitude}
    })
}