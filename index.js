// parent element to store cards

const taskContainer = document.querySelector(".task_container");
console.log(taskContainer);

//global store
let globalStore = [];

const newCard = ({
  id,
  imageUrl,
  taskTitle,
  taskDescription,
  taskType,
}) => `<div class="col-md-6 col-lg-4" id=${id}>
<div class="card">
    <div class="card-header d-flex justify-content-end gap-2">
        <button id=${id} type="button" class="btn btn-outline-success rounded" onclick="editCard.apply(this, arguments)">
        <i class="fas fa-pencil-alt" onclick="editCard.apply(this, arguments)"></i>
        </button>
        <button id=${id} type="button" class="btn btn-outline-danger rounded" onclick="deleteCard.apply(this, arguments)">
        <i id=${id} class="fas fa-trash" onclick="deleteCard.apply(this, arguments)"></i>
        </button>
    </div>
    <img 
    src=${imageUrl} 
    class="card-img-top" 
    alt="...">
    <div class="card-body">
      <h5 class="card-title">${taskTitle}</h5>
      <p class="card-text">${taskDescription}</p>
      <span class="badge bg-primary">${taskType}</span>
    </div>
    <div class="card-footer text-muted d-flex justify-content-end">
        <button type="button" id=${id} class="btn btn-outline-primary rounded">Open Task</button>
    </div>
  </div>

</div>`;

const loadInitialTaskCards = () => {
  //access local storage
  const getInitialData = localStorage.tasky;
  if (!getInitialData) return;

  //convert stringyfied object to object
  const { cards } = JSON.parse(getInitialData);

  //map around the array to generate HTML card and inject it to DOM
  cards.map((card) => {
    const createNewCard = newCard(card);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(card);
  });
};

const updateLocalStorage = (data) =>
  localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

const saveChanges = () => {
  const taskData = {
    id: `${Date.now()}`, //unique number for card id
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDescription: document.getElementById("taskdescription").value,
  };

  //HTML code which will be injected to the DOM
  const createNewCard = newCard(taskData);

  taskContainer.insertAdjacentHTML("beforeend", createNewCard);

  globalStore.push(taskData);

  //application program interface (API)
  updateLocalStorage();
  console.log(globalStore);
};

const deleteCard = (event) => {
  //id of the card
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagname;
  //search global storage array
  globalStore.filter((cardObject) => cardObject.id !== targetID);

  updateLocalStorage();

  if (tagname === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  }
  return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode
  );
};

const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagname;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute(
    "onclick",
    "saveEditchanges.apply(this, arguments)"
  );
  submitButton.innerHTML = "Save Changes";
};

const saveEditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  console.log(targetID);
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskType: taskType.innerHTML,
    taskDescription: taskDescription.innerHTML,
  };

  globalStore = globalStore.map((task) => {
    if (task.id === targetID) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task; // Important
  });

  updateLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task";
};
