import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './filme-info.css'
import { toast } from 'react-toastify'

function Filme () {
    const { id } = useParams()
    const navigate = useNavigate()
    const [filme, setFilme] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadFilme(){
            await api.get(`/movie/${id}`, {
                params: {
                    api_key: "28fc232cc001c31e8a031f419d0a14ca",
                    language: "pt-BR"
                }
            })
            .then((response)=> {
                setFilme(response.data)
                setLoading(false)
            }).catch(() => {
                navigate("/", {replace: true})
                return
            })
        }

        loadFilme()

        return () => {

        }
    },[navigate, id])

    function salvarFilme () {
        const minhaLista = localStorage.getItem("@primeflix")

        let filmesSalvos = JSON.parse(minhaLista) || []

        const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filme.id)

        if(hasFilme) {
            toast.warn("Esse filme já está na sua lista")
            return
        }

        filmesSalvos.push(filme)
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos))
        toast.success("Você salvou um filme!")
    }

    if (loading) {
        return (
            <div className='loading'>
                <h2>Carregando detalhes...</h2>
            </div>
        )
    }

    return (
        <div className='filme-info'>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} />
            <h1>{filme.title}</h1>
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação: {filme.vote_average} / 10</strong>
            <div className='area-buttons'>
                <a onClick={salvarFilme}>Salvar</a>
                <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>Trailer</a>
            </div>
        </div>
    )
}

export default Filme