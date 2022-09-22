let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let locationInput = document.querySelector('#location');
let file = null;
let titleValue = '';
let locationValue = '';
let imageURI = '';
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let locationButton = document.querySelector('#location-btn');
let locationLoader = document.querySelector('#location-loader');
let mapDiv = document.querySelector('#map');
let fetchedLocation;

locationButton.addEventListener('click', event => {
  if(!('geolocation' in navigator)) {
      return;
  }

  locationButton.style.display = 'none';
  locationLoader.style.display = 'block';

  navigator.geolocation.getCurrentPosition( position => {
      locationButton.style.display = 'inline';
      locationLoader.style.display = 'none';
      fetchedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      console.log('current position: ', fetchedLocation);
      locationInput.value = 'In Berlin';
      document.querySelector('#manual-location').classList.add('is-focused');
  }, err => {
      console.log(err);
      locationButton.style.display = 'inline';
      locationLoader.style.display = 'none';
      alert('Couldn\'t fetch location, please enter manually!');
      fetchedLocation = null;
  }, { timeout: 5000});
});

function initializeLocation() {
  if(!('geolocation' in navigator)) {
      locationButton.style.display = 'none';
  }
}


function openCreatePostModal() {
  createPostArea.style.display = 'block';
  initializeLocation();
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
  locationButton.style.display = 'inline';
    locationLoader.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
