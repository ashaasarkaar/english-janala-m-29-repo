//group of HTML Elements
const createElements = (arr) => {   //array ar upor map korle array return dei
    const htmlElements = arr.map((el) => ` 
        <span class="btn">${el}</span>`);
        console.log(htmlElements.join(" "));  //array k string kore
}

const synonyms = ["hi", "hello", "bye"];
createElements(synonyms);