const d = document 
const formContainer = d.querySelector('.form-container')
const textSearch = d.querySelector('.text-search') 
const btnSubmit = d.querySelector('.btn-submit') 
const APIURL = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p='
const APIURL1 = 'https://www.thesportsdb.com/api/v1/json/3/lookupcontracts.php?id='
const APIURL2 = 'https://www.thesportsdb.com/api/v1/json/3/lookuphonours.php?id='

formContainer.addEventListener('submit', searchPlayer )

function searchPlayer(e) {
    e.preventDefault()
    let namePlayer = e.target.player.value
    //console.log(namePlayer)
    petitionPlayer(namePlayer)
}


async function petitionPlayer(nameP) {
    try{
        let response = await fetch(APIURL+nameP)
       // console.log(response)
        if(response.ok!= true){
            let er  = new Error('error en la peticion')
            er.status = response.status || '000'
            er.statusText = response.statusText || 'texto modificado'
            throw er
        }
      
        let {player} = await response.json()
        console.log(player)
        let idp =  player[0].idPlayer
        let [promesa1, promesa2] = await Promise.all([promise1(idp), promise2(idp)])
        console.log(promesa1, promesa2)
        if(!promesa1 || !promesa2){
            throw new Error('error en los datos extra')
        }

    }catch(error){
        console.log({error})
        console.log(error.message)
    }
}

async function promise1(id) {
   
    try {
        let response = await fetch(APIURL1+id)
        
        if(!response.ok){
            throw new Error('error en api1')
        }
        
        return await response.json()
    }catch(error){
        console.log(error)
        return null
    }
       
}

async function promise2(id) {
    try {
        let response = await fetch(APIURL2+id)
        console.log(response)
        if(!response.ok){
            throw new Error('error en api2')
        }
        return await response.json()
    }catch(error){
        console.log(error)
        return null
    }
       
}
