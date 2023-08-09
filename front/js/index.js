//On va chercher les produits sur l'API
async function getProducts() {
    const reponse = await fetch("http://localhost:3000/api/products")
    const products = await reponse.json()
    return products
}


//Insérer les produits dans le DOM #items
const products = getProducts()
.then(
    (products => {
        let container = document.getElementById("items")
        for (i = 0; i < products.length; i++) {
            //Générer les éléments HTML avec les valeurs de la boucle
            let productItem = 
                `<a href="./product.html?id=${products[i]._id}">
                    <article>
                        <img src="${products[i].imageUrl}" alt="${products[i].altTxt}" />
                        <h3 class="productName">${products[i].name}</h3>
                        <p class="productDescription">${products[i].description}</p>
                    </article>
                </a>`;
            container.innerHTML += productItem
        }
    })
)








