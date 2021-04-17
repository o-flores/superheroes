const API_URL_ALL = 'https://akabab.github.io/superhero-api/api/all.json';
const API_URL_ID = 'https://akabab.github.io/superhero-api/api/id/';

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
    // console.log(stats);
    return stats;
    const imgXsUrl = infos.images.xs;
    // console.log(infos);
  } catch (error) {
    alert('Selecione um herói');
  }
}

const getHeroePhoto = async (heroe) => {
  try {
    const ids = await getHeroesIds();
    const heroeId = ids.find((id) => id[heroe])[heroe];
    const infos = await fetchHeroesInfos(`${API_URL_ID}${heroeId}.json`);
    // const stats = infos.powerstats;
    // console.log(stats);
    const imgXsUrl = infos.images.sm;
    return imgXsUrl;
    // console.log(infos);
  } catch (error) {
    alert('Selecione um herói');
  }
}

const showStats = async () => {
  const btnStats = document.getElementById('stats');
  const heroe = document.querySelector('#heroe-list');
  const opponent = document.querySelector('#opponent-list');
  const heroePhoto = document.querySelector('#heroe-photo');
  const opponentPhoto = document.querySelector('#opponent-photo');
  btnStats.addEventListener('click', async () => {
    const heroeURL = await getHeroePhoto(heroe.value);
    const opponentURL = await getHeroePhoto(opponent.value);
    const heroeStats = await getHeroeStats(heroe.value);
    const opponentStats = await getHeroeStats(opponent.value);
    const keys = Object.keys(heroeStats);
    const heroeUl = document.getElementById('heroe-ul');
    heroeUl.innerText = '';
    const opponentUl = document.getElementById('opponent-ul');
    opponentUl.innerText = '';
    for (key of keys) {
      const liHeroe = document.createElement('li');
      const liOpponent = document.createElement('li');
      liHeroe.innerText = `${key} : ${heroeStats[key]}`;
      liOpponent.innerText = `${key} : ${opponentStats[key]}`;
      heroeUl.appendChild(liHeroe);
      opponentUl.appendChild(liOpponent);
    }
    heroePhoto.src = heroeURL;
    opponentPhoto.src = opponentURL;
  })
}
window.onload = () => {
  appendNamesOnSelect();
  showStats();
}