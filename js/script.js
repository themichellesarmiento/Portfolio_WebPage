const apiUrl = (userName) => `https://api.github.com/users/${userName}/repos`
const stateContainer = document.querySelector('.state_container');
const loadingState = document.querySelector('.loading_container')
const projectsContainer = document.querySelector('.projects_container');
const highlightsContainer = document.querySelector('.highlights');
const form = document.getElementById('contactForm');

const customData = [
  {
    "name": "OldFashioned Webpage React",
    "description": "A modern React version of the classic webpage apparel, rebuilt using component based architecture and state management.",
    "highlights": [
      "Component structure and reusable UI patterns",
      "State handling, use of hooks",
      "GET and POST requests made using Express"
    ],
    "tech_stack": "(React), Node.JS, Express",
    "image": "./assets/oldfashioned_react.png",
    "alt": "a picture of a contact formula"
  },
  {
    "name": "Prisoner Of The Labyrinth II",
    "description": "A UI-driven browser game based version of the original labyrinth project, featuring a randomized dungeon, live map rendering and simple enemy moves.",
    "highlights": [
      "Dynamic map updates",
      "Button-based controls",
      "Game state management, procedural logic"
    ],
    "tech_stack": "(Vanilla), HTML, CSS, JQuery ",
    "image": "./assets/labyrinth2.png",
    "alt": "a picture of a game map"

  },
  {
    "name": "Prisoner Of The Labyrinth",
    "description": "A JavaScript console based adventure game. Focuses on interactive game logic, DOM manipulation, and logic flow in pure JavaScript",
    "highlights": [
      "Dynamic DOM updates based on user move actions"
    ],
    "tech_stack": "(Vanilla), HTML , CSS,",
    "webpage": "https://themichellesarmiento.github.io/PrisonerOfTheLabyrinth/",
    "image": "./assets/labyrinth1.png",
    "alt": "a picture of game instructions"
  },
  {
    "name": "OldFashioned Webpage",
    "description": "A clean, responsive e-commerce styled webpage",
    "highlights": [
      "Responsive layout and typography",
      "Product card design and visual hierarchy"
    ],
    "tech_stack": ",CSS",
    "webpage": "https://themichellesarmiento.github.io/OldFashioned_ApparelWebpage/",
    "image": "./assets/oldfashioned.png",
    "alt": "a picture of oldfashioned webpage header"
  },

]

const clearContainer = (container) => {
  container.innerHTML = "";
}

const renderError = (message => {
  if (!stateContainer) return;

  clearContainer(stateContainer);

  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.classList.add('error');

  stateContainer.appendChild(errorMessage);
})

const getData = async (url, errorMessage = 'Something went wrong') => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${errorMessage} (${response.status})`);
  }
  return response.json();
};

const selectedRepositories = async () => {
  const userName = 'themichellesarmiento'
  const sortParam = '?type=owner&sort=updated&direction=desc'

  const url = `${apiUrl(`${userName}`)}${sortParam}`;

  loadingState.classList.remove('hidden')

  try {

    const allRepos = await getData(url)
    displayRepositories(allRepos)

  } catch (error) {
    renderError(`${error.message}. Try again!`)
  } finally {
    loadingState.classList.add('hidden');
  }
}

const displayRepositories = (repos) => {

  const projectIds = [
    1121734588,
    1103721071,
    1086493077,
    1061928153
  ]

  if (!repos.length) {
    renderError('No repositories found');
    return;
  }

  const ownedRepos = repos.filter(r => !r.fork && projectIds.includes(r.id));

  ownedRepos.forEach((el, i) => {

    const card = document.createElement('div')
    card.classList.add('card')

    const name = customData[i].name
    const image = customData[i].image
    const altText = customData[i].alt
    const description = el.description || customData[i].description
    const techStack = `${el.language} ${customData[i].tech_stack}`
    const websiteUrl = el.homepage || customData[i].webpage
    const repoHighlights = customData[i].highlights.map(el => `<li>${el}</li>`).join('');

    const label = websiteUrl ? 'View Demo' : 'No Demo Available';

    card.innerHTML =
      ` 
        <h4 class="card_name">${name}</h4>
        <div class="card_image_container">
          <img src=${image} alt=${altText} />
        </div>

        <p class="card_description">${description}</p>
        
        <div class="label"><strong>Key Highlights:</strong></div>
           <ul class="highlights">
            ${repoHighlights}
           </ul>
 
        <div class="label"><strong>Tech Stack:</strong></div>
        <p class="card_tech">${techStack}</p>

        <div class="card_actions_wrapper">
          <p class="view_repo"><a href='${el.html_url}' target='_blank'>View Repository</a></p>
          <p class="view_demo"><a href='${websiteUrl}' target='_blank'>${label}</a></p>
        </div>
      `
    projectsContainer.appendChild(card).fadeIn;
  })
}

//Jquery
$('.intro_name, .intro_title, .projects_container').hide().fadeIn(3000)

//EVENT listeners
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const successMsg = form.querySelector('.success');
    const errorMsg = form.querySelector('.error');

    successMsg.hidden = true;
    errorMsg.hidden = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        successMsg.hidden = false;
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      errorMsg.hidden = false;
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  selectedRepositories();
})

