const API_URL_ALL = 'https://akabab.github.io/superhero-api/api/all.json';
const API_URL_ID = 'https://akabab.github.io/superhero-api/api/id/';
const heroeList = document.querySelector('#heroe-list');
const vilainList = document.querySelector('#vilain-list');
const heroeUl = document.getElementById('heroe-ul');
const opponentUl = document.getElementById('opponent-ul');
const heroePhoto = document.querySelector('#heroe-photo');
const opponentPhoto = document.querySelector('#opponent-photo');
const heroeP = document.querySelector('#heroe-p');
const opponentP = document.querySelector('#opponent-p');

const fetchHeroesInfos = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

const getHeroesNamesByAlingment = async (alignment) => {
  const heroes = await fetchHeroesInfos(API_URL_ALL);
  const names = heroes
    .filter((heroe) => heroe.biography.alignment === alignment)
    .map((heroe) => heroe.name);
  return names;
};

const getHeroesIds = async () => {
  const heroes = await fetchHeroesInfos(API_URL_ALL);
  const ids = heroes.map((heroe) => {
    const name = heroe.name;
    return {
      [name]: heroe.id,
    }
  });
  return ids;
};

const appendHeroesNames = (array) => {
  array.forEach((name) => {
      const option = document.createElement('option');
      option.innerText = name;
      option.value = name;
      heroeList.appendChild(option);
  });
}

const appendVilainsNames = (array) => {
  array.forEach((name) => {
      const option = document.createElement('option');
      option.innerText = name;
      option.value = name;
      vilainList.appendChild(option);
  });
}

const appendNamesOnSelect = async () => {
  const heroesNames = await getHeroesNamesByAlingment('good');
  const vilainsNames = await getHeroesNamesByAlingment('bad');

  appendHeroesNames(heroesNames);
  appendVilainsNames(vilainsNames);
  
}

const getSelectedHeroe = () => {
  const selects = document.querySelector('select');
  selects.forEach((select) => {
    select.addEventListener('change', (event) => {
      const heroe = event.target.value;
      return heroe;
    });
  })
}

const getHeroeStats = async (heroe) => {
  try {
    const ids = await getHeroesIds();
    const heroeId = ids.find((id) => id[heroe])[heroe];
    const infos = await fetchHeroesInfos(`${API_URL_ID}${heroeId}.json`);
    const stats = infos.powerstats;
    return stats;
  } catch (error) {
    alert('Selecione um herói');
  }
}

const getHeroePhoto = async (heroe) => {
  try {
    const ids = await getHeroesIds();
    const heroeId = ids.find((id) => id[heroe])[heroe];
    const infos = await fetchHeroesInfos(`${API_URL_ID}${heroeId}.json`);
    const imgXsUrl = infos.images.sm;
    return imgXsUrl;
  } catch (error) {
    alert('Selecione um herói');
  }
}

const getHeroeBio = async (heroe) => {
  try {
    const ids = await getHeroesIds();
    const heroeId = ids.find((id) => id[heroe])[heroe];
    const infos = await fetchHeroesInfos(`${API_URL_ID}${heroeId}.json`);
    const bio = infos.biography;
    return bio;
  } catch (error) {
    alert('Selecione um herói');
  }
}

const showStats = async () => {
  const btnStats = document.getElementById('stats');
  btnStats.addEventListener('click', async () => {
    heroePhoto.classList.replace('active', 'inactive');
    opponentPhoto.classList.replace('active', 'inactive');
    heroeP.classList.replace('winner', 'inactive');
    opponentP.classList.replace('winner', 'inactive');
    const heroeURL = await getHeroePhoto(heroeList.value);
    const opponentURL = await getHeroePhoto(vilainList.value);
    const heroeStats = await getHeroeStats(heroeList.value);
    const opponentStats = await getHeroeStats(vilainList.value);
    const keys = Object.keys(heroeStats);
    heroeUl.innerText = '';
    opponentUl.innerText = '';
    for (key of keys) {
      const liHeroe = document.createElement('li');
      const liOpponent = document.createElement('li');
      liHeroe.innerText = `${key} : ${heroeStats[key]}`;
      liOpponent.innerText = `${key} : ${opponentStats[key]}`;
      heroeUl.appendChild(liHeroe);
      opponentUl.appendChild(liOpponent);
    }
    heroePhoto.classList.replace('inactive', 'active');
    opponentPhoto.classList.replace('inactive', 'active');
    heroePhoto.src = heroeURL;
    opponentPhoto.src = opponentURL;
  })
}

const showInfo = () => {
  const btnInfo = document.getElementById('info');
  btnInfo.addEventListener('click', async () => {
    heroePhoto.classList.replace('active', 'inactive');
    opponentPhoto.classList.replace('active', 'inactive');
    heroeP.classList.replace('winner', 'inactive');
    opponentP.classList.replace('winner', 'inactive');
    const heroeInfo = await getHeroeBio(heroeList.value);
    const opponentInfo = await getHeroeBio(vilainList.value);
    const heroeURL = await getHeroePhoto(heroeList.value);
    const opponentURL = await getHeroePhoto(vilainList.value);
    const keys = Object.keys(heroeInfo);
    heroeUl.innerText = '';
    opponentUl.innerText = '';
    for (key of keys) {
      const liHeroe = document.createElement('li');
      const liOpponent = document.createElement('li');
      liHeroe.innerText = `${key} : ${heroeInfo[key]}`;
      liOpponent.innerText = `${key} : ${opponentInfo[key]}`;
      heroeUl.appendChild(liHeroe);
      opponentUl.appendChild(liOpponent);
    }
    heroePhoto.classList.replace('inactive', 'active');
    opponentPhoto.classList.replace('inactive', 'active');
    heroePhoto.src = heroeURL;
    opponentPhoto.src = opponentURL;
  });
}

const heroeWins = (url) => {
  heroeP.classList.add('inactive');
  heroeP.classList.remove('winner');
  heroePhoto.classList.replace('inactive', 'active');
  heroePhoto.src = url;
  heroeP.classList.remove('inactive');
  heroeP.classList.add('winner');
};

const opponentWins = (url) => {
  opponentP.classList.add('inactive');
  opponentP.classList.remove('winner');
  opponentPhoto.classList.replace('inactive', 'active');
  opponentPhoto.src = url;
  opponentP.classList.remove('inactive');
  opponentP.classList.add('winner');
};

const fight = () => {
  const fightBtn = document.getElementById('fight');
  fightBtn.addEventListener('click', async () => {
    heroeP.classList.replace('winner', 'inactive');
    opponentP.classList.replace('winner', 'inactive');
    const heroeURL = await getHeroePhoto(heroeList.value);
    const opponentURL = await getHeroePhoto(vilainList.value);
    const heroeStats = await getHeroeStats(heroeList.value);
    const opponentStats = await getHeroeStats(vilainList.value);
    const statsKeys = Object.keys(heroeStats);
    heroeUl.innerText = '';
    opponentUl.innerText = '';
    heroePhoto.src = '';
    opponentPhoto.src = '';
    let somaHeroe = 0;
    let somaOpponent = 0;
    for (key of statsKeys) {
      somaHeroe += heroeStats[key];
      somaOpponent += opponentStats[key];
    }
    if (somaHeroe === somaOpponent) alert('Escolha um heroi diferente')
    if (somaHeroe > somaOpponent) heroeWins(heroeURL);
    if (somaOpponent > somaHeroe) opponentWins(opponentURL);
  });
}

const randomCircles = () => {
  const ul = document.querySelector('.circles');
  for (let i = 0; i < 15; i += 1) {
    const li = document.createElement('li');

    const random = (min, max) => Math.random() * (max - min) + min;

    const radius = random(30, 100);
    const duration = random(10, 50);
    const delay = random(0.1, 5);
    const position = random(1, 95);

    li.style.height = `${radius}px`;
    li.style.width = `${radius}px`;
    li.style.bottom = `-${radius}px`;

    li.style.left = `${position}%`;

    li.style.animationDuration = `${duration}s`;

    li.style.animationDelay = `${delay}s`;

    li.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;

    ul.appendChild(li);
  }
};


window.onload = () => {
  appendNamesOnSelect();
  showStats();
  showInfo();
  fight();
  randomCircles();
}