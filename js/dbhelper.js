/**
 * Common database helper functions.
 */
// import dbpomises from 'dbpomises';
let fetchedCuisines;
let fetchedNeighborhoods;

const dbPromise =  idb.open('fm-udacity-restaurant', 1, (upgradeDB) => {
      upgradeDB.createObjectStore('restaurants', { keypath: 'name' })
      .createIndex('name', 'name');
  });

// dbPromise.then((db) => {
//   const tx = db.transaction('restaurants', 'readwrite');
//   const restaurantsStore = tx.objectStore('restaurants');
//     restaurantsStore.put(restaurant);

//   console.log('reviews json', restaurants);
//   callback(null, restaurants);
// });


// });

// putRestaurants(restaurants) {
//   if (!restaurants.push) restaurants = [restaurants];
//   return this.db.then(db => {
//     const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
//     Promise.all(restaurants.map(networkRestaurant => {
//       return store.get(networkRestaurant.id).then(idbRestaurant => {
//         if (!idbRestaurant || networkRestaurant.updatedAt > idbRestaurant.updatedAt) {
//           return store.put(networkRestaurant);
//         }
//       });
//     })).then(function () {
//       return store.complete;
//     });
//   });
// },

// /**
//  * Get a restaurant, by its id, or all stored restaurants in idb using promises.
//  * If no argument is passed, all restaurants will returned.
//  */
// getRestaurants(id = undefined) {
//   return this.db.then(db => {
//     const store = db.transaction('restaurants').objectStore('restaurants');
//     if (id) return store.get(Number(id));
//     return store.getAll();
//   });
// },

// /**
//  * Save a review or array of reviews into idb, using promises
//  */
// putReviews(reviews) {
//   if (!reviews.push) reviews = [reviews];
//   return this.db.then(db => {
//     const store = db.transaction('reviews', 'readwrite').objectStore('reviews');
//     Promise.all(reviews.map(networkReview => {
//       return store.get(networkReview.id).then(idbReview => {
//         if (!idbReview || networkReview.updatedAt > idbReview.updatedAt) {
//           return store.put(networkReview);
//         }
//       });
//     })).then(function () {
//       return store.complete;
//     });
//   });
// },

// /**
//  * Get all reviews for a specific restaurant, by its id, using promises.
//  */
// getReviewsForRestaurant(id) {
//   return this.db.then(db => {
//     const storeIndex = db.transaction('reviews').objectStore('reviews').index('restaurant_id');
//     return storeIndex.getAll(Number(id));
//   });
// }

// };


class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337;
    return `http://localhost:${port}/restaurants`;
  }

  static get REVIEWS_DB_URL() {
    const port = 1337;
    return `http://localhost:${port}/reviews`;
  }

  static fetchRestaurants(callback) {

      fetch(DBHelper.DATABASE_URL).then((response) => {
        response.json()
          .then((restaurants) => {

            const dbPromise = idb.open('restaurants-db', 5, (upgradeDb) => {
              upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
            });

              dbPromise.then((db) => {
                const tx = db.transaction('restaurants', 'readwrite');
                const restaurantsStore = tx.objectStore('restaurants');
                restaurants.forEach((restaurant) => {
                  restaurantsStore.put(restaurant);
                });
              });

          console.log('restaurants json', restaurants);
          callback(null, restaurants);

        }).catch((error) => { console.log(error); });
      });
  }

  // static fetchReviews(callback) {

  //   fetch(DBHelper.REVIEWS_DB_URL).then((response) => {
  //     response.json()
  //       .then((reviews) => {

  //         const dbPromise = idb.open('reviews-db', 1, (upgradeDb) => {
  //           upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
  //         });

  //           dbPromise.then((db) => {
  //             const tx = db.transaction('reviews', 'readwrite');
  //             const reviewsStore = tx.objectStore('reviews');
  //             reviews.forEach((review) => {
  //               reviewsStore.put(review);
  //             });
  //           });

  //       console.log('restaurants json', reviews);
  //       callback(null, restaurants);

  //     }).catch((error) => { console.log(error); });
  //   });
// }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {

    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  static fetchRestaurantReviews(restaurant_id) {
    return fetch(`${DBHelper.REVIEWS_DB_URL}/?restaurant_id=${restaurant_id}`).then(response => {
      if(!response.ok) return Promise.reject('No reviews');
      return response.json();
    }).then(fetchedReviews => {
      return fetchedReviews;
    }).catch((error) => {
      callback(error, null);
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }


  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }

  static putRestaurants(restaurants) {

    dbPromise.then((db) => {
      const tx = db.transaction('restaurants', 'readwrite');
      const restaurantsStore = tx.objectStore('restaurants');
      restaurantsStore.put(restaurants);
  
      return tx.complete;
    });
  }

  // static addPendingRequestToQueue(url, method, body) {
  //   // Open the database ad add the request details to the pending table
  //   const dbPromise = idb.open("fm-udacity-restaurant");
  //   dbPromise.then(db => {
  //     const tx = db.transaction("pending", "readwrite");
  //     tx
  //       .objectStore("pending")
  //       .put({
  //         data: {
  //           url,
  //           method,
  //           body
  //         }
  //       })
  //   })
  //     .catch(error => {})
  //     .then(DBHelper.nextPending());
  // }

  // static nextPending() {
  //   DBHelper.attemptCommitPending(DBHelper.nextPending);
  // }

  // static attemptCommitPending(callback) {
  //   // Iterate over the pending items until there is a network failure
  //   let url;
  //   let method;
  //   let body;
  //   //const dbPromise = idb.open("fm-udacity-restaurant");
  //   dbPromise.then(db => {
  //     if (!db.objectStoreNames.length) {
  //       console.log("DB not available");
  //       db.close();
  //       return;
  //     }

  //     const tx = db.transaction("pending", "readwrite");
  //     tx
  //       .objectStore("pending")
  //       .openCursor()
  //       .then(cursor => {
  //         if (!cursor) {
  //           return;
  //         }
  //         const value = cursor.value;
  //         url = cursor.value.data.url;
  //         method = cursor.value.data.method;
  //         body = cursor.value.data.body;

  //         // If we don't have a parameter then we're on a bad record that should be tossed
  //         // and then move on
  //         if ((!url || !method) || (method === "POST" && !body)) {
  //           cursor
  //             .delete()
  //             .then(callback());
  //           return;
  //         };

  //         const properties = {
  //           body: JSON.stringify(body),
  //           method: method
  //         }
  //         console.log("sending post from queue: ", properties);
  //         fetch(url, properties)
  //           .then(response => {
  //           // If we don't get a good response then assume we're offline
  //           if (!response.ok && !response.redirected) {
  //             return;
  //           }
  //         })
  //           .then(() => {
  //             // Success! Delete the item from the pending queue
  //             const deltx = db.transaction("pending", "readwrite");
  //             deltx
  //               .objectStore("pending")
  //               .openCursor()
  //               .then(cursor => {
  //                 cursor
  //                   .delete()
  //                   .then(() => {
  //                     callback();
  //                   })
  //               })
  //             console.log("deleted pending item from queue");
  //           })
  //       })
  //       .catch(error => {
  //         console.log("Error reading cursor");
  //         return;
  //       })
  //   })
  // }

  // static updateCachedRestaurantData(id, updateObj) {
  //   const dbPromise = idb.open("fm-udacity-restaurant");
  //   // Update in the data for all restaurants first
  //   dbPromise.then(db => {
  //     console.log("Getting db transaction");
  //     const tx = db.transaction("restaurants", "readwrite");
  //     const value = tx
  //       .objectStore("restaurants")
  //       .get("-1")
  //       .then(value => {
  //         if (!value) {
  //           console.log("No cached data found");
  //           return;
  //         }
  //         const data = value.data;
  //         const restaurantArr = data.filter(r => r.id === id);
  //         const restaurantObj = restaurantArr[0];
  //         // Update restaurantObj with updateObj details
  //         if (!restaurantObj)
  //           return;
  //         const keys = Object.keys(updateObj);
  //         keys.forEach(k => {
  //           restaurantObj[k] = updateObj[k];
  //         })

  //         // Put the data back in IDB storage
  //         dbPromise.then(db => {
  //           const tx = db.transaction("restaurants", "readwrite");
  //           tx
  //             .objectStore("restaurants")
  //             .put({id: "-1", data: data});
  //           return tx.complete;
  //         })
  //       })
  //   })

  //   // Update the restaurant specific data
  //   dbPromise.then(db => {
  //     console.log("Getting db transaction");
  //     const tx = db.transaction("restaurants", "readwrite");
  //     const value = tx
  //       .objectStore("restaurants")
  //       .get(id + "")
  //       .then(value => {
  //         if (!value) {
  //           console.log("No cached data found");
  //           return;
  //         }
  //         const restaurantObj = value.data;
  //         console.log("Specific restaurant obj: ", restaurantObj);
  //         // Update restaurantObj with updateObj details
  //         if (!restaurantObj)
  //           return;
  //         const keys = Object.keys(updateObj);
  //         keys.forEach(k => {
  //           restaurantObj[k] = updateObj[k];
  //         })

  //         // Put the data back in IDB storage
  //         dbPromise.then(db => {
  //           const tx = db.transaction("restaurants", "readwrite");
  //           tx
  //             .objectStore("restaurants")
  //             .put({
  //               id: id + "",
  //               data: restaurantObj
  //             });
  //           return tx.complete;
  //         })
  //       })
  //   })
  // }

  // static updateLiked(id, newState, callback) {
  //   // Push the request into the waiting queue in IDB
  //   const url = `${DBHelper.DATABASE_URL}/${id}/?is_favorite=${newState}`;
  //   const method = "PUT";
  //   DBHelper.updateCachedRestaurantData(id, {"is_favorite": newState});
  //   DBHelper.addPendingRequestToQueue(url, method);

  //   // Update the favorite data on the selected ID in the cached data
  //   callback(null, {id, value: newState});
  // }

  // // static updateCachedRestaurantReview(id, bodyObj) {
  // //   console.log("updating cache for new review: ", bodyObj);
  // //   // Push the review into the reviews store
  // //   dbPromise.then(db => {
  // //     const tx = db.transaction("reviews", "readwrite");
  // //     const store = tx.objectStore("reviews");
  // //     console.log("putting cached review into store");
  // //     store.put({
  // //       id: Date.now(),
  // //       "restaurant_id": id,
  // //       data: bodyObj
  // //     });
  // //     console.log("successfully put cached review into store");
  // //     return tx.complete;
  // //   })
  // // }

  // static handleLikeClick(id, newState) {
  //   // Block any more clicks on this until the callback
  //   const likeButton = document.getElementById("fav-star-" + id);
  //   likeButton.onclick = null;

  //   DBHelper.updateLiked(id, newState, (error, resultObj) => {
  //     if (error) {
  //       console.log("Error updating favorite");
  //       return;
  //     }
  //     // Update the button background for the specified favorite
  //     const likeButton = document.getElementById("fav-star-" + resultObj.id);
  //       likeButton.innerHTML = resultObj.value ? '&#9734' : '&#9733';
  //   });
  // }

}
