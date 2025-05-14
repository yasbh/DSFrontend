const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Ajouter une tâche (lorsque l'utilisateur écrit et clique sur "Ajouter")
function AddTask() {
    const taskText = inputBox.value.trim();
    if (!taskText) {
        alert("Tu dois écrire quelque chose !");
        return;
    }

    createTaskElement(taskText);     // Crée l'élément visuellement
    updateLocalStorage();            // Sauvegarde dans localStorage
    inputBox.value = '';             // Vide le champ texte
}

// Gérer les clics sur les tâches (cocher ou supprimer)
listContainer.addEventListener("click", (e) => {
    const target = e.target;

    if (target.tagName === "LI") {
        target.classList.toggle("checked"); // Coche ou décoche
    } else if (target.tagName === "SPAN") {
        target.parentElement.remove(); // Supprime la tâche
    }

    updateLocalStorage(); // Sauvegarde les modifications
});

// Créer un élément <li> pour une tâche
function createTaskElement(text, checked = false) {
    const li = document.createElement("li");
    li.textContent = text;
    if (checked) li.classList.add("checked");

    const span = document.createElement("span");
    span.innerHTML = "\u00d7"; // Symbole × pour supprimer
    li.appendChild(span);

    listContainer.appendChild(li);
}

// Sauvegarde l'état actuel de toutes les tâches dans localStorage
function updateLocalStorage() {
    const tasks = Array.from(listContainer.querySelectorAll("li")).map(li => ({
        text: li.textContent.replace('×', '').trim(),
        checked: li.classList.contains("checked")
    }));

    localStorage.setItem("tasks", JSON.stringify(tasks)); // Convertit le tableau en chaîne JSON
}

// Charger les tâches sauvegardées localement au démarrage
function loadLocalTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.checked));
}

// Envoyer une fausse tâche avec fetch POST (simule une API)
function loadFakeTasksFromAPI() {
    const fakeTask = {
        title: "Tâche d'exemple",
        body: "Ceci est une tâche fictive pour tester",
        userId: 1
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fakeTask)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Tâche créée via POST :", data);
        createTaskElement(data.title); // Affiche la tâche reçue de l'API
        updateLocalStorage();
    })
    .catch(error => {
        console.error("Erreur lors du POST :", error);
    });
}

// Initialisation : charge les tâches locales ou envoie une tâche fictive
if (!localStorage.getItem("tasks")) {
    loadFakeTasksFromAPI();
} else {
    loadLocalTasks();
}
