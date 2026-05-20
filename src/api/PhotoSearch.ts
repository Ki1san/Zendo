import axios from 'axios'

const ApiPhoto  = axios.create({
    baseURL: 'https://api.pexels.com/v1',
    timeout: 1000,
    headers:
    {
        Authorization: import.meta.env.VITE_API_KEY_PEXEL
    }
})

export const FetchPhotos = async() => 
{
    try{
        const MathRandom = Math.floor(Math.random() * 100) + 1
        
        const responce = await ApiPhoto.get('/curated', {
            params:
            {
                page: MathRandom,
                per_page: 20

            }
        })

        return responce.data
    }
    catch(err: any)
    {
        console.error('Error ', err.response?.data || err.message)
        return undefined
    }
}