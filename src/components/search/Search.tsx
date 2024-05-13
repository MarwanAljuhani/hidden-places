import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./search.css";
interface Prediction {
  description: string;
  place_id: string;
}

interface PlaceDetail {
  name?: string;
  photoUrl?: string;
}

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [placeDetails, setPlaceDetails] = useState<Record<string, PlaceDetail>>({});

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setSearchTerm(userInput);

    if (userInput.trim() !== '' && window.google && window.google.maps) {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input: userInput },
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const mappedPredictions: Prediction[] = predictions.map((prediction) => ({
              description: prediction.description,
              place_id: prediction.place_id,
            }));
            setPredictions(mappedPredictions);

            const promises = mappedPredictions.map((prediction) => fetchPlaceDetails(prediction.place_id));
            Promise.all(promises).then((details) => {
              const updatedPlaceDetails: Record<string, PlaceDetail> = {};
              details.forEach((detail, index) => {
                updatedPlaceDetails[mappedPredictions[index].place_id] = detail;
              });
              setPlaceDetails(updatedPlaceDetails);
            });
          } else {
            setPredictions([]);
            setPlaceDetails({});
          }
        }
      );
    } else {
      setPredictions([]);
      setPlaceDetails({});
    }
  };

  const fetchPlaceDetails = async (placeId: string): Promise<PlaceDetail> => {
    const placeService = new window.google.maps.places.PlacesService(document.createElement('div'));
    return new Promise((resolve, reject) => {
      placeService.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const placeDetail: PlaceDetail = {
            name: place.name,
            photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 800 }),
          };
          resolve(placeDetail);
        } else {
          resolve({ name: 'Unknown Place' });
        }
      });
    });
  };

  const handlePredictionSelect = (prediction: Prediction) => {
    setSearchTerm(prediction.description);
    setPredictions([]);
    navigate(`/places/${prediction.place_id}`);
  };

  return (
    <>
      <div className="search">
        <input
          type="text"
          className="searchBar"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon icon={faStar} className="searchIcon" />
      </div>
      <div className="searchDiv">
        {predictions.map((prediction) => (
          <div className="place" key={prediction.place_id} onClick={() => handlePredictionSelect(prediction)}>
            {placeDetails[prediction.place_id] && (
              <>
                <img
                  src={placeDetails[prediction.place_id].photoUrl || 'placeholder.jpg'}
                  alt={placeDetails[prediction.place_id].name || 'Unknown Place'}
                  className="placeImg"
                />
                <p className="placeName">{placeDetails[prediction.place_id].name || 'Unknown Place'}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
