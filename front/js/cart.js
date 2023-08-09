//LE LOCAL STORAGE      
//Déclaration de la variable "localStorageProducts" dans laquelle on met les key et les values qui sont dans le local storage
let localStorageProducts = JSON.parse(localStorage.getItem("produits"));


// Variable pour stocker les id de chaque article présent dans le panier
let products = [];


// Si le panier est vide ou que le nombre d'articles dans le panier est nul
if (localStorageProducts == null || localStorageProducts.length == 0) {
    //On déclare un texte h1 qui indique que le panier est vide
    document.querySelector('h1').textContent = ' Votre panier est encore vide !';
    //Et on déclare le texte suivant Total 0 articles : 0 €
    document.querySelector('.cart__price').innerHTML = `<p>Total (<span id="totalQuantity">0</span> articles) : <span id="totalPrice">0</span> €</p>`;
}
//Si le panier contient déja des produits
else{
    //On déclare le texte suivant :
    document.querySelector('h1').textContent = ' Votre panier contient les produits suivants ';
};


// Création d'une boucle for of dans laquelle on injecte notre code  
for (let i = 0 ; i < localStorageProducts.length; i++)  {
    //Requête fetch pour appeller les données de chaque article mis dans le panier
    fetch('http://localhost:3000/api/products/' + localStorageProducts[i].id)
    .then( (response) => response.json())
    .then( (data) => {
        
        //Mise à jour des caractéristiques du produit dans le localStorageProducts
        products.push(localStorageProducts[i].id);
        localStorageProducts[i].imageUrl = data.imageUrl;
        localStorageProducts[i].altTxt = data.altTxt;
        localStorageProducts[i].name = data.name;
        localStorageProducts[i].price = data.price;
        

        //Déclaration de la carte détaillée de chaque article présent dans le panier (image et texte alt, nom, couleurs, prix et quantité) grace à innerHTML
        // Création de la carte détaillée de chaque produit dans le panier
        const cartItem = document.createElement('article');
        cartItem.classList.add('cart__item');
        cartItem.setAttribute('data-id', localStorageProducts[i].id);
        cartItem.setAttribute('data-color', localStorageProducts[i].colors);
        cartItem.innerHTML =
            `<div class="cart__item__img">
                <img src=${localStorageProducts[i].imageUrl} alt=${localStorageProducts[i].altTxt}>
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${localStorageProducts[i].name}</h2>
                    <p>Couleur du produit : ${localStorageProducts[i].colors}</p>
                    <p>Prix unitaire : ${localStorageProducts[i].price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p> Qté : ${localStorageProducts[i].quantity} </p>
                        <input type="number" onchange="modifyQuantity(event, '${localStorageProducts[i].id}', '${localStorageProducts[i].colors}')" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${localStorageProducts[i].quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                       <p class="deleteItem" onclick="deleteItem(event, '${localStorageProducts[i].id}', '${localStorageProducts[i].colors}')">Supprimer</p>
                    </div>
                </div>
            </div>`;

        //Ajouter la carte du produit au panier
        document.querySelector('#cart__items').appendChild(cartItem);

        //Calculer et afficher le total des quantités et des prix
        TotalPriceQuantity();
    });
}

//Déclaration d'une const avec une fonction TotalPriceQuantity qui va afficher la quantity et le price total des produits
const TotalPriceQuantity = () => {
        
    // quantityTotalCalcul qui contient la quantity de chaque article dans le local storage
    let quantityTotalCalcul = 0;
    
    // priceTotalCalcul qui contient le price de chaque article dans le local storage
    let priceTotalCalcul = 0;  

    for (let i = 0; i < localStorageProducts.length; i++) {

        //Quantité de ce produit dans le panier
        let quantityProduitDansLePanier = localStorageProducts[i].quantity;

        //Ajout de cette quantité au total calculé
        quantityTotalCalcul += parseInt(quantityProduitDansLePanier);

        //Prix de ce produit dans le panier
        let priceProduitDansLePanier = localStorageProducts[i].price * localStorageProducts[i].quantity;

        //Ajout de ce prix au total calculé
        priceTotalCalcul += priceProduitDansLePanier; 
    }
    //Affichage des résultats grâce à innerHtml
    document.querySelector('.cart__price').innerHTML = `<p>Total (<span id="totalQuantity">${quantityTotalCalcul}</span> articles) : <span id="totalPrice">${priceTotalCalcul}</span> €</p>`;
}

//Appel d'une fonction qui modifie la quantité d'un produit
function modifyQuantity(event, id, colors) {
    //Trouver l'index du produit dont on modifie la quantité dans le tableau localStorageProducts
    const productIndex = localStorageProducts.findIndex(
        (product) => product.id === id && product.colors === colors 
    );
    //Modification de la quantité du produit indexé dans le tableau localStorageProducts
    localStorageProducts[productIndex].quantity = event.target.value

    //Mise à jour du localStorage avec le tableau mis à jour
    localStorage.setItem("produits", JSON.stringify(localStorageProducts))

    //Recalculer et afficher le total des quantités et des prix
    TotalPriceQuantity()
}

//Appel d'une fonction qui supprime un produit du panier
function deleteItem(event, id, colors) {

    event.preventDefault();

    //Trouver l'index du produit à supprimer dans le tableau localStorageProducts
    const productIndex = localStorageProducts.findIndex(
      (product) => product.id === id && product.colors === colors
    );
    
    // Vérifier si l'index du produit est trouvé
    if (productIndex !== -1) {
      //Si oui, supprimer le produit du tableau localStorageProducts
      localStorageProducts.splice(productIndex, 1);

      //Mise à jour du localStorage avec le tableau mis à jour
      localStorage.setItem("produits", JSON.stringify(localStorageProducts));
  
      //Suppression de l'élément du panier dans l'interface utilisateur
      const cartItem = event.target.closest(".cart__item");
      cartItem.remove();

      //Recalculer et afficher le total des quantités et des prix
      TotalPriceQuantity();
    }
}



// Variables associées aux différents inputs du formulaire
const form = document.querySelector('.cart__order__form');

const prenom = document.querySelector('#firstName');
const nom = document.querySelector('#lastName');
const adresse = document.querySelector('#address');
const ville = document.querySelector('#city');
const mail = document.querySelector('#email');



//Création de RegExp pour les prénoms et noms
// /^ : correspond au début de la chaîne de caractères
//[a-zA-Z]+ : représente une ou plusieurs lettres alphabétiques, en minuscules ou en majuscules
//([',. -][a-zA-Z ]) : correspond à un caractère spécial (virgule, apostrophe, point, tiret ou espace) suivi d'un mot
//? : indique que cette partie est facultative
//[a-zA-Z]* : correspond à un ou plusieurs caractères alphabétiques supplémentaires pour le mot
//$ : correspond à la fin de la chaîne de caractères
///i : indique qu'elle ne fera pas de distinction entre les lettres majuscules et minuscules
const namesRegExp = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i);


//Création de RegExp pour l'adresse et la ville
// /^ : correspond au début de la chaîne de caractères
//[a-zA-Z0-9\s,.'-] représente les caractères autorisés qui sont alphabétiques (minuscules et majuscules),
//des chiffres, des espaces, des virgules, des apostrophes, des points et des tirets
//{3,} indique que la chaîne doit contenir au moins 3 caractères ou plus
//$ : correspond à la fin de la chaîne de caractères
const addressRegExp = new RegExp (/^[a-zA-Z0-9\s,.'-]{3,}$/);


//Création de RegExp pour l'adresse mail
// /^ : correspond au début de la chaîne de caractères
//[a-z0-9]+ : représente une ou plusieurs lettres minuscules ou des chiffres alphanumériques
//@ : correspond au symbole @
//[a-z]+ : représente une ou plusieurs lettres minuscules
//\. : Correspond au caractère (.)
//[a-z]{2,3} : représente deux ou trois lettres minuscules consécutives (fr, com, net, org)
//$ : correspond à la fin de la chaîne de caractères
const emailRegExp = new RegExp (/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/);



//On crée une constante qui appelle la fonction qui va vérifier si le nom ou le prénom entré 
//par l'utilisateur passe le test RegExp
const validFirstName = function(inputFirstName) {
    let firstNameError = document.querySelector("#firstNameErrorMsg")

    if (namesRegExp.test(inputFirstName.value)) {
        firstNameError.innerText = "";
        return true;
    }

    else {
        firstNameError.innerText = "Veuillez renseigner votre prénom (Les chiffres et les caractères spéciaux ne sont pas autorisés)";
        return false;
    }
}

const validLastName = function(inputLastName) {
    let lastNameError = document.querySelector('#lastNameErrorMsg')

    if (namesRegExp.test(inputLastName.value)) {
        lastNameError.innerText = "";
        return true;
    }

    else {
        lastNameError.innerText = "Veuillez renseigner votre nom de famille (Les chiffres et les caractères spéciaux ne sont pas autorisés)";
        return false;
    }
}

const validAddress = function(inputAddress) {
    let addressError = document.querySelector("#addressErrorMsg")

    if (addressRegExp.test(inputAddress.value)) {
        addressError.innerText = "";
        return true;
    }

    else {
        addressError.innerText = "Veuillez renseigner le numéro et le nom de votre adresse (Les caractères spéciaux ne sont pas autorisés)";
        return false;
    }
}
  
const validCity = function(inputCity) {
    let cityErrorMsg = document.querySelector('#cityErrorMsg');
    
    if (addressRegExp.test(inputCity.value)) {
        cityErrorMsg.innerText = ``;
        return true;

    } else {
        cityErrorMsg.innerText = `Veuillez renseigner le code postal et le nom de votre ville (Les caractères spéciaux ne sont pas autorisés)`;
        return false;
    }
}

const validEmail = function(inputEmail) {
    let emailErrorMsg = document.querySelector('#emailErrorMsg');
    
    if (emailRegExp.test(inputEmail.value)) {
        emailErrorMsg.innerText = ``;
        return true;

    } else {
        emailErrorMsg.innerText = "Veuillez renseigner votre adresse mail, elle doit contenir @ et un point";
        return false;
    }
}

// Evenement d'ecoute de l'input prenom
prenom.addEventListener('change', function() {
    validFirstName(this);
});

// Evenement d'ecoute pour l'input nom
nom.addEventListener('change', function() {
    validLastName(this);
});

// Evenement d'ecoute pour l'input adresse
adresse.addEventListener('change', function() {
    validAddress(this);
});

// Evenement d'ecoute pour l'input ville
ville.addEventListener('change', function() {
    validCity(this);
});

// Evenement d'ecoute pour l'input mail
mail.addEventListener('change', function() {
    validEmail(this);
});
  
// Ecouter la soumission du formulaire
const postUrl = 'http://localhost:3000/api/products/order/';
form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendForm();
});

// Fonction pour créer l'objet "contact" et les id des produits choisis
const objectToSend = () => {
    
    // Création de l'objet "contact" contenant les éléments du formulaire
    let contact = {
        firstName: prenom.value,
        lastName: nom.value,
        address: adresse.value,
        city: ville.value,
        email: mail.value,
    };
    
    let localStorageProducts = JSON.parse(localStorage.getItem("produits"));
    let products = [];

    for (i = 0; i < localStorageProducts.length; i++) {
        if (products.find((e) => e == localStorageProducts[i].id)) {
            console.log('not found');
        }

        else {
            products.push(localStorageProducts[i].id);
        }
    }

    let sendToServ = JSON.stringify({ contact, products });
    return sendToServ;
}

// Fonction d'envoi du formulaire
const sendForm = () => {
    let localStorageProducts = JSON.parse(localStorage.getItem("produits"));

    // Si la qty d'un élément est inférieur ou égal à 0 / supérieur ou égal à 101
    for (i = 0; i < localStorageProducts.length; i++) {
        if (localStorageProducts[i].qty <= 0 || localStorageProducts[i].qty >= 101) {
            return alert(`La quantié d'un article n'est pas comprise entre 1 et 100`);
        }
    }

    // Si le panier est vide
    if (localStorageProducts.length == 0) {
        return alert(`Votre panier est vide !`);  
    
    // Si le panier n'est pas vide
    } 
    
    else {
        // Si tous les champs du formulaire sont valides
        if (validFirstName(prenom) && validLastName(nom) && validAddress(adresse) && validCity(ville) && validEmail(mail)) {
            let sendToServ = objectToSend();

            fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: sendToServ,
            })
            .then((response) => response.json())
            .then((data) => {
                localStorage.clear();
                document.querySelector('.cart__order__form').reset();
                document.location.href = "confirmation.html?id=" + data.orderId;
            })
            .catch(() => {
                alert(`Une erreur interne est survenue`);
            });
        } 
        
        else {
            return alert(`Veuillez vérifier que tous les champs du formulaire sont correctement remplis.`)
        }
    }
}
 
