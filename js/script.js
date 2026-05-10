const apiUrl = (userName) => `https://api.github.com/users/${userName}/repos`
const stateContainer = document.querySelector('.state_container');
const loadingState = document.querySelector('.loading_container')
const projectsContainer = document.querySelector('.projects_container');
const highlightsContainer = document.querySelector('.highlights');
const form = document.getElementById('contactForm');

const customData = [
  {
    id: 1224910347,
    name: "Wine Collection",
    description:
      "A collection of wines where users can add/remove favorites and manage collections.",
    highlights: [
      "Context API and state management",
      "Reusable components",
      "Tailwind theme extensions",
      "LocalStorage persistence",
      "Client-side routing"
    ],
    techStack: ["React", "Vite", "Tailwind"],
    image: "./assets/wine_collection.png",
    alt: "Wine collection application"
  },

  {
    id: 1228106267,
    name: "The Beet RestoBar",
    description: "Restaurant and bar web application.",
    highlights: [
      "API integration",
      "Routing",
      "Responsive UI"
    ],
    techStack: ["React", "Vite", "Material UI"],
    image: "./assets/thebeet.png",
    alt: "Restaurant menu interface"
  },

  {
    id: 1194527696,
    name: "SoftStay HomeRental",
    description: "Room rental booking platform.",
    highlights: [
      "Reusable UI patterns",
      "Context API and state handling",
      "Search params and filtering",
      "API integration",
      "Routing",
      "Booking edge case handling"
    ],
    techStack: ["React", "Vite"],
    image: "./assets/softstay.png",
    alt: "Accommodation listing page"
  },

  {
    id: 1175914056,
    name: "StackBrew CoffeeShop",
    description: "Coffee shop e-commerce interface.",
    highlights: [
      "Cart functionality",
      "Context API",
      "State management"
    ],
    techStack: ["React"],
    image: "./assets/stackbrew.png",
    alt: "Shopping cart interface"
  },

  {
    id: 1121734588,
    name: "OldFashioned Webpage",
    description:
      "A modern React rebuild of a classic apparel webpage using component-based architecture.",
    highlights: [
      "Reusable components",
      "Hooks and state handling",
      "Express GET/POST requests"
    ],
    techStack: ["React", "Node.js", "Express"],
    image: "./assets/oldfashioned_react.png",
    alt: "Contact form interface"
  }
];

const clearContainer = (container) => {
  container.innerHTML = "";
}

const renderError = (message) => {
  if (!stateContainer) return;

  clearContainer(stateContainer);

  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.classList.add('error');

  stateContainer.appendChild(errorMessage);
}

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

  if (!repos.length) {
    renderError('No repositories found');
    return;
  }

  const customDataMap = new Map(
    customData.map(project => [project.id, project])
  );

  const ownedRepos = repos.filter(
    repo => !repo.fork && customDataMap.has(repo.id)
  );

  clearContainer(projectsContainer);

  ownedRepos.forEach(repo => {

    const project = customDataMap.get(repo.id);

    const {
      name,
      image,
      alt,
      description,
      highlights,
      techStack
    } = project;

    const websiteUrl = repo.homepage;
    const label = websiteUrl
      ? 'View Demo'
      : 'No Demo Available';

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <h4 class="card_name">${name}</h4>

      <div class="card_image_container">
        <img src="${image}" alt="${alt}" />
      </div>

      <p class="card_description">
        ${repo.description || description}
      </p>

      <div class="label">
        <strong>Key Highlights:</strong>
      </div>

      <ul class="highlights">
        ${highlights.map(item => `<li>${item}</li>`).join('')}
      </ul>

      <div class="label">
        <strong>Tech Stack:</strong>
      </div>

      <p class="card_tech">
        ${techStack.join(' • ')}
      </p>

      <div class="card_actions_wrapper">
        <p class="view_repo">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            View Repository
          </a>
        </p>

        ${
          websiteUrl
            ? `
              <p class="view_demo">
                <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer">
                  ${label}
                </a>
              </p>
            `
            : ''
        }
      </div>
    `;

    projectsContainer.appendChild(card).fadeIn;
  });
};

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

