//root div
const rootDiv = document.querySelector("#root");

//create header
const header = document.createElement('div');
header.classList.add("header")
header.innerHTML = "Rick and Morty app";
rootDiv.appendChild(header);

///create sidebar and main container
const rowContainer = document.createElement('div');
rowContainer.classList.add("row", "100-vh");
rootDiv.appendChild(rowContainer);

const sidebar = document.createElement('div');
sidebar.classList.add("sidebar", "col-4", "bg-secondary", "d-flex", "flex-column");
rowContainer.appendChild(sidebar);

const mainContainer = document.createElement('div');
mainContainer.classList.add("main-container", "col-8", "bg-primary");
rowContainer.appendChild(mainContainer);

const ulOfEpisodes = document.createElement('ul');
ulOfEpisodes.classList.add("list-group")
sidebar.appendChild(ulOfEpisodes);

const clearDiv = (div) => {
    div.innerHTML = "";
}


const renderMiniCard = async characterUrl => {
    const response = await fetch(characterUrl);
    const characterObj = await response.json();
    const miniCard = document.createElement('div');
    miniCard.innerHTML = `<img src="${characterObj.image}" alt="${characterObj.name}"><h5>${characterObj.name}</h5><p>${characterObj.species} | ${characterObj.status}</p>`;
    mainContainer.appendChild(miniCard);
}

const renderEpisodeCard = (episode) => {
    clearDiv(mainContainer);
    
    //title (name)
    const episodeTitle = document.createElement('h2');
    episodeTitle.innerHTML = `Episode ${episode.id}`;
    mainContainer.appendChild(episodeTitle);
    
    //air date and episode code
    const episodeAirDateAndcode = document.createElement('p');
    episodeAirDateAndcode.innerHTML = `${episode.air_date} | ${episode.episode}`
    mainContainer.appendChild(episodeAirDateAndcode)
    
    //list of characters
    episode.characters.forEach( characterUrl => {
        renderMiniCard(characterUrl);
    });
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
        let arrayOfEpisodes = parsedRes.results;
        arrayOfEpisodes.push(...parsedRes2.results);
        arrayOfEpisodes.push(...parsedRes3.results);
        renderEpisodesList(arrayOfEpisodes, numberOfepisodes);  
        
        renderEpisodeCard(arrayOfEpisodes[0])
        
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
sidebar.appendChild(allEpisodesBtn)

document.querySelector("#all-episodes-btn").addEventListener('click', () => {
    clearDiv(sidebar);
    getEpisodesList(41)
})

