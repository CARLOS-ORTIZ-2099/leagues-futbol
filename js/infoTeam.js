const infoTeamContainer = document.querySelector('.info-team-container')
const params = new URLSearchParams(window.location.search);
//console.log(params);
const idTeam = params.get('team');
//console.log(idTeam);
const league = params.get('league');
//console.log(league);
const returnBtn = document.querySelector('.return-btn')
const gallery = document.querySelector('.gallery')
const imgGallery = document.querySelector('.gallery .img')
const btnsDirection = document.querySelectorAll('.gallery .direction')
const closeModal = document.querySelector('.close-modal')
let sectionImages
let indexImage

returnBtn.addEventListener('click', () => {
/*    alert('volver') */
   window.location.href = `index.html?league=${league}`
})

const APIURL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l='

async function petitionInfoTeam() {
   try{
        infoTeamContainer.innerHTML = `<img src = "./assets/rings.svg" class='loader'>`
        const response = await fetch(APIURL+league)
        if(!response.ok){
            throw new Error('ocurrio un error')
        }
        const {teams} = await response.json()
        console.log(teams);
        let arrayOrder = mergeSort(teams, 0, teams.length-1)
       /*  console.log(arrayOrder); */
        let indexTarget = binarySearch(arrayOrder, idTeam )
        /* console.log(indexTarget); */
       // console.log(arrayOrder[indexTarget]);
        infoTeamContainer.innerHTML =''
        renderInfo(arrayOrder[indexTarget])
   }
   catch(error){
        console.log(error);
   }
    
}

document.addEventListener('DOMContentLoaded', petitionInfoTeam)


function renderInfo(arrayData) {

   // destructurando los datos que son mas propensos a no estar en todos los equipos
   const {strLeague,strLeague2, strLeague3, strLeague4, strLeague5, strLeague6, strLeague7, strStadiumThumb,
   strTeamFanart1, strTeamFanart2, strTeamFanart3, strTeamFanart4
} = arrayData
   
   const ob = Object.entries({strLeague, strLeague2, strLeague3, strLeague4, strLeague5, strLeague6, strLeague7, strStadiumThumb, strTeamFanart1, strTeamFanart2, strTeamFanart3, strTeamFanart4
   })
   

   const div = document.createElement('div')
   div.classList.add('team-data-first')
   div.innerHTML = ` 
         <h1>${arrayData.strTeam}</h1>
         <img src=${arrayData.strTeamBadge}>
         <h2><span>int formed year</span> : ${arrayData.intFormedYear}</h2>
         <h2> <span>name alternate</span> : ${arrayData.strAlternate}</h2>
         <h2> <span>country</span> : ${arrayData.strCountry}</h2>
         <img src=${arrayData.strTeamJersey}>
         <h2> <span>description</span> : ${arrayData.strDescriptionES ||arrayData.strDescriptionEN}</h2>
         <h2> <span>keywords</span> : ${arrayData.strKeywords || 'NA'}</h2>
         <h2> <span>stadium</span> : ${arrayData.strStadium}</h2>
         <h2> <span>stadium description</span> : ${arrayData.strStadiumDescription}</h2>
         <h2> <span>stadium location</span> : ${arrayData.strStadiumLocation}</h2>

   `
   infoTeamContainer.appendChild(div)
   evalData(ob)
   sectionImages =[...document.querySelectorAll('.section-images img')]
   console.log(sectionImages);
   sectionImages.forEach((image, index) => image.addEventListener('click', () => showModal(index)))
}

// verificar si la propiedad tiene un valor 
function evalData(data) {
   console.log(data);
   const div = document.createElement('div')
   div.classList.add('team-data-second')
   const titleLeagues = document.createElement('h1')
   titleLeagues.textContent = `Leagues :`
   const sectionLeagues = document.createElement('section')
   sectionLeagues.classList.add('section-leagues')
   sectionLeagues.insertAdjacentElement("afterbegin" , titleLeagues)
   const sectionImages = document.createElement('section')
   sectionImages.classList.add('section-images')
   for(const [propertyName, propertyValue] of data) {
    /*   console.log(propertyName, propertyValue); */
      if(propertyValue && isImageUrl(propertyValue)){
       /*   console.log(propertyValue, 'existe'); */
         // renderizar o crear elementos html
         const img = document.createElement('img')
         img.src =  `${propertyValue}`
         sectionImages.appendChild(img)
         // condicional para verificar si el elemento es una url si es asi quiere decir que es una imagen entonces renderizar  una imagen con una etiqueta img
         div.appendChild(sectionImages)
         
      }else if(propertyValue){
         
         const h1 = document.createElement('h1')
         h1.textContent = `${propertyName}: ${propertyValue}`
         sectionLeagues.appendChild(h1)
         div.appendChild(sectionLeagues)
      }
   }
   infoTeamContainer.appendChild(div)

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


// funcion gallery
function showModal(index) {
  /*  console.log(index);
   console.log( sectionImages[index]); */
   indexImage = index
   console.log(indexImage);
   gallery.classList.remove('hidden')
   imgGallery.src = sectionImages[index].src
   
}

btnsDirection.forEach(btn => btn.addEventListener('click', moveImage))

function moveImage(e) {
  
   if(e.target.matches('.previous')){
      console.log('mover a la izquierda');
      indexImage--
      indexImage < 0 ? indexImage = sectionImages.length-1:indexImage
      console.log(indexImage);
      console.log(sectionImages[indexImage])
      imgGallery.src = sectionImages[indexImage].src


   }else{
      console.log('mover a la derecha');
      indexImage++
      indexImage > sectionImages.length-1 ?indexImage = 0:indexImage
      console.log(indexImage);
      console.log(sectionImages[indexImage])
      imgGallery.src = sectionImages[indexImage].src
   }
}

// cerrar modal

closeModal.addEventListener('click', () => gallery.classList.add('hidden'))

