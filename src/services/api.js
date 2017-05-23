import "isomorphic-fetch"

let API = {
  getAllDinosaurs: (endpoint = "https://dinosaur-api.herokuapp.com/dinosaurs.json") => {
     return fetch(endpoint)
     .then((response) => {
       return response.json()
     })
     .catch((error) => {
       return error;
     })
  },
  getDinosaur: (id) => {

  },
  createDinosaur: (movie) => {

  },
  updateDinosaur: (newDinosaur) => {

  },
  deleteDinosaur: (id) => {
}
}

module.exports = API;
