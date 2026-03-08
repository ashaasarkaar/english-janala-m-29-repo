//group of HTML Elements
const createElements = (arr) => {   //array ar upor map korle array return dei
    const htmlElements = arr.map((el) => ` 
        <span class="btn">${el}</span>`);
    return htmlElements.join(" ");  //array k string kore
}

//Speak your Vocabularies
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";   // English
    window.speechSynthesis.speak(utterance);
}

// function for showing spinner START
const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};
// function for showing spinner END

//Lesson ar level gulo display te neya START
//connect with json for getting promise response
const loadLessons = () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
        .then(res => res.json())
        .then(json => displayLessons(json.data))
};
//Lesson ar level gulo display te neya START

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    // console.log(lessonButtons);
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
}

//function for getting word details
const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();  // remove all active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            // console.log(clickBtn);
            clickBtn.classList.add("active"); //add active class
            displayLevelWord(data.data);
        })
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
    console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
      <h2 class="font-bold text-2xl">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
  </div>
   <div class="">
        <p class="font-bold">Meaning</p>
     <p class="font-bold">${word.meaning}</p>
    
   </div>
    <div class="">
      <p class="font-bold">Example</p>
    <span>${word.sentence}</span>
    </div>
  <div class="">
      <p class="font-bold">সমার্থক শব্দ গুলো</p>
    <div class="">
      ${createElements(word.synonyms)}
    </div>
  </div>

//ai khan theke lekha bad ache Tabu'r
  <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
    `;
    document.getElementById("word_modal").showModal();
};


const displayLevelWord = (words) => {
    //1. get the parent container & empty
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    //condition for empty words Container
    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full py-10 space-y-6 font-bangla">
         <img class="mx-auto" src="./assets/alert-error.png" alt="error-img">
    <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
    <h2 class="text-[#292524] font-medium text-4xl">নেক্সট Lesson এ যান</h2>
   </div>
        `;
        manageSpinner(false);
        return;
    }

    //2. get into every lessons
    words.forEach(word => {
        console.log(word);
        //3. create Element for button
        const card = document.createElement('div');
        // {id: 57, level: 3, 
        // word: 'Gracious', 
        // meaning: 'দয়ালু / সদয়', 
        // pronunciation: 'গ্রেসিয়াস'}
        card.innerHTML = `
          <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
      <h2 class="font-bold text-[#000000] text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
      <p class="text-[#000000] font-medium text-xl">Meaning/Pronounciation</p>
      <p class="font-bangla font-semibold text-[#18181B] text-2xl">"${word.meaning ? word.meaning : "অর্থ পাওয়া যাইনি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</p>

      <div class="flex justify-between items-center">
        <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
        <button onclick = "pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>
         `;
        //4. append into container 
        wordContainer.append(card);
    });
    manageSpinner(false);
};

const displayLessons = (lessons) => {
    // console.log(lessons);
    //1. get the parent container & empty
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";
    //2. get into every lessons
    for (let lesson of lessons) {
        //3. create Element for button
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i>
            Lesson-${lesson.level_no}
            </button>
        `;
        //4. append into container 
        levelContainer.append(btnDiv);
    }

};

loadLessons();

//for search button START
document.getElementById("btn-search")
.addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    //for showing all the words getting all the links together
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
        const allWords = data.data;
        console.log(allWords);
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    });
    
});
//for search button END
