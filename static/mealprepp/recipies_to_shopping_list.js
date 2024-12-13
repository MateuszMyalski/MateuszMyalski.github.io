let recipesData = {};
let productsData = {};
let selectedRecipeKey = null;
let addedRecipes = {};

// Fetch recipes and products
fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        recipesData = data.recipes;
        productsData = data.products;
        renderRecipeList();
    });

// Render recipe list
function renderRecipeList() {
    const recipeListElement = document.getElementById('recipe-list');
    recipeListElement.innerHTML = '';

    for (const recipeKey in recipesData) {
        const recipe = recipesData[recipeKey];

        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe-item';
        recipeElement.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <p>Portions: ${recipe.portions}</p>
        `;
        recipeElement.onclick = () => displayRecipeDetails(recipeKey);
        recipeListElement.appendChild(recipeElement);
    }
}

// Display recipe details
function displayRecipeDetails(recipeKey) {
    selectedRecipeKey = recipeKey;
    const recipe = recipesData[recipeKey];

    const recipeDetailsElement = document.getElementById('recipe-details');
    recipeDetailsElement.innerHTML = `
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <p>Portions: ${recipe.portions}</p>
        <h4>Ingredients:</h4>
        <ul>
            ${Object.entries(recipe.products).map(([productKey, quantity]) => `
                <li>${productsData[productKey].name}: ${quantity} ${productsData[productKey].unit}</li>
            `).join('')}
        </ul>
    `;

    document.getElementById('add-recipe-button').style.display = 'block';
}

// Add recipe to the list
document.getElementById('add-recipe-button').onclick = () => {
    if (!selectedRecipeKey) return;

    addedRecipes[selectedRecipeKey] = (addedRecipes[selectedRecipeKey] || 0) + 1;

    updateAddedRecipesSummary();
    updateProductSummary();
};

// Update added recipes summary
function updateAddedRecipesSummary() {
    const addedRecipesListElement = document.getElementById('added-recipes-list');
    addedRecipesListElement.innerHTML = '';

    for (const recipeKey in addedRecipes) {
        const recipe = recipesData[recipeKey];
        const totalPortions = addedRecipes[recipeKey] * recipe.portions;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${recipe.name}: ${totalPortions} portions
            <div style="float:right">
                <button onclick="removeAllMeals('${recipeKey}')">Remove all</button>
                <button onclick="removeOneMeals('${recipeKey}')">Remove one</button>
            </div>
        `;
        addedRecipesListElement.appendChild(listItem);
    }
}

// Remove meal
function removeAllMeals(recipeKey) {
    if (!addedRecipes[recipeKey]) return;

    delete addedRecipes[recipeKey];

    updateAddedRecipesSummary();
    updateProductSummary();
}

// Remove single meal
function removeOneMeals(recipeKey) {
    if (!addedRecipes[recipeKey]) return;

    if (addedRecipes[recipeKey] > 0) {
        addedRecipes[recipeKey] -= 1;
    }

    if (addedRecipes[recipeKey] == 0) {
        delete addedRecipes[recipeKey];
    }

    updateAddedRecipesSummary();
    updateProductSummary();
}

// Update product summary
function updateProductSummary() {
    const productSummaryElement = document.getElementById('product-summary');
    const productQuantities = {};

    for (const [recipeKey, recipeCount] of Object.entries(addedRecipes)) {
        for (const [productKey, quantity] of Object.entries(recipesData[recipeKey].products)) {
            productQuantities[productKey] = Math.ceil(
                (productQuantities[productKey] || 0) + quantity * recipeCount / productsData[productKey].size
            ) * productsData[productKey].size;
        }
    }

    productSummaryElement.value = Object.entries(productQuantities)
        .map(([productKey, quantity]) => `${productsData[productKey].name}: ${quantity.toFixed(2)} ${productsData[productKey].unit}`)
        .join('\n');
}

// Copy product list to clipboard
document.getElementById('copy-products-button').onclick = () => {
    const productSummaryElement = document.getElementById('product-summary');
    productSummaryElement.select();
    document.execCommand('copy');
    alert('Product list copied to clipboard!');
};