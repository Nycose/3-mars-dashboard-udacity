
// immutable.js map
let store = Immutable.Map({
    user: { name: "Mason" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit', 'Perseverance'],
    rover_data: '',
    rover_selected: 'Curiosity',
    curiosity_photos: '',
    opportunity_photos: '',
    spirit_photos: '',
    perseverance_photos: '',
    epic_photos: ''
})

// markup gets injected into this root element
const root = document.getElementById('root')

// reducer function that updates the store map
const updateStore = (state, newState) => {
    //store = Object.assign(store, newState)
    store = state.merge(newState)
    render(root, store)
}

// renders app after state changes
const render = (root, state) => {
    root.innerHTML = App(state)
}

// creates mars dashboard
const App = (state) => {
    //let { rover_data, rover_selected, apod } = state
    const rover_data = state.get('rover_data')
    const rover_selected = state.get('rover_selected')
    const apod = state.get('apod')

    return `
        <header></header>
        <main>
            <section>
                <div class="container my-5">
                    <div class="row">
                        ${ImageOfTheDay(apod)}
                    </div><hr>
                </div>
            </section>
            <section id="rover_section">
                <div class="container-lg">
                    <div class="row">
                        <h2 class="text-light">ROVERS ON MARS</h2>
                        <p class="lead text-muted mb-1">
                            Explore data gathered by NASA's rover: <span class="text-white"><strong>${state.get('rover_selected')}</strong></span>
                        </p>
                        <ul class="nav nav-pills">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Change Rover</a>
                                <ul class="dropdown-menu">
                                     <li><a class="dropdown-item rover_control" href="#a">Curiosity</a></li>
                                     <li><a class="dropdown-item rover_control" href="#a">Opportunity</a></li>
                                     <li><a class="dropdown-item rover_control" href="#a">Spirit</a></li>
                                     <li><a class="dropdown-item rover_control" href="#a">Perseverance</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div class="row my-4">
                        ${ShowRoverInfo(state, rover_data)}
                    </div>

                    <div class="row my-4">
                        ${ShowPhotos(state, rover_selected)}
                    </div>
                </div>
            </section>
        </main>
        <footer class="mb-5"></footer>
    `
}

// get image of the day after page loads, getImageOfTheDay invokes render
window.addEventListener('load', (e) => {
    // render(root, store)
    getImageOfTheDay(store)
})

// Keeps track of the rover the user is currently viewing
window.addEventListener('click', (e) => {

    if(e.target.classList[1] === 'rover_control') {

        const rover_selected = e.target.textContent;

        updateStore(store, { rover_selected })

    }
})

// ------------------------------------------------------  COMPONENTS


// Pure function that renders Astronomy Picture of the Day infomation requested from the backend
// Returns a string of html
const ImageOfTheDay = (apod) => {

    const { url, title, explanation, copyright } = apod.image

    // If image does not already exist, request it again
    if (!apod) {
        getImageOfTheDay(store)
    }

    // Conditionally embed img or video html tag based on the APOD media type
    const image_element = apod.image.media_type === "video"
    ? `<iframe title="vimeo-player" src="${url}&autoplay=1 " width="640" height="360" frameborder="0" allowfullscreen></iframe>`
    : `<img class="img-fluid" src="${url}">`


    return (`
        <div class="col-md align-self-center">
            <p class="lead text-muted">NASA Astronomy Picture of the Day</p>
            <h1 class="text-white display-4">"${title}"</h1>
            <p class="text-light">${explanation}</p>
            <small class="text-muted">image credit and copyright: ${copyright}</small>
        </div>
        <div class="col-md-7 p-5 text-center">
            ${image_element}
        </div>
    `)
}

// Pure function that renders mission information about each rover from NASA backend
// Returns string of html to be injected in app
const ShowRoverInfo = (state, rover_data) => {

    if (!rover_data) {
        // If rover data doesn't exist, request it
        getRoverData(store)
    } else {

        const active_rover = rover_data.rovers  // Array of rovers (objects) and their mission details
            .find(rover => rover.name === state.get('rover_selected')) // Mission details of rover (object) that user is currently viewing

        return (`
            <table class="table table-borderless table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Landing Date</th>
                  <th scope="col">Launch Date</th>
                  <th scope="col">Mission Status</th>
                  <th scope="col">Photos Taken</th>
                  <th scope="col">Most Recent Photo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${active_rover.name}</td>
                  <td>${active_rover.landing_date}</td>
                  <td>${active_rover.launch_date}</td>
                  <td>${active_rover.status}</td>
                  <td>${active_rover.total_photos}</td>
                  <td>${active_rover.max_date}</td>
                </tr>
              </tbody>
            </table>
        `)
    }
}


// Pure function that renders rover photos from NASA backend
// Returns string of html that forms an image slider / carousel
const ShowPhotos = (state, rover_selected) => {

    // Holds reference to the rover latest photos object where the NASA data is stored
    // Value is based on the rover the user is currently viewing
    let photos = '';

    // if photos don't exist, request them for that rover
    switch (rover_selected) {
        case 'Curiosity':
            photos = state.get('curiosity_photos')
            if(!photos) { getCuriosityPhotos(store) }
            break;
        case 'Opportunity':
            photos = state.get('opportunity_photos')
            if(!photos) { getOpportunityPhotos(store) }
            break;
        case 'Spirit':
            photos = state.get('spirit_photos')
            if(!photos) { getSpiritPhotos(store) }
            break;
        case 'Perseverance':
            photos = state.get('perseverance_photos')
            if(!photos) { getPerseverancePhotos(store) }
            break;
    }

    // If photos exist for rover, parse the data from the backend and generate html
    if(photos.latest_photos) {
        const photo_element = photos.latest_photos.slice(0, 15) // Array of 10 latest photos (objects)
            .map((image, idx) => { // returns array of strings where each element in arr is a slide on the carousel
                return (`
                    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
                        <img src="${image.img_src}" class="w-100 shadow-1-strong rounded mb-1 mt-4" alt=""/>
                        <small class="text-muted">Captured on: ${image.earth_date}</small>
                    </div>
                    `)
            })
            .join('') // concat the array into a single string

        return photo_element
    }
}




// ------------------------------------------------------  API CALLS

const getImageOfTheDay = (state) => {
    const apod = state.get('apod')

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return apod
}



const getRoverData = (state) => {
    const rover_data = state.get('rover_data');

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rover_data => updateStore(store, rover_data))

    return rover_data;
}




const getCuriosityPhotos = (state) => {
    const curiosity_photos = state.get('curiosity_photos');

    fetch(`http://localhost:3000/curiosityphotos`)
        .then(res => res.json())
        .then(curiosity_photos => updateStore(store, curiosity_photos))

    return curiosity_photos;
}




const getOpportunityPhotos = (state) => {
    const opportunity_photos = state.get('opportunity_photos')

    fetch(`http://localhost:3000/opportunityphotos`)
        .then(res => res.json())
        .then(opportunity_photos => updateStore(store, opportunity_photos))

    return opportunity_photos;
}




const getSpiritPhotos = (state) => {
    const spirit_photos = state.get('spirit_photos')

    fetch(`http://localhost:3000/spiritphotos`)
        .then(res => res.json())
        .then(spirit_photos => updateStore(store, spirit_photos))

    return spirit_photos;
}



const getPerseverancePhotos = (state) => {
    const perseverance_photos = state.get('perseverance_photos')

    fetch(`http://localhost:3000/perseverancephotos`)
        .then(res => res.json())
        .then(perseverance_photos => updateStore(store, perseverance_photos))

    return perseverance_photos;
}
