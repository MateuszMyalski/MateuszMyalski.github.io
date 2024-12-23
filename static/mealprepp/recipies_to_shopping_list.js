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

    // Sort recipe keys alphabetically by recipe name
    const sortedRecipeKeys = Object.keys(recipesData).sort((a, b) => {
        const nameA = recipesData[a].name.toLowerCase();
        const nameB = recipesData[b].name.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    for (const recipeKey of sortedRecipeKeys) {
        const recipe = recipesData[recipeKey];

        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe-item';
        recipeElement.id = recipeKey;
        recipeElement.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <p>Portions: ${recipe.portions}</p>
        `;
        recipeElement.onclick = () => displayRecipeDetails(recipeKey);
        recipeListElement.appendChild(recipeElement);
    }

    if (sortedRecipeKeys.length > 0) {
        displayRecipeDetails(sortedRecipeKeys[0]);
    }
}
// Display recipe details
function displayRecipeDetails(recipeKey) {
    if (selectedRecipeKey) {
        document.getElementById(selectedRecipeKey).classList.remove('active');
    }
    document.getElementById(recipeKey).classList.add('active');

    selectedRecipeKey = recipeKey;
    const recipe = recipesData[recipeKey];

    const recipeDetailsElement = document.getElementById('recipe-details');
    // Generate the ingredients list
    const ingredientsList = Object.entries(recipe.products)
        .map(([productKey, quantity]) => {
            const product = productsData[productKey];
            if (typeof product.size === 'string') {
                quantity = product.size;
            }

            const productName = product ? product.name : `Nieznany (${productKey})`;
            const productUnit = product ? product.unit : "nieznana jednostka";
            return `<li>${productName}: ${quantity} ${productUnit}</li>`;
        })
        .join('');

    // Update the recipe details HTML
    recipeDetailsElement.innerHTML = `
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <p>Porcje: ${recipe.portions}</p>
        <h4>Składniki:</h4>
        <ul>
            ${ingredientsList}
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
                <button onclick="removeAllMeals('${recipeKey}')">Usuń wszystko</button>
                <button onclick="removeOneMeals('${recipeKey}')">Usuń porcję</button>
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
            if (typeof productsData[productKey].size === 'string') {
                productQuantities[productKey] = productsData[productKey].size;
            } else {
                productQuantities[productKey] = Math.ceil(
                    (productQuantities[productKey] || 0) + quantity * recipeCount / productsData[productKey].size
                ) * productsData[productKey].size;
            }
        }
    }
    productSummaryElement.value = Object.entries(productQuantities)
        .map(([productKey, quantity]) => {
            if (typeof quantity !== 'string') {
                quantity = ": " + quantity.toFixed(2);
            } else {
                quantity = "";
            }
            return `${productsData[productKey].name}${quantity} ${productsData[productKey].unit}`;
        }).join('\n');
}

// Copy product list to clipboard
document.getElementById('copy-products-button').onclick = () => {
    const productSummaryElement = document.getElementById('product-summary');
    productSummaryElement.select();
    document.execCommand('copy');
    alert('Skopiowane do schowka!');
};