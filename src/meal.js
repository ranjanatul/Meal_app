window.addEventListener('load', function(e) {
    const search = document.location.search;
    let id = search.split('=')[1];
    if (!id) {
        id = 52784;
    }
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(response => response.json())
      .then(({meals}) => {
        const response = meals[0];
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
      result.append(table);
      })
})
