//Web Dev is all about DOM manipulation
//apne tasks ki array bna rhe pehle
//uske details ko store krne ki list
//hr task will be an object 

//state use krte h for the current requirement us state ke according kaam krna, in future kuch aur bhi store krwana ho to krwa skte h
const state = {
    taskList: [
        // {
        //     title: "",
        //     image: ""
        // },
        // {
        //     title: "",
        //     image: ""
        // },
        // {
        //     title: "",
        //     image: ""
        // },
    ],
    // notes =[] ye state ka fayda uthana , nayi chizen add krna
};

// js can create html and add it to the dom , hence dom manipulation
//for that we use query selector, and the class of the element from html

//to access DOM, we need to make a document object 
const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body"); //usko click krenge to wo pop krega humara task

//we want to access all the details user entered and we want to create a object out of it

//we will create a function responsible for creating html code to add in the task display
//agr direct `` likhdiye to wo hi return ho jaega , agar {} ke andr likhe to return `` krke hoga
const htmlTaskContent = ({
    //ye sb ek task ke attributes
    id,
    title,
    description,
    type, url
}) => `
    <div class = 'col-md-6 col-lg-4 mt-3' id=${id} key=${id}> 
        <div class='card shadow-sm task_card'>
        <div class='card-header d-flex gap-2 justify-content-end task_card_header'>
        <button type='button' class='btn-outline-info mr-2' name= ${id} onclick = "editTask.apply(this,arguments)">
        <i class='fas fa-pencil-alt' name =${id}></i>
        </button>
        <button type='button' class='btn-outline-danger mr-2' name= ${id} onclick = "deleteTask.apply(this,arguments)">
        <i class='fas fa-trash-alt' name =${id}></i>
        </button>
        </div>
        <div class='card-body'>
            ${url ?
        `<img width ='100%' height='150px' style="object-fit:cover; object-position:center" src=${url} alt = 'car image cap' class='card-image-top mb-3 rounded-lg'/>`
        :
        `<img width ='100%' height='150px' style="object-fit:cover; object-position:center" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt = 'card image cap' class='img-fluid place_holder_image mb-3'/>`

    }
            <h4 class='task_card_title'>${title}</h4>
            <p class='description trim-3-lines text-muted' data-gram_editor='false'>
            ${description}
            </p>
            <div class='tags text-white d-flex flex-wrap'>
            <span class='badge bg-primary m-1'>
            ${type}
            </span>
            </div>
        </div>
        <div class='card-footer'>
            <button type='button' class ='btn btn-outline-primary float-right' 
            data-bs-toggle='modal'
            data-bs-target='#showTask'
            id= ${id}
            onclick='openTask.apply(this, arguments)'
            >
            Open Task
            </button>
        </div>
        </div>
    </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
    //in js we can access exact date and time 
    const date = new Date(parseInt(id)); //qki id string format me hogi isliye usko int format me krne ke liye 
    // ye id which we are writing again and again is nothing but the unique date and time that we will use as an id for that task
    return `
    <div id=${id}>
    ${
        //if url is present then only show the image o.w no
        url ?
            `<img width ='100%' src=${url} alt = 'car image cap' class='img-fluid place_holder_image mb-3'/>`
            :
            `<img width ='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt = 'card image cap' class='img-fluid place_holder_image mb-3'/>`


        }
    <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong> 

    <h2 calss='my-3'>${title}</h2>
    <p class='Lead'>
    ${description}
    </p>
    </div>
    `
};

//we can access local storage of our browser via js , console me we can check it in application heading 
//but it can only store strings , hence any other data type must be converted to string first then stored 
const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(
        {
            //JavaScript Object Notation JSON, hr chiz object hoti h aur usko convert krne ke liye Json se access and stringify se convert 
            tasks: state.taskList, //jb bhi function call hoga , json object update ho jaega task list ko update krdega  
        }
    ))
}; //ye function tha jab user save changes krega to local storage me data store krne ke liye, ab likhenge function uska ulta krne ke liye , jab hume dikhana h data to local storage se data access krenge 

//now we will do the opposite of it
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);
    //local storage bhi ek object hi h 
    if (localStorageCopy) state.taskList = localStorageCopy.tasks; // agar local storage me data h to task list me usko dal do dikhane ke liye

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate)); //ye h jo humne upr html likhi h usko apne page pr ghusane ke liye grid me before end ate jaenge
    });
};

//jo form bhrega user uska submission wgera ke liye
//we will make a function for it , to handle submission

const handleSubmit = (event) => { //submission is an event ,and this is an event handler
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById('imageUrl').value, //jo jo bhi chizen input kri gyi hn , unko access krna usign document upr wala jese
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        type: document.getElementById('tags').value,
    };

    if (input.title === '' || input.description === "" || input.type === '') {
        return alert("Please fill all the details");
    }

    taskContents.insertAdjacentHTML(
        "beforeend", htmlTaskContent({
            ...input, // ... krne se wo as object in object nhi aake us object ke andr ka saman spreadout hoke ajaega
            //... is a spread operator, spreading and adding 
            id,
        })
    );

    state.taskList.push({ ...input, id }); //tasklist me dalne ke liye push 
    updateLocalStorage();   //pushed a new element into the task list and updated the local storage to contain the new data 
};

const openTask = (e) => {
    if (!e) e = window.event;
    const getTask = state.taskList.find(({ id }) => id === e.target.id); //jisne bhi open task function call kra h i.e onclick wla upr, so in this event we go to that target and get its id and match it with the list of elements
    taskModal.innerHTML = htmlModalContent(getTask);  //jo modal open hoga uske andr html dalne ke liye 

};
//delete button pr click krna is an event (onclick) 
const deleteTask = (e) => {
    if (!e) e = window.event; //means if we cant get the event we show latest event which happened
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({ id }) => id !== targetID); //us id ka task nikalo aur usko hata do list me se id not equal to krdo uski 
    //ye remove task array h jisme wo ek element nhi hoga jo ki deleted h 
    state.taskList = removeTask; //update the tasklist
    updateLocalStorage();
    //we also need to remove it from the dom or our webpage
    if (type === "BUTTON") { //qki type check krne pr 2 tag a rhe h isliye agr button aya to return nhi to agr i aya to wese hi return 
        //ab hum us button se uske parent divs pr jaenge jb tk pura card as a div ni ajae, fir uda denge use
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    //isme 5 baar parentNode, qki ye i tag h button ke andr 
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

const editTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode; //aisa krne se we are getting to the card body , to edit inside it 

    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }
    taskTitle = parentNode.childNodes[3].childNodes[3]; //wese dekhne me wo 2 child lgega but hoga 3 bich me ek gap hota h hence 3 wla 5 pr , ye sb check krne ke liye console log childnodes 
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

    //ksi bhi chiz ka html me attribute hota h jese uski class id etc, aise hi hota h uska content, aur yahan pr nya attribute bnaya contenteditable js me isse us chiz ka content edit kr skte hn wahi pr isko true krne se 
    taskTitle.setAttribute('contenteditable', 'true');
    taskDescription.setAttribute('contenteditable', 'true');
    taskType.setAttribute('contenteditable', 'true');

    //arrow funcitons me 'this' use nhi kr skte isliye appy(this) krke we use 
    submitButton.setAttribute('onclick', "saveEdit.apply(this, arguments)"); //jb edit krne lgein to wo show task wla button modal ki trf na jae blki submit changes ka kaam kre
    submitButton.removeAttribute("data-bs-toggle"); //removing modal thing for now
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode; //card ko access kr rhe 

    //changes ko save krna 
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = { //final updation 
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML
    };

    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) => //state tasklist me updation 
        task.id === targetID ?
            {
                id: task.id,
                title: updateData.taskTitle,
                description: updateData.taskDescription,
                type: updateData.taskType,
                url: task.url,
            }
            : task
    );
    state.taskList = stateCopy;
    updateLocalStorage();

    //now to make them un-updatable, we make it false
    taskTitle.setAttribute('contenteditable', 'false');
    taskDescription.setAttribute('contenteditable', 'false');
    taskType.setAttribute('contenteditable', 'false');

    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal"); //removing modal thing for now
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
    if (!e) e = window.event;
    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }
    const resultData = state.taskList.filter(({ title }) => {
        return title.toLowerCase().includes(e.target.value.toLowerCase()); //if the title includes what we searched 
    });
    console.log(resultData);
    resultData.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });

};