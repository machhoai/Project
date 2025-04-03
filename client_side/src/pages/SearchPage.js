import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { div, g, p, title } from "framer-motion/client";
import { useState } from "react";
import { Button } from "react-bootstrap";
const styles = {
  card: {
    borderRadius: "16px",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "black",
    border: "1px solid transparent",
    position: "relative",
    zIndex: 20,
    padding: "16px",
    color: "white",
    display: "grid",
    gridTemplateRows: "20rem 5rem auto auto",
  },
  cardImage: {
    height: "20rem",
    width: "100%",
    objectFit: "cover",
    borderRadius: "8px",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "12px",
  },
  movieDetails: {
    marginTop: "12px",
    fontSize: "0.875rem",
    color: "#d4d4d8",
  },
  cardButton: {
    marginTop: "16px",
    padding: "8px 16px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: "#1f2937",
    color: "white",
    textAlign: "center",
    width: "100%",
    cursor: "pointer",
  },
  formContainer: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  formButton: {
    width: "100%",
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

const MovieCards = () => {
  // const [selectedGenres, setSelectedGenres] = useState([]);
  const [Movies, setMovies] = useState([]);
  const [renderMovies, setRenderMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState({
    title: "",
    genre: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);  // Lưu dữ liệu gốc vào Movies
      setRenderMovies(fetchedMovies);  // Hiển thị toàn bộ phim ban đầu
    };
    
    fetchData(); // Gọi hàm fetchData để tải dữ liệu
  }, []);

const fetchMovies = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/movies/");
    const data = await response.json();
    console.log(data);
    return data || [];
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
    return []; // Trả về một mảng rỗng nếu có lỗi
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMovie = ({
      title: e.target.title.value,
      genre: e.target.genre.value.split(","),
      director: e.target.director.value,
      releaseYear: e.target.releaseYear.value,
      duration: e.target.duration.value,
      cast: e.target.cast.value.split(","),
      boxOffice: e.target.boxOffice.value,
      image: e.target.image.value,
    });

    Movies = addMovie(Movies, newMovie);
    setRenderMovies(Movies);
  };

  const FormAddMovie = () => {
    return (
      <div style={styles.formContainer}>
        <div>
          <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "10px" }}>Add New Movie</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input name="title" placeholder="Title" required />
            <input name="genre" placeholder="Genre (comma-separated)" required />
            <input name="director" placeholder="Director" required />
            <input name="releaseYear" type="number" placeholder="Release Year" required />
            <input name="duration" type="number" placeholder="Duration (min)" required />
            <input name="cast" placeholder="Cast (comma-separated)" required />
            <input name="boxOffice" placeholder="Box Office" required />
            <input name="image" placeholder="Image URL" required />
            <button type="submit" style={styles.formButton}>Add Movie</button>
          </form>
        </div>
      </div>
    );
  }

  const getAllGenres = (movies) => {
    const genres = movies.reduce((acc, movie) => {
      movie.genre.forEach((genre) => {
        if (!acc.includes(genre)) {
          acc.push(genre);
        }
      });
      return acc;
    }, []);
    return genres;
  };

  const handleGenreChange = (genre) => {
    let updatedGenres;
    if (searchTerm.genre.includes(genre)) {
      updatedGenres = searchTerm.genre.filter((g) => g !== genre);
    } else {
      updatedGenres = [...searchTerm.genre, genre];
    }
    setSearchTerm((prev) => ({
      ...prev,
      genre: updatedGenres
    }));

    if (updatedGenres.length > 0) {
      const filteredMovies = Movies.filter((movie) =>
        updatedGenres.some((g) => movie.genre.includes(g))
      );
      setRenderMovies(filteredMovies);
    } else {
      setRenderMovies(Movies);
    }
  };

  const FilterMovie = () => {
    const allGenres = getAllGenres(Movies);
    return (
      <div className="flex gap-2 justify-center flex-wrap w-[40%] mx-[auto]" >
        {allGenres.map((genre) => (
          <div key={genre}>
            <input
              name={genre}
              type="checkbox"
              className="btn-check"
              id={`btn-check-${genre}`}
              autoComplete="off"
              checked={Array.isArray(searchTerm.genre) && searchTerm.genre.includes(genre)}
              onChange={() => handleGenreChange(genre)}
            />
            <label className="btn btn-outline-primary rounded-xl" htmlFor={`btn-check-${genre}`}>
              {genre}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const handleInputChange = (e) => {
    setSearchTerm((prev) => ({
      ...prev,
      title: e.target.value.toLowerCase(),
    }));
  };

  React.useEffect(() => {
    console.log("searchTerm:", searchTerm);
    setRenderMovies(searchMovies(Movies, searchTerm));
  }, [searchTerm]);

  return (
    <div>
      <h1 className="font-bold text-3xl" style={{ textAlign: "center", color: "black" }}>Search Movies</h1>
      <div className="my-4" style={{display:"flex", justifyContent:"center"}}>
        <input type="text" placeholder="Search movies" className="w-[40%] p-2 rounded-lg border-2 border-gray-300 my-1"
        onChange={(e)=>{
          handleInputChange(e);
          }} />
      </div>

      <FilterMovie/>

      {/* <FormAddMovie></FormAddMovie> */}
      {renderMovies.length <= 0 && <h2 style={{ textAlign: "center", color: "black" }}>No movies found</h2>}

      <div className="my-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {renderMovies.length == 0 ?
          (""):
          (renderMovies.map((movie) => {
            return (
              <div style={styles.card} key={movie.id}>
                <img style={styles.cardImage} src={`/images/${movie.image}`} alt={movie.title} />
                <h2 style={styles.cardTitle}>{movie.title}</h2>
                {/* <p style={styles.cardDescription}>{movie.description}</p> */}
                <div style={styles.movieDetails}>
                  <p><strong>Director:</strong> {movie.director}</p>
                  <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                  <p><strong>Cast:</strong> {movie.cast.join(", ")}</p>
                  <p><strong>Release Year:</strong> {movie.releaseYear}</p>
                  <p><strong>Duration:</strong> {movie.duration} minutes</p>
                  <p><strong>Box Office:</strong> {movie.boxOffice}</p>
                </div>
                <div style={{display:"flex", justifyContent:"end", alignItems:"end"}}>
                  <Link className="w-full" to={`/movies/${movie.id}`}>
                    <div className="h-10 w-full mt-4 overflow-hidden relative rounded-xl px-6 py-2 bg-white text-black flex justify-center items-end group/modal-btn">
                      <span
                        className="group-hover/modal-btn:translate-x-52 text-center transition duration-500">
                        Play now
                      </span>
                      <div
                        className=" -translate-x-52 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                        🍿
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex w-full gap-1">
                  <Link className="w-full" to={`/update-movie/${movie.id}`}>
                    <div className="h-10 w-full mt-1 overflow-hidden relative rounded-xl px-6 py-2 bg-cyan-700 text-white flex justify-center items-end group/modal-btn">
                      <span
                        className="text-center transition duration-500">
                        Edit
                      </span>
                    </div>
                  </Link>
                  <Button variant="outline-danger" className="h-10 mt-1 rounded-xl">Delete</Button>
                  {/* <Link className="" to={`/delete-movie/${movie.id}`}>
                    <div className="h-10 w-full mt-1 overflow-hidden relative rounded-xl px-6 py-2 bg-rose-600 text-white flex justify-center items-end group/modal-btn">
                      <span
                        className="text-center transition duration-500">
                        Del
                      </span>
                    </div>
                  </Link> */}

                    <p class="text-base md:text-lg lg:text-xl">Responsive Text</p>

                </div>
              </div>
            );
          }))
        }
      </div>
    </div>
  );
};

const searchMovies = (movies, searchTerm) => {
  const filteredMovies = searchTerm.title || searchTerm.genre.length > 0
    ? movies.filter((movie) =>
        (searchTerm.title ? movie.title.toLowerCase().includes(searchTerm.title) : true) &&
        (searchTerm.genre.length > 0 ? searchTerm.genre.some((g) => movie.genre.includes(g)) : true)
      )
    : movies;

  console.log("filteredMovies:", filteredMovies);
  

  return filteredMovies;
}

const addMovie = (movies, newMovie) => {
  const updatedMovies = [...movies, newMovie];
  return updatedMovies;
}


export default MovieCards;
