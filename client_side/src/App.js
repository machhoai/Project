import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<SearchPage />} /> 
          {/* <Route path="/movies/:id" element={<MovieDetail></MovieDetail>} />
          <Route path="/add-movie" element={<AddPage />} />
          <Route path="/search-movies" element={<SearchPage />} />
          <Route path="/delete-movie" element={<DeletePage />} />
          <Route path="/update-movie/:id" element={<UpdateForm />} />
          <Route path="/delete-movie/:id" element={<ConfirmDelete />} />
          <Route path="/update-movie" element={<UpdatePage />} />
          <Route path="/filter-movies" element={<FilterPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;