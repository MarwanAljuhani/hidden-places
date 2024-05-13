import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Home } from './pages/home/Home';
import PlacesDetails from './pages/placeDetails/PlacesDetails';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places/:placeId" element={<PlacesDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
