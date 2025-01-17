//root div
const rootDiv = document.querySelector("#root");

//create header
const header = document.createElement('div');
header.classList.add("header");
header.innerHTML = "<h3>Rick and Morty app</h3>";
rootDiv.appendChild(header);

//create general container 
const rowContainer = document.createElement('div');
rowContainer.classList.add("d-flex");
rootDiv.appendChild(rowContainer);

//create sidebar
const sidebar = document.createElement('div');
sidebar.classList.add("sidebar", "col-4", "d-flex", "flex-column");
rowContainer.appendChild(sidebar);

const ulOfEpisodes = document.createElement('ul');
ulOfEpisodes.classList.add("list-group")
sidebar.appendChild(ulOfEpisodes);

//create main container
const superContainer = document.createElement('div'); //genero un contenedor para el main container para probar estilos del main-container
superContainer.classList.add("super-container", "col-8");
rowContainer.appendChild(superContainer);

const mainContainer = document.createElement('div');
mainContainer.classList.add("main-container");
superContainer.appendChild(mainContainer);

const charactersContainer = document.createElement('div'); // instancio este div fuera de renderEpisode() función para que renderMiniCard() pueda hacer hacer appendChild
charactersContainer.classList.add("characters-container");

//render functions
const clearDiv = (div) => {
    div.innerHTML = "";
}

const renderEpisodeCard = (episode) => {
    clearDiv(mainContainer);
    clearDiv(charactersContainer);
    
    //title (name)
    const episodeTitle = document.createElement('h2');
    episodeTitle.innerHTML = `Episode ${episode.id} - ${episode.name}`;
    mainContainer.appendChild(episodeTitle);
    
    //air date and episode code
    const episodeAirDateAndcode = document.createElement('p');
    episodeAirDateAndcode.innerHTML = `${episode.air_date} | ${episode.episode}`
    mainContainer.appendChild(episodeAirDateAndcode)
    
    //list of characters
    
    episode.characters.forEach( characterUrl => {
        renderMiniCard(characterUrl);
    });

    mainContainer.appendChild(charactersContainer);
}

const renderLocationCard = async (locationUrl) => {
    clearDiv(mainContainer);
    const response = await fetch(locationUrl);
    const locationObj = await response.json();
    mainContainer.innerHTML =`<h2>${locationObj.name}</h2> <p>${locationObj.type} | ${locationObj.dimention}</p>`
    mainContainer.appendChild(charactersContainer);
    locationObj.residents.forEach( resident => {
        renderMiniCard(resident);
    })

}

const renderCharacterCard = async (characterUrl) => {
    const response = await fetch(characterUrl);
    const characterObj = await response.json();
    clearDiv(mainContainer);
    mainContainer.innerHTML = `<div class="row"><img class="col-auto" src="${characterObj.image}" alt="${characterObj.name}"><div class="col-auto"> <h2>${characterObj.name}</h2><p>${characterObj.species} | ${characterObj.status} | ${characterObj.gender} | <strong class="location-tag clickable"> ${characterObj.origin.name} </strong> </div></div>`;
    document.querySelector(".location-tag").onclick = () => {renderLocationCard(characterObj.origin.url)}
    const episodesContainer = document.createElement('div');
    episodesContainer.classList.add("row");
    mainContainer.appendChild(episodesContainer);
    characterObj.episode.forEach( async episodeUrl => {
        const response = await fetch(episodeUrl);
        const espisodeObj = await response.json();
        const container = document.createElement('div');
        container.classList.add("col-auto", "clickable")
        container.innerHTML = `<h3>Episode ${espisodeObj.id}</h3> <p>${espisodeObj.episode}</p>`;
        container.onclick = () => {renderEpisodeCard(espisodeObj)};
        episodesContainer.appendChild(container)

    })
}


const renderMiniCard = async (characterUrl) => {
    const response = await fetch(characterUrl);
    const characterObj = await response.json();
    const miniCard = document.createElement('div');
    miniCard.innerHTML = `<img src="${characterObj.image}" alt="${characterObj.name}"><h5>${characterObj.name}</h5><p>${characterObj.species} | ${characterObj.status}</p>`;
    miniCard.classList.add("clickable", "mini-card");
    miniCard.onclick = () => {renderCharacterCard(characterUrl)};
    charactersContainer.appendChild(miniCard);    
}

//DISPLAY LIST OF ESPISODES ON THE SIDEBAR//
const renderEpisodesList =  (episodesList, i) => {
    const trimmedEpisodesList = episodesList.slice(0, i)
    trimmedEpisodesList.forEach(episode => {
        const liElem = document.createElement('li');
        ulOfEpisodes.appendChild(liElem);
        const btnElem = document.createElement('button');
        btnElem.classList.add("btn", "btn-primary", "list-group-item")
        liElem.appendChild(btnElem);
        btnElem.innerHTML = `Episode ${episode.id}`
        btnElem.onclick = () => {
            renderEpisodeCard(episode);
        }
    })
}

const getEpisodesList = async (numberOfepisodes) => {
    try {
        const url = `https://rickandmortyapi.com/api/episode`;
        const response = await fetch(url);
        const parsedRes = await response.json();
        const url2 = "https://rickandmortyapi.com/api/episode?page=2";
        const response2 = await fetch(url2);
        const parsedRes2 = await response2.json();
        const url3 = "https://rickandmortyapi.com/api/episode?page=3";
        const response3 = await fetch(url3);
        const parsedRes3 = await response3.json();
        let arrayOfEpisodes = null;
        arrayOfEpisodes = parsedRes.results;
        arrayOfEpisodes.push(...parsedRes2.results);
        arrayOfEpisodes.push(...parsedRes3.results);
        
        renderEpisodesList(arrayOfEpisodes, numberOfepisodes);        
        renderEpisodeCard(arrayOfEpisodes[0]);
        
    } catch(error) {
        console.log(error);
    }
}
getEpisodesList(10);


//create a button to display all episodes
const allEpisodesBtn = document.createElement('button');
allEpisodesBtn.classList.add("btn", "btn-success");
allEpisodesBtn.id= "all-episodes-btn";
allEpisodesBtn.innerHTML = "SHOW ALL EPISODES";
ulOfEpisodes.appendChild(allEpisodesBtn)

document.querySelector("#all-episodes-btn").addEventListener('click', () => {
    clearDiv(ulOfEpisodes);
    getEpisodesList(41)
});

/* window.onload('load', () => {
})
 */
