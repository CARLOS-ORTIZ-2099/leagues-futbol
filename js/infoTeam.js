const infoTeamContainer = document.querySelector('.info-team-container')
const params = new URLSearchParams(window.location.search);
//console.log(params);
const idTeam = params.get('team');
console.log(idTeam);
const league = params.get('league');
console.log(league);

const APIURL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l='

async function petitionInfoTeam() {
   try{
        infoTeamContainer.innerHTML = `cargando...`
        const response = await fetch(APIURL+league)
        console.log(response);
        if(!response.ok){
            throw new Error('ocurrio un error')
        }
        const {teams} = await response.json()
        console.log(teams);
        let arrayOrder = mergeSort(teams, 0, teams.length-1)
        console.log(arrayOrder);
        let indexTarget = binarySearch(arrayOrder, idTeam )
        console.log(indexTarget);
        console.log(arrayOrder[indexTarget]);
        infoTeamContainer.innerHTML =''
        renderInfo(arrayOrder[indexTarget])
   }
   catch(error){
        console.log(error);
   }
    
}

document.addEventListener('DOMContentLoaded', petitionInfoTeam)


function renderInfo(arrayData) {

   //
   const {strLeague,strLeague2, strLeague3, strLeague4, strLeague5, strLeague6, strLeague7, strStadiumThumb, strTeamBadge, strTeamBanner, strTeamJersey,
   strTeamLogo } = arrayData
   
   const ob = Object.entries({strLeague, strLeague2, strLeague3, strLeague4, strLeague5, strLeague6, strLeague7, strStadiumThumb, strTeamBadge, strTeamBanner, 
   strTeamJersey, strTeamLogo })
   

   const div = document.createElement('div')
   div.innerHTML = ` 
   <div>
         <h2>int formed year: ${arrayData.intFormedYear}</h2>
         <h2>name alternate: ${arrayData.strAlternate}</h2>
         <h2>country: ${arrayData.strCountry}</h2>
         <h2>description: ${arrayData.strDescriptionES ||arrayData.strDescriptionEN}</h2>
         <h2>keywords: ${arrayData.strKeywords}</h2>
         <h2>kit color:</h2>
         <h2>stadium: ${arrayData.strStadium}</h2>
         <h2> stadium description: ${arrayData.strStadiumDescription}</h2>
         <h2>stadium location: ${arrayData.strStadiumLocation}</h2>
   </div>

   `
   infoTeamContainer.appendChild(div)
   evalData(ob)
}

// verificar si la propiedad tiene un valor 
function evalData(data) {
   console.log(data);
   const div = document.createElement('div')

   for(const [propertyName, propertyValue] of data) {
      console.log(propertyName, propertyValue);
      if(propertyValue && isImageUrl(propertyValue)){
         console.log(propertyValue, 'existe');
         // renderizar o crear elementos html
         const img = document.createElement('img')
         img.src =  `${propertyValue}`
         // condicional para verificar si el elemento es una url si es asi quiere decir que es una imagen entonces renderizar  una imagen con una etiqueta img
         div.appendChild(img)
         console.log(img);
         
      }else if(propertyValue){
         const h1 = document.createElement('h1')
         h1.textContent = `${propertyName} ${propertyValue}`
         div.appendChild(h1)
      }
   }

   infoTeamContainer.insertAdjacentElement('beforeend',div)

}


// verificar si es una imagen
function isImageUrl(url) {
   const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
   return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}


// buscar
function binarySearch(array, target) {
   let min = 0
   let max = array.length-1

   while(min <= max) {
      let half = Math.floor((min+max)/2)
      if(parseInt(array[half].idTeam) == parseInt(target)){
         return half
      }
      else if(parseInt(array[half].idTeam) < parseInt(target)){
         min = half+1
      }
      else {
         max = half-1
      }

   }
   
   return -1

}

// ordenar
function mergeSort(array, min, max) {
   if(min < max){
      // llamar recursivamente mientras se cumpla la condicion
      let half = Math.floor((min+max)/2)
      mergeSort(array, min, half)
      mergeSort(array, half+1, max)
      merge(array, min, half, max)
   }

   // caso contrario retornar 
   return array
   
}

function merge(array, min, half, max) {
   // creamos un arreglo temporal donde se copiaran todos los elementos que comparemos y variables que indexen los inicios de cada arreglo
   let temp = []
   let left = min
   let right = half+1

   // comparar y insertar en orden en el arreglo temporal, mientras se cumpla el par de variables no sobrepasen su maximo permitido

   while(left <= half && right <= max){
      if(array[left].idTeam <= array[right].idTeam){
         temp.push(array[left])
         left++
      }
      else{
         temp.push(array[right])
         right++
      }

   }

   // llegara un punto en que todos los elementos de un arreglo se copien antes que el otro, debera copiarlos elementos restantes al arreglo temporal
   while(left <= half ){
      temp.push(array[left])
      left++
   }

   while(right <= max){
      temp.push(array[right])
      right++
   }

   // copiar todos los elementos del arreglo temporal al arreglo original

   for(let i = min; i <= max; i++){
      array[i] = temp[i-min]
   }


}



