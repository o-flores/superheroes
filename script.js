const API_URL_ALL = 'https://akabab.github.io/superhero-api/api/all.json';
const API_URL_ID = 'https://akabab.github.io/superhero-api/api/id/';
const heroe = document.querySelector('#heroe-list');
const opponent = document.querySelector('#opponent-list');
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

const getHeroesNames = async () => {
  const heroes = await fetchHeroesInfos(API_URL_ALL);
  const names = heroes.map((heroe) => heroe.name);
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

const appendNamesOnSelect = async () => {
  const namesArray = await getHeroesNames();
  const selects = document.querySelectorAll('.heroes-list');
  namesArray.forEach((name) => {
    selects.forEach((select) => {
      const option = document.createElement('option');
      option.innerText = name;
      option.value = name;
      select.appendChild(option);
    })
  });
  // getSelectedHeroe();
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
    heroeP.classList.replace('active', 'inactive');
    opponentP.classList.replace('active', 'inactive');
    const heroeURL = await getHeroePhoto(heroe.value);
    const opponentURL = await getHeroePhoto(opponent.value);
    const heroeStats = await getHeroeStats(heroe.value);
    const opponentStats = await getHeroeStats(opponent.value);
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
    heroeP.classList.replace('active', 'inactive');
    opponentP.classList.replace('active', 'inactive');
    const heroeInfo = await getHeroeBio(heroe.value);
    const opponentInfo = await getHeroeBio(opponent.value);
    const heroeURL = await getHeroePhoto(heroe.value);
    const opponentURL = await getHeroePhoto(opponent.value);
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
  heroePhoto.classList.replace('inactive', 'active');
  heroePhoto.src = url;
  heroeP.classList.replace('inactive', 'active');
};

const opponentWins = (url) => {
  opponentPhoto.classList.replace('inactive', 'active');
  opponentPhoto.src = url;
  opponentP.classList.replace('inactive', 'active');
};

const fight = () => {
  const fightBtn = document.getElementById('fight');
  fightBtn.addEventListener('click', async () => {
    heroeP.classList.replace('active', 'inactive');
    opponentP.classList.replace('active', 'inactive');
    const heroeURL = await getHeroePhoto(heroe.value);
    const opponentURL = await getHeroePhoto(opponent.value);
    const heroeStats = await getHeroeStats(heroe.value);
    const opponentStats = await getHeroeStats(opponent.value);
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
window.onload = () => {
  appendNamesOnSelect();
  showStats();
  showInfo();
  fight();
}