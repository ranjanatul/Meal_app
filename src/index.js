const searchByMealName = document.getElementById('mealName');
const mealSelected = document.getElementById('mealSelected');
const favouriteMeal = document.getElementById('favouriteMeal');
let result = [];
let filteredResult = [];
let favItems = []
window.addEventListener('load', function() {
  const savedFavItems = JSON.parse(localStorage.getItem('fav'));
  if (savedFavItems && savedFavItems.length > 0) {
    favItems = [...savedFavItems];
    favouriteMeal.innerHTML = '';
    favItems.forEach(({id, name}) => {
      const li = document.createElement('li');
      const a = document.createElement('a')
      li.id = id;
      li.name = name;
      li.setAttribute('class', 'favourite-item');
      a.onclick = openpage;
      a.href = `./mealPage.html?id=${id}`;
      a.innerHTML = name;
      li.append(a);
      favouriteMeal.append(li);
    });
  }
  mealDetail('https://www.themealdb.com/api/json/v1/1/random.php');
})

searchByMealName.addEventListener('keyup', function (event) {
  const info = event;
  debounce(info);
})

function debounce(event) {
  const key = event.target.value;
  if (key.length === 0) {
    mealSelected.innerHTML = '<option>Type to get suggestions</option>'; 
  }
  else if (key.length > 0) {
    result = [];
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${key.split('')[0]}`)
    .then((response) => {
      return response.json()
      })
      .then(response => {
        const {meals = []} = response;
        if (meals) {
          result.push(...meals);
          filteredResult = result.filter(({strMeal}) => {
            return (strMeal.toLowerCase().indexOf(key) > -1)
          });
          mealSelected.innerHTML = '';
          if (filteredResult.length == 0) {
          mealSelected.innerHTML = '<option>No data Found</option>'; 
          } else {
            mealSelected.innerHTML = '';
            filteredResult.forEach(({idMeal, strMeal}) => {
              const option = document.createElement('option');
              option.innerHTML = strMeal;
              option.onclick = fetchMealById;
              option.id = idMeal;
              option.name = strMeal;
              mealSelected.append(option);
            })
          }
        } else {
          mealSelected.innerHTML = '<option>No data Found</option>';
        }
    })
  }
}

function fetchMealById({target}) {
  const id = target.id;
  searchByMealName.value = target.name;
  if (id && target.name) {
    mealDetail(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  }
}

function setFav({target}) {
  const {name, id} = target || {};
  if (name && id) {
    favItems.push({id, name});
    const li = document.createElement('li');
    const a = document.createElement('a')
    li.id = id;
    li.name = name;
    li.setAttribute('class', 'favourite-item');
    a.onclick = openpage;
    a.href = `./mealPage.html?id=${id}`;
    a.innerHTML = name;
    li.append(a);
    if (favouriteMeal.childElementCount == 1 && !favouriteMeal.children[0].name) {
        favouriteMeal.innerHTML = '';
    }
    favouriteMeal.append(li);
    localStorage.setItem('fav', JSON.stringify(favItems));
}
}

function openpage({target}) {
  const {name, id} = target || {};
  if (name && id) {
    const li = document.createElement('li');
    li.id = id;
    li.name = name;
    li.innerHTML = name;
    li.setAttribute('class', 'favourite-item');
    li.onclick = openpage
    if (favouriteMeal.childElementCount == 1) {
      if (!favouriteMeal.children[0].name) {
        favouriteMeal.innerHTML = '';
      }
      favouriteMeal.append(li);
  }
}
}

function mealDetail(url) {
  return fetch(url).then(response => response.json())
  .then(({meals}) => {
    const response = meals[0];
    mealSelected.innerHTML='';
    const table = document.createElement('table');
    let ingredients = '';
    for (let i=1;i<21;i++){
      ingredients += response[`strIngredient${i}`];
      if (i<20 && response[`strIngredient${i}`] !== '' && response[`strIngredient${i+1}`] !== '' ) {
        ingredients += ', ';
      }
      if (response[`strIngredient${i}`] === '') {
        break;
      }
    }
    const fav = document.createElement('button');
    fav.onclick = setFav;
    fav.name = response.strMeal;
    fav.id = response.idMeal
    fav.setAttribute('class', 'fav-meal');
    fav.innerHTML = 'Click if its favourite..'
    table.innerHTML = `
    <thead>
      <tr>
        <th>Category</th>
        <td>${response.strCategory}</td>
      </tr>
      <tr>
      <th>Origin</th>
        <td>${response.strArea}</td>
      </tr>
    </thead>
    <tbody>
    <tr><td colspan=2 align="center">
      <img src=${response.strMealThumb} height="300px" width="400px"/>
    </td></tr>
    <tr>
      <th>Ingredients</th>
      <td>${ingredients}</td>
    </tr>
    <tr>
      <th>Instructions</th>
      <td>${response.strInstructions}</td>
    </tr>
    <tr>
      <th>Tags</th>
      <td>${response.strTags}</td>
    </tr>
    <tr>
      <th>Watch Video</th>
      <td>
      <iframe width="420" height="315"
src=${response.strYoutube}>
</iframe>
      </td>
    </tr>
  </tbody>`;
  const result = document.getElementById('result');
  result.innerHTML = `<h4>${response.strMeal}</h4>`;
  result.append(fav);
  result.append(table);
  })
}
