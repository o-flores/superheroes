const API_URL_ALL = 'https://akabab.github.io/superhero-api/api/all.json';
const API_URL_ID = 'https://akabab.github.io/superhero-api/api/id/';

const fetchHeroesInfos = async (url) => {
  try {
    const response =  await fetch(url);
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
  const select = document.querySelector('#heroes-list');
  namesArray.forEach((name) => {
    const option = document.createElement('option');
    option.innerText = name; 
    option.value = name;
    select.appendChild(option);
  });
  getSelectedHeroe();
}

const getSelectedHeroe = () => {
  const select = document.querySelector('select');
  select.addEventListener('change', (event) => {
    const heroe = event.target.value;
    GetHeroeStats(heroe);
  });
}

const GetHeroeStats = async (heroe) => {
  const ids = await getHeroesIds();
  const heroeId = ids.find((id) => id[heroe])[heroe];
  const infos = await fetchHeroesInfos(`${API_URL_ID}${heroeId}.json`);
  console.log(infos);
  const stats = infos.powerstats;
  const imgXsUrl = infos.images.xs;
}
window.onload = () => {
  appendNamesOnSelect();
}