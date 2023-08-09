// URLSearchParams 
let url = new URLSearchParams(window.location.search);
console.log(url)
let id = url.get("id");
console.log(id)

//Fonction fetch pour appeler l'id de chaque produit
fetch('http://localhost:3000/api/products/' + id)
.then((response) => response.json())
.then((data) => kanap(data));

function kanap(Product) {

    //Création d'une constante imageUrl qui va récupérer l'url de l'image du produit
    const imageUrl = Product.imageUrl;

    //Création d'une constante altTxt qui va récupérer le texte alt de l'image du produit
    const altTxt = Product.altTxt;

    //Création d'une constante name qui va récupérer le nom du produit 
    const name = Product.name;

    //Création d'une constante price qui va récupérer le prix du produit
    const price = Product.price;

    //Création d'une constante description qui va récupérer la description du produit
    const description = Product.description;

    //Création d'une constante colors qui va récupérer les différentes couleurs disponibles pour le produit
    const colors = Product.colors;


    //Création d'une constante image qui va appeler la fonction makeImageUrl et affecter imageUrl et altTxt en paramétres
    const image = makeImageUrl(imageUrl, altTxt);
    function makeImageUrl (imageUrl, altTxt) {
        //Creation de la balise "<img>" avec insertion de l'imageUrl et de 'altTxt
        let img = document.createElement('img');
        img.src = imageUrl;
        img.alt = altTxt; 
        //On relie la variable img à son parent .itm_img
        let parent = document.querySelector('.item__img');
        parent.append(img);
    }
    
    //Création d'une constante h1 qui va appeler la fonction makeName et affecter name en paramètre
    const h1 = makeName(name);
    function makeName (name) {
        //Selection de l'id = #title et affectation du nom
        let h1 = document.querySelector('#title');
        h1.textContent = name; 
    }

    //Création d'une constante prix qui va appeler la fonction makePrice et affecter price en paramètre
    const prix = makePrice(price);    
    function makePrice (price) {
        //Selection de l'id #price et affectation du prix
        let cost = document.querySelector('#price');
        cost.textContent = price;
    }

    //Création d'une constante p qui va appeler la fonction makeDescription et affecter description en paramètre
    const p = makeDescription(description);
    function makeDescription (description) {
        //Selection l'id = #description et affectation de la description
        let desc = document.querySelector('#description');
        desc.textContent = description;
    }

    //Création d'une constante select qui va appeler la fonction makeColors et affecter colors en paramétre :
    const select = makeColors(colors);
    function makeColors (colors) {
        //Selection l'id = #colors  
        let select = document.querySelector('#colors');
        //Création d'une boucle for pour les différentes couleurs
        for (let i = 0; i < colors.length ; i++) {
            let option = document.createElement('option');
            option.value = colors[i];
            option.textContent = colors[i];
            select.append(option);
        }
    }

    // Selection de l'id du button et appel de la fonction addEventListener qui écoute l'évènement click sur le bouton ajouter 
    const button = document.querySelector("#addToCart");

    button.addEventListener('click', ajouterAuPanier);

    //Création d'une fonction ajouterAuPanier
    function ajouterAuPanier(panier) {
    
        panier.preventDefault();
    
        //Selection des id #colors et #quantity
        let colors = document.querySelector('#colors').value;
        let quantity = document.querySelector('#quantity').value;
    
        //Si colors est nulle, veuillez choisir une couleur 
        if(colors == ''){
            alert('Veuillez sélectionner une couleur !');
            return;
        }
        //Si non, si quantity est inférieure à 1 veuillez choisir une quantité valide 
        else if (quantity < 1){
            alert('Veuillez sélectionner le nombre d\'articles !');
            return;
        }
        //Si non, si quantity est supérieure à 100 veuillez choisir une quantité allant de 1 à 100 produits 
        else if (quantity > 100){
            alert('Veuillez choisir le nombre de produits souhaités (1 à 100) !');
            return;
        }
        //Si non votre commande a bien été enregistrée dans le panier
        else {
            alert('Votre article ' + name + ' a bien été ajouté au panier');   
        }
        

        //Enregistrement des valeurs (id, colors et quantity) dans un objet optionProduct
        const optionProduct = { 
        id: id,
        colors: colors,
        quantity: Number(quantity),
        }


        //LOCAL STORAGE
        //Déclaration de la variable localStorageProducts dans laquelle on met les valeurs et les clés qui sont dans le local storage
        let localStorageProducts = JSON.parse(localStorage.getItem("produits"));
        
        //Création du Pop-up de confirmation 
        const popupConfirmation = () => {
        
            //Si oui, redirection vers ==> cart.html
            if (confirm("Consultez votre panier en cliquant sur OK ou revenez sur la page d'accueil pour choisir d'autres produits en cliquant sur Annuler")) {
                window.location.href = "cart.html";
            }
        
            //Si non, alors redirection vers index.html
            else{
                window.location.href = "index.html";
            }
        }

        
        // Y a t-il deja les produits sélectionnés dans le local storage ?
        if (localStorageProducts) {
            // On recherche avec la méthode find() 
            let item = localStorageProducts.find( 
                //si l'optionProduct(id et colors)d'un article est déjà présente dans le panier
                (item) => item.id == optionProduct.id && item.colors == optionProduct.colors
            );
              
            // Si oui
            if (item) {
                //On additionne les quantity des articles de même id et colors
                item.quantity = item.quantity + optionProduct.quantity;

                //et on met à jour localstorageProducts
                localStorage.setItem("produits", JSON.stringify(localStorageProducts));
                popupConfirmation();
                return;
            }
            // Si l'article n'est pas déjà dans le local storage 
            else {
                //On push les options du nouvel article sélectionné avec l'objet optionProduct
                localStorageProducts.push(optionProduct);
                //et on met à jour localstorageProducts
                localStorage.setItem("produits", JSON.stringify(localStorageProducts));
                popupConfirmation();
            }
        } 
        //S'il n'y a pas de produits dans le local storage
        else {
            //Création d'un tableau 
            let newTabLocalStorage = [];
            //dans lequel on push l'objet "optionProduct"
            newTabLocalStorage.push(optionProduct);
            //ensuite on met à jour localstorageProducts
            localStorage.setItem("produits", JSON.stringify(newTabLocalStorage));
            popupConfirmation();
        }
    }   
}   
