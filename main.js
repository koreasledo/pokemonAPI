let typeBtn = document.getElementById("typeBtn");

typeBtn.addEventListener("click", () => {
  let searchBox2 = document.getElementById("searchBox2");
  if (searchBox2.style.maxHeight) {
    searchBox2.style.maxHeight=null;
    typeBtn.textContent = "상세검색";
  } else {
    typeBtn.textContent = "닫기";
    searchBox2.style.maxHeight = searchBox2.scrollHeight + 300 + "px";
  }
});

// 1. 포켓몬 API 불러오기
// 2. 불러와서 저 안에 정보 보기
// 3. 그려주는 함수 만들기 render
// 4. 한 페이지에 24개씩

  //let totalPokemon;
let pageNo = 1;
let pageBlock = 24;
let totalPage = 1;
let page = 1;

let url;
let pokemonInfo = [];
let pokemonHTML = '';
let searchBtn = document.getElementById("searchBtn");
let searchBtn2 = document.getElementById("searchBtn2");

const getPokemon = async (pageNo) => {
  try {
    // 페이징 설정
    let startPage = (pageNo-1)*pageBlock+1;
    let endPage = startPage+pageBlock-1;
    
    for (let i = startPage; i <= endPage; i++) {
      url = new URL (`https://pokeapi.co/api/v2/pokemon/${i}`);

      let response = await fetch (url);
      let data = await response.json();

      pokemonInfo = data;

      InfoPokemon();
      render();
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
  }
}

const InfoPokemon = async () => {
  url = new URL (`https://pokeapi.co/api/v2/pokemon`);

  let response = await fetch (url);
  let data = await response.json();

  //console.log("data",data);
  totalPage = Math.ceil(898/24); // pokemon API count개수 잘못 반환되서 898 하드코딩
  pagenation();
}

const pagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(Number(page)/5);
  let lastPage = pageGroup *5;
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }

  let firstPage = lastPage - 4 <=0 ? 1: lastPage - 4;
  if (firstPage >= 6) {
    pagenationHTML =
      `<li class="page-item">
        <a class="page-link" href="javascript:void(0);" aria-label="Previous" onclick="moveToPage('1')">
          <span aria-hidden="true">&lt;&lt;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="javascript:void(0);" aria-label="Previous" onclick="moveToPage('${page - 1}')">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`;
  }

  for ( let i = firstPage; i<= lastPage; i++) {
    pagenationHTML += `<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="moveToPage('${i}')">${i}</a></li>`;
  }
  
  if (lastPage < totalPage ) {

    pagenationHTML += 
      `<li class="page-item">
        <a class="page-link" href="javascript:void(0);" aria-label="Next" onclick="moveToPage('${Number(page) + 1}')">
          <span aria-hidden="true">&gt;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="javascript:void(0);" aria-label="Next" onclick="moveToPage('${totalPage}')">
          <span aria-hidden="true">&gt;&gt;</span>
        </a>
      </li>`;
    }
  
  document.querySelector(".pagination").innerHTML = pagenationHTML;
}

const moveToPage = (pageNum) => {
  //1. 이동하고 싶은 페이지를 알아야 한다
  page = pageNum;
  window.scrollTo({top: 0, behavior: "smooth"});

  // 변수 초기화
  pokemonInfo = [];
  pokemonHTML = "";

  //2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해줘야 한다
  getPokemon(pageNum);
}


const render = () => {
  pokemonHTML += [pokemonInfo].map((item) => {
    let html = "";
    html += `<li class="col-lg-2 col-6">
      <div class="img">
        <div class="tumbWrap">
        <img src="${item.sprites.front_default}" alt="pokemon" class="img-fluid">
        </div>
      </div>
      <div id="text" class="text">
        <h3>
          <p>No.${item.id}</p>
          ${item.name}
        </h3>
    `;

    for(let i=0; i<item.types.length; i++){
      html += `<span id="badgeColor" class="${item.types[i].type.name}Badge">${item.types[i].type.name}</span>`;
    }

    html += `</div>
          </li>
    `;

    return html;
  });
  
  document.getElementById("listBook").innerHTML = pokemonHTML;
}

const getPokemonByName = async () => {
  // 변수 초기화
  pokemonInfo = [];
  pokemonHTML = "";

  // 1. 검색 이름 읽어오기
  // 2. url에 이름의 이름 붙이기
  let searchInput = document.getElementById('searchInput');
  let keyword = searchInput.value.toLowerCase();
  
  url = new URL(`https://pokeapi.co/api/v2/pokemon/${keyword}`);
  let response = await fetch (url);
  
  let data = await response.json();
  pokemonInfo = data;

  render();
}

const getPokemonByTypes = async (types) => {
  // validation
  if(types == ""){
    return false;
  }

  // 변수 초기화
  pokemonInfo = [];
  pokemonHTML = "";

  url = new URL(`https://pokeapi.co/api/v2/type/${types}`);
  
  let response = await fetch (url);
  let data = await response.json();
  
  for(let i=0; i<data.pokemon.length; i++){
    let typeUrl = data.pokemon[i].pokemon.url;

    url = new URL (`${typeUrl}`);

    let resultResponse = await fetch (url);
    let resultData = await resultResponse.json();

    pokemonInfo = resultData;

    render();
  }
}

// TYPE CLICK TEST
$(document).on('click', "#searchBox2 > ul > li", async function() {
  let typeText = $(this).children("span").children("p").text();
  getPokemonByTypes(typeText);
});

//getPokemonByTypes();

searchBtn.addEventListener("click", getPokemonByName);
searchBtn2.addEventListener("click", getPokemonByTypes);

getPokemon(pageNo);

// 해야 할 일
// 1. 페이징 만들기 limit로? Resource Lists/Pagination 이부분 참고
// 2. 검색하면 나올 수 있게 만들기
// 3. 타입별 검색 만들기

