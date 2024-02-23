const d = document 
const teamsContainer = d.querySelector('.teams-container')
const leagues = d.querySelector('.leagues')
const APIURL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l='
let league = 'Italian Serie A'

async function petitionLeagues(nameLeague ='Italian Serie A') {
    try{
        teamsContainer.innerHTML= `cargando...`
        let response = await fetch(APIURL+nameLeague)
        if(response.ok!= true){
            let er  = new Error('error en la peticion')
            er.status = response.status || '000'
            er.statusText = response.statusText || 'texto modificado'
            throw er
        }
        let {teams} = await response.json()
        console.log(teams)
        let text  = ''

        teams?.forEach(team => {
            text+= ` <div class = 'equipo'>
                        <h1>${team.strTeam}</h1>
                        <h2>${team.strCountry}</h2>
                        <img  src=${team.strTeamBadge} alt="">  
                        <h2>${team.strLeague}</h2>
                        <button class='btn-team' data-idTeam=${team.idTeam}>see more</button>
                    </div> `
           
        })
        teamsContainer.innerHTML = text
   

    }catch(error){
        console.log({error})
        console.log(error.message)
        teamsContainer.innerHTML=`<h1>${error.message}</h1>`
    }
}
petitionLeagues()


leagues.addEventListener('change', (e) => {
    league = e.target.value
    console.log(league);
    petitionLeagues(league)
})

teamsContainer.addEventListener('click', (e) => {
    if(e.target.matches('.btn-team')){
        let idTeam = e.target.dataset.idteam
        console.log(idTeam);
        console.log(league);
        // capturando el id de cada equipo y creando un parametro de consulta para hacer ña redireccion a otro archivo con la data de del equipo
       // console.log(window.location.href);
        window.location.href = `infoTeam.html?team=${idTeam}&league=${league}`
       
    }
})


