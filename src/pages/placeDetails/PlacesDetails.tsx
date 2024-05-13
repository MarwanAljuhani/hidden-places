import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './placesDetails.css';

interface PlaceDetail {
  name?: string;
  photoUrl?: string;
  photos?: string[]; // Array to store URLs of multiple photos
  location?: google.maps.LatLngLiteral; // Location coordinates
}

const PlacesDetails: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const [placeDetails, setPlaceDetails] = useState<PlaceDetail>({});
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (window.google && window.google.maps && placeId) {
        const placeService = new window.google.maps.places.PlacesService(document.createElement('div'));
        placeService.getDetails({ placeId }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const photoUrls = place.photos?.map((photo) => {
              return photo.getUrl({ maxWidth: 800 });
            });

            const details: PlaceDetail = {
              name: place.name,
              photoUrl: photoUrls?.[0] || '', // Display first photo as main image
              photos: photoUrls || [], // Store all photo URLs
              location: place.geometry?.location?.toJSON(), // Get location coordinates
            };
            setPlaceDetails(details);
          } else {
            setPlaceDetails({ name: 'Unknown Place' });
          }
        });
      }
    };

    fetchPlaceDetails();
  }, [placeId]);



  const openGoogleMaps = () => {
    if (placeDetails.location) {
      const { lat, lng } = placeDetails.location;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhotoUrl(photoUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPhotoUrl(null);
  };

  return (
    <div className="placesDetailsContainer" >
      <div className="blurryContainer">
        <div className="imgContainer">
          <img src={placeDetails.photoUrl || ''} alt={placeDetails.name || 'Place Image'} className="placeDetailsImg" />
        </div>
        <div className="placesDetailsInfo">
          <p className="PlacesDetailsName">{placeDetails.name || 'Unknown Place'}</p>
          {placeDetails.location && (
            <button onClick={openGoogleMaps} className="openMapButton">
              Open in Google Maps
            </button>
          )}
          {placeDetails.photos && placeDetails.photos.length > 0 && (
            <div className="additionalPhotos">
              <h3>Additional Photos:</h3>
              <div className="photoGallery">
                {placeDetails.photos.map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`Photo ${index + 1}`}
                    className="additionalPhoto"
                    onClick={() => handlePhotoClick(photoUrl)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent">
            <img src={selectedPhotoUrl || ''} alt="Full Size" className="modalImage" />
            <button onClick={closeModal} className="closeModalButton">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesDetails;
