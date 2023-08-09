const url = new URL(window.location);
const id = url.searchParams.get("id");
const orderId = document.querySelector("#orderId");
orderId.innerHTML = id;