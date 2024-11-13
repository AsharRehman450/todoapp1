

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVyZBm-xrUGTtcPG8jlTO-8hmk_6BrYGU",
    authDomain: "todoapp-71c32project.firebaseapp.com",
    databaseURL: "https://todoapp-71c32project-default-rtdb.firebaseio.com",
    projectId: "todoapp-71c32project",
    storageBucket: "todoapp-71c32project.firebasestorage.app",
    messagingSenderId: "1036697008836",
    appId: "1:1036697008836:web:0ae829a45c0551beffa791"
};
firebase.initializeApp(firebaseConfig);

// Authentication Functions
function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Signup successful!");
            showTodoApp();
        })
        .catch(error => {
            alert(error.message);
        });
}

function logIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Login successful!");
            showTodoApp();
        })
        .catch(error => {
            alert(error.message);
        });
}

function logOut() {
    firebase.auth().signOut().then(() => {
        alert("Logged out successfully!");
        showAuthForm();
    });
}

function showTodoApp() {
    document.getElementById("authForm").style.display = "none";
    document.getElementById("todoApp").style.display = "block";
    document.getElementById("logoutDiv").style.display = "block";
}

function showAuthForm() {
    document.getElementById("authForm").style.display = "block";
    document.getElementById("todoApp").style.display = "none";
    document.getElementById("logoutDiv").style.display = "none";
}

// Realtime Authentication Listener
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        showTodoApp();
    } else {
        showAuthForm();
    }
});

// To-Do App Functions
const ulElement = document.getElementById("list");

firebase.database().ref("todos").on("child_added", data => {
    const liElement = document.createElement("li");
    const liText = document.createTextNode(data.val().value);
    liElement.appendChild(liText);
    ulElement.appendChild(liElement);

    const delBtnElement = document.createElement("button");
    const delBtnText = document.createTextNode("Delete");
    delBtnElement.appendChild(delBtnText);
    liElement.appendChild(delBtnElement);

    delBtnElement.setAttribute("id", data.val().key);
    delBtnElement.setAttribute("onclick", "deleteSingleItem(this)");

    delBtnElement.style.backgroundColor = "#f44336";
    delBtnElement.style.color = "white";
    delBtnElement.style.border = "none";
    delBtnElement.style.padding = "5px 10px";
    delBtnElement.style.marginLeft = "10px";
    delBtnElement.style.cursor = "pointer";
    delBtnElement.style.borderRadius = "5px";
    
    const editBtnElement = document.createElement("button");
    const editBtnText = document.createTextNode("Edit");
    editBtnElement.appendChild(editBtnText);
    editBtnElement.setAttribute("onclick", "editItem(this)");

    editBtnElement.setAttribute("id", data.val().key);
    liElement.appendChild(editBtnElement);

    editBtnElement.style.backgroundColor = "#4CAF50";
    editBtnElement.style.color = "white";
    editBtnElement.style.border = "none";
    editBtnElement.style.padding = "5px 10px";
    editBtnElement.style.marginLeft = "5px";
    editBtnElement.style.cursor = "pointer";
    editBtnElement.style.borderRadius = "5px";
});

function addTodo() {
    const input = document.getElementById("todoInput");
    const key = firebase.database().ref("todos").push().key;
    const obj = {
        value: input.value,
        key: key
    };
    firebase.database().ref("todos").child(key).set(obj);
    input.value = "";
}

function deleteAllItems() {
    ulElement.innerHTML = "";
    firebase.database().ref("todos").remove();
}

function deleteSingleItem(e) {
    firebase.database().ref("todos").child(e.id).remove();
    e.parentNode.remove();
}

function editItem(e) {
    const updatedVal = prompt("Enter updated value:");
    const editTodo = {
        value: updatedVal,
        key: e.id
    };
    firebase.database().ref("todos").child(e.id).set(editTodo);
    e.parentNode.firstChild.nodeValue = updatedVal;
}
