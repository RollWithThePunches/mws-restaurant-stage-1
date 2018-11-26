
const dbPromise =  idb.open('fm-udacity-restaurant', 2, (upgradeDB) => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', { keypath: 'id' });
    case 1:
      upgradeDB.createObjectStore('reviews', { keypath: 'id' })
        .createIndex('restaurant_id', 'restaurant_id');
  }
  });

function putRestaurants(restaurants) {

	dbPromise.then((db) => {
	  const tx = db.transaction('restaurants', 'readwrite');
	  const restaurantsStore = tx.objectStore('restaurants');
	  restaurantsStore.put(restaurants);

	  return tx.complete;
	});
}
