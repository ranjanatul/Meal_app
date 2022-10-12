const searchByMealName = document.getElementById('mealName');
const mealSelected = document.getElementById('mealSelected');
let result = [];
let filteredResult = [];

searchByMealName.addEventListener('keyup', function(event) {
  const key = event.target.value;
  if (key.length === 0) {
    mealSelected.innerHTML = '<option>Type to get suggestions</option>'; 
  }
  else if (key.length === 1) {
    result = [];
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${key}`)
    .then((response) => {
      return response.json()
      })
      .then(response => {
        const {meals = []} = response;
      if (meals) {
        result.push(...meals);
        result.forEach(({idMeal, strMeal}) => {
          const option = document.createElement('option');
          option.setAttribute('value', idMeal);
          option.innerHTML = strMeal;
          mealSelected.append(option);
        })
      } else {
        mealSelected.innerHTML = '<option>No data Found</option>';
      }
    })
  } else if (key.length > 1) {
    filteredResult = result.filter(({strMeal}) => {
      return (strMeal.toLowerCase().indexOf(key) > -1)
    })
    mealSelected.innerHTML = '';
    if (filteredResult.length == 0) {
     mealSelected.innerHTML = '<option>No data Found</option>'; 
    } else {
      mealSelected.innerHTML = '';
      filteredResult.forEach(({idMeal, strMeal}) => {
        const option = document.createElement('option');
        option.setAttribute('value', idMeal);
        option.innerHTML = strMeal;
        mealSelected.append(option);
      })
    }
    
  }
})
