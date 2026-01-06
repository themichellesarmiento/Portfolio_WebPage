const apiUrl = (userName) => `https://api.github.com/users/${userName}/repos22`
const stateContainer = document.querySelector('.state_container');
const projectsContainer = document.querySelector('.projects_container');

const customData = [
  {
    "description": "Uses React concepts like routing ,hooks etc. Has a get and post endpoints to make an order.",
    "tech_stack": "(React), Node.JS, Express"
  },
  {
    "description": "A browser game based version of the first one with added features. ",
    "tech_stack": "(Vanilla), HTML, CSS, JQuery "

  },
  {
    "description": "A JavaScript console based adventure game. Uses concepts such as arrays, loops, conditionals, event listeners",
    "tech_stack": "(Vanilla), HTML , CSS,",
    "webpage": "https://themichellesarmiento.github.io/PrisonerOfTheLabyrinth/",
  },
  {
    "description": "A webpage apparel app",
    "tech_stack": ",CSS",
    "webpage": "https://themichellesarmiento.github.io/OldFashioned_ApparelWebpage/"
  },

]


const clearContainer = (container) => {
  container.innerHTML = "";
}

const renderError = (message => {
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

  try {

    const allRepos = await getData(url)
    displayRepositories(allRepos)

  } catch (error) {
    renderError(`${error.message}. Try again!`)
  }
}

const displayRepositories = (repos) => {

  const teamProjId = 1096450391
  const portfolioProjId = 1129053362

  if (!repos.length) {
    renderError('No repositories found');
    return;
  }

  const ownedRepos = repos.filter(r => !r.fork && r.id !== teamProjId && r.id !== portfolioProjId);
  const featuredRepos = ownedRepos.slice(0, 4);
  console.log(featuredRepos);

  featuredRepos.forEach((el, i) => {

    const card = document.createElement('div')
    card.classList.add('card')

    const description = el.description || customData[i].description
    const techStack = `${el.language} ${customData[i].tech_stack}`
    const websiteUrl = el.homepage || customData[i].webpage

    const label = websiteUrl ? 'View Demo' : 'No Demo Available';

    card.innerHTML =
      ` <h4>${el.name}</h4>
        <p class="card_description">${description}</p>
        <p class="card_tech"><strong>Tech Stack: ${techStack}</p>
        <p class="view_repo"><a href='${el.html_url}' target='_blank'>View Repository</a></p>
        <p class="view_demo"><a href='${websiteUrl}' target='_blank'>${label}</a></p>
        `
    projectsContainer.appendChild(card);
  })
}

window.addEventListener('DOMContentLoaded', () => {
  selectedRepositories();
})