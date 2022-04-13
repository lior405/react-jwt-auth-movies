import { Button } from '@blueprintjs/core';
import React, {useCallback, useContext} from 'react';
import { UserContext } from './UserContext';


const MovieItem = ({title, poster_path, overview, vote_average, release_date,id}) => {

    const [userContext, setUserContext] = useContext(UserContext);

    const setVoteClass = (vote)=> {
        if(vote > 7.8) {
            return "green";
        }else if(vote > 6) {
            return "orange";
        } else {
            return "red";
        }
    }
    const moviePoster = process.env.REACT_APP_MOVIE_ENDPOINT_IMG;
    const year = release_date ? release_date.split("-") : '';

    const handleClick = (event) => {
        fetch(process.env.REACT_APP_API_ENDPOINT+"movies/saveMovie", { 
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${userContext.token}`},
            body: JSON.stringify( { "title": title,
                "poster_path": poster_path,
                "overview": overview,
                "vote_average": vote_average,
                "release_date": release_date,
                "id": id
            },
            ),
        })
        .then(async response => {
            if(!response.ok) {
                console.log("error occurred.");
            }else {
                const data = await response.json();
                console.log(data);
            }
        }).catch( (err) => {console.log(err);} );
    }
    
    return (
        <div className='movie-item'>
            <img src={moviePoster+ poster_path} alt={title}/>
            <div className='movie-title'>
                <h3>{title}</h3>
                <span className={`tag ${setVoteClass(vote_average)}`} >{vote_average}</span>
            </div>
            <p>Release Year: {year[0]}</p>
            <div className='movie-overview'>
                <h2>Overview</h2>
                <p>{overview}</p>
                <Button text='Save' intent='warning' onClick={handleClick} />
            </div>
        </div>

    );
}

export default MovieItem;