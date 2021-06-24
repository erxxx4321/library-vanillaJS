const form = document.getElementById("form");
const container = document.getElementById("container");
const modal = document.createElement("div");
const error = document.createElement("p");

/* open and close form*/
function toggleForm() {
	if (form.style.display === "none") {
		modal.classList.add("modal");
		form.insertAdjacentElement("beforebegin", modal);
		form.style.display = "block";
	} else {
		form.style.display = "none";
		form.reset();
		error.remove();
		modal.remove();
	}
}

let myLibrary = [];

class Book {
	constructor(title, author, pages, isRead) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.isRead = isRead;
	}
}

function addBookToLibrary() {
	const submitBtn = document.getElementById("submit");

	let title = document.getElementById("title").value;
	let author = document.getElementById("author").value;
	let pages = document.getElementById("pages").value;
	let isRead = document.getElementById("read").checked;

	let newBook = new Book(title, author, pages, isRead);

	if (title == "" || author == "") {
		error.style.color = "#E83015";
		error.textContent = "Title and Author cannot be empty";
		submitBtn.insertAdjacentElement("beforebegin", error);
		return false;
	} else {
		myLibrary.push(newBook);
		updateLocalStorage();
		toggleForm();

		showLocalLibrary();
	}
}

function createBookCard() {
	container.textContent = "";
	for (i = 0; i < myLibrary.length; i++) {
		// node element
		let card = document.createElement("div");
		let div = document.createElement("div");
		let btns = document.createElement("div");
		let title = document.createElement("h3");
		let author = document.createElement("p");
		let pages = document.createElement("p");
		let readBtn = document.createElement("button");
		let removeBtn = document.createElement("button");

		// add class
		card.classList.add("card");
		btns.classList.add("btns");
		readBtn.classList.add("read");
		removeBtn.classList.add("remove");

		// add card key
		card.accessKey = i;

		// card's top block
		card.insertAdjacentElement("afterbegin", div);

		title.appendChild(document.createTextNode(myLibrary[i].title));
		author.appendChild(
			document.createTextNode(`by ${myLibrary[i].author}`)
		);
		pages.appendChild(
			document.createTextNode(
				myLibrary[i].pages ? `${myLibrary[i].pages} pages` : ""
			)
		);

		div.insertAdjacentElement("beforeend", title);
		div.insertAdjacentElement("beforeend", author);
		div.insertAdjacentElement("beforeend", pages);

		// card's bottom block
		card.insertAdjacentElement("beforeend", btns);

		readBtn.appendChild(
			document.createTextNode(myLibrary[i].isRead ? "Read" : "Unread")
		);
		readBtn.addEventListener("click", handleReadBtn);
		removeBtn.appendChild(document.createTextNode("Remove"));
		removeBtn.addEventListener("click", handleRemoveBtn);

		btns.insertAdjacentElement("beforeend", readBtn);
		btns.insertAdjacentElement("beforeend", removeBtn);

		container.insertAdjacentElement("afterbegin", card);
	}
}

function handleRemoveBtn(e) {
	let button = e.target;
	let clickedCard = button.parentElement.parentElement;
	let index = clickedCard.accessKey;

	myLibrary.splice(index, 1);
	updateLocalStorage();
	clickedCard.remove();
}

function handleReadBtn(e) {
	let button = e.target;
	let clickedCard = button.parentElement.parentElement;
	let index = clickedCard.accessKey;

	if (myLibrary[index].isRead) {
		button.textContent = "Unread";
		myLibrary[index].isRead = false;
	} else {
		button.textContent = "Read";
		myLibrary[index].isRead = true;
	}
}

function updateLocalStorage() {
	localStorage.setItem("myLocalStorage", JSON.stringify(myLibrary));
}

function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = "__storage_test__";
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return (
			e instanceof DOMException &&
			// everything except Firefox
			(e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === "QuotaExceededError" ||
				// Firefox
				e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
			// acknowledge QuotaExceededError only if there's something already stored
			storage &&
			storage.length !== 0
		);
	}
}

function showLocalLibrary() {
	let localLibrary = JSON.parse(localStorage.getItem("myLocalStorage"));
	if (storageAvailable("localStorage")) {
		for (let i = 0; i < localLibrary.length; i++) {
			myLibrary = localLibrary;
		}
	}

	createBookCard();
	// localStorage.clear();
}

modal.addEventListener("click", toggleForm);
