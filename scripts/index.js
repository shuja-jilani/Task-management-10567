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
        <button type='button' class='btn-outline-info mr-2' name= ${id}>
        <i class='fas fa-pencil-alt' name =${id}></i>
        </button>
        <button type='button' class='btn-outline-danger mr-2' name= ${id}>
        <i class='fas fa-trash-alt' name =${id}></i>
        </button>
        </div>
        <div class='card-body'>
            ${url ?
        `<img width ='100%' src=${url} alt = 'car image cap' class='card-image-top mb-3 rounded-lg'/>`
        :
        `<img width ='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt = 'card image cap' class='img-fluid place_holder_image mb-3'/>`

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

}