import React, { useEffect, useState,useContext } from 'react';
import MovieItem from './MovieItem';
import { UserContext } from './UserContext';


const Movies = (props) => {
    const [userContext] = useContext(UserContext);
    const [movies,setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const favoriteMovies= ()=> {
        fetch(process.env.REACT_APP_API_ENDPOINT+"movies/favorites", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${userContext.token}`}
        }).then( async response => {
            if(!response.ok) {
                console.log("error occurred");
            }else {
                const data = await response.json();
                console.log(data.movieList);
                setMovies(data.movieList);
            }
        }).catch( (err) => {console.log(err); } );
    }

    const popularHandler = ()=> {
        getMovieDetails(process.env.REACT_APP_MOVIE_ENDPOINT_HOME);
    }

    const handleOnChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const getMovieDetails = (urlString) => {
        fetch(urlString, {mode: 'cors'})
        .then((res)=> res.json())
        .then( (data) => {
            setMovies(data.results);
        })
    }

    const searchMovie = (event) => {
        event.preventDefault();
        const url = process.env.REACT_APP_MOVIE_ENDPOINT_SEARCH + searchTerm;
        if(searchTerm) {
            getMovieDetails(url);
        }
        setSearchTerm("");
    }

    useEffect(() => {
        getMovieDetails(process.env.REACT_APP_MOVIE_ENDPOINT_HOME);
    }, []);

    
    return (
        <div>
            <div className='welcome-details' >
                <nav className="bp4-navbar .modifier bp4-dark">
                    <div className="bp4-navbar-group bp4-align-left">
                        <div className="bp4-navbar-heading"> Welcome&nbsp;
                            <strong>
                                {userContext.details.firstName}
                                {userContext.details.lastName &&
                                " " + userContext.details.lastName}
                            </strong> !</div>
                    <span className="bp4-navbar-divider"></span>
                    <button className="bp4-button bp4-minimal bp4-icon-star" onClick={favoriteMovies}>Favourites</button>
                    <button className="bp4-button bp4-minimal bp4-icon-circle-arrow-up" onClick={popularHandler} >Popular</button>
                    </div>
                <div className="bp4-navbar-group bp4-align-right">
                    <form onSubmit={searchMovie}>
                    <input className="bp4-input" placeholder="Search Movie..." value={searchTerm} onChange={handleOnChange} type="text" />
                    </form>
                    <span className="bp4-navbar-divider"></span>
                    <button className="bp4-button bp4-minimal bp4-icon-antenna" onClick={props.refetchHandler}>Refetch</button>
                    <button className="bp4-button bp4-minimal bp4-icon-log-out" onClick={props.logoutHandler}>Logout</button>
                </div>
            </nav>
        </div>
        <div className='movie-container'>
            {movies.map(item => {
                    return ( <MovieItem key={item.id} {...item} /> );
            })}
        </div>
        </div>
    );
}

export default Movies;