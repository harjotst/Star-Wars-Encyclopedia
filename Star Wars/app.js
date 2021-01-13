// Element Variables
const container = document.querySelector('.container')
const def = document.querySelectorAll('.def');
const category = document.querySelectorAll('.category');
const navigate = document.querySelector('.navigate');
const move = document.querySelectorAll('.move');
const results = document.querySelector('.results');
const pages = document.querySelector('.pages');
const page = document.getElementsByClassName('page');
let dataContainers = document.getElementsByClassName('data');

// Global Variables & Objects
let links = [];
let data = [];
let state = {};

fetchLinks();

// Event Listeners
def.forEach(d => d.addEventListener('click', getId));
move.forEach(m => m.addEventListener('click', updateResults));

// Functions
async function fetchLinks() {
    let temp = await axios.get('https://swapi.dev/api/');
    links = Object.values(temp.data);
}

async function fetchData(link) {
    data = await axios.get(link);
    Object.assign(state, {
        next: data.data.next,
        previous: data.data.previous,
        num: data.data.results.length,
        total: data.data.count,
    });
    updateState();
}

function getId() {
    state.id = this.id;
    if (this.id !== '') fetchData(links[this.id]);
}

function updateResults() {
    if (this.id === 'next') {
        fetchData(state.next);
    } else {
        if(state.previous !== null) fetchData(state.previous);
    }
}

function updateState() {
    if (dataContainers.length === 0) createContainers();
    else {
        deleteContainers();
        createContainers();
    }
    parseData();
    if (page.length === 0) generatePages();
    else {
        deletePages();
        generatePages()
    }
    updateAnimations();
}

function generatePages() {
    const temp = state.total / state.num;
    const additional = temp % 1 !== 0 ? 1 : 0;
    const numOfPages = Math.floor(temp) + additional;
    for (let i = 1; i <= numOfPages; i++) {
        let pg = document.createElement('button');
        pg.innerText = i;
        pg.classList.add('page');
        pg.addEventListener('click', () => {
            fetchData(`${links[state.id]}?page=${pg.innerText}`)
        });
        pages.appendChild(pg);
    }
}

function deletePages() {
    for (let i = page.length; i > 0; --i) {
        page[i].remove();
    }
}

function createContainers() {
    for (let i = 0; i < state.num; i++) {
        const div = document.createElement('div');
        div.classList.add('data');
        results.appendChild(div);
    }
}

function deleteContainers() {
    for (let i = dataContainers.length - 1; i >= 0; --i) {
        dataContainers[i].remove();
    }
}

function parseData() {
    let arr = data.data.results;
    for (let i = 0; i < dataContainers.length; i++) {
        updateContainer(arr[i], dataContainers[i]);
    }
}

function updateContainer(arr, container) {
    let length = Object.keys(arr).length;
    for (let i = 0; i < length; i++) {
        let p = document.createElement('p');
        p.innerText = `${Object.keys(arr)[i]}: ${Object.values(arr)[i]}`;
        container.appendChild(p);
    }
}

function updateAnimations() {
    // Set timeout delay to 1000ms or 1s inorder to allow animation
	setTimeout(() => {
		// Change dispay values to hide and show divs accordingly
		container.style.display = 'none';
        results.style.display = 'flex';
        navigate.style.display = 'flex';
	}, 1000);
	// Set opacity to 0 and scale down
	container.style.opacity = '0';
	container.style.transform = 'scale(0.8)';
	// Set opacity to 1
	results.style.opacity = '1';
}

