let counter = 4;

fetch('product.json')
    .then( response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then( json => initialize(json) )
    .catch( err => console.error(`Fetch problem: ${err.message}`) );

function initialize(products) {
    const category = document.getElementById('category')
    const searchTerm = document.getElementById('search');
    const searchBtn = document.getElementById('searchButton');
    const main = document.querySelector('main');

    let lastCategory = category.value;
    let lastSearch = '';

    let categoryGroup;
    let finalGroup;

    finalGroup = products;
    updateDisplay();

    categoryGroup = [];
    finalGroup = [];

    searchBtn.onclick = selectCategory;

    function selectCategory(e) {
        e.preventDefault();

        categoryGroup = [];
        finalGroup = [];

        if(category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
            return;
        } else {
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();

            if(category.value === 'All') {
                counter = 4;
                categoryGroup = products;
                selectProducts();
            } else {
                let lowerCaseType = category.value.toLowerCase();
                for(let i = 0; i < products.length; i++){
                    if(products[i].type === lowerCaseType) {
                        categoryGroup.push(products[i]);
                    }
                }
                selectProducts();
            }
        }
    }

    function selectProducts() {
        if(searchTerm.value.trim() === '') {
            finalGroup = categoryGroup;
            updateDisplay();
        } else {
            let lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
    
            for(let i = 0; i < categoryGroup.length; i++) {
                if(categoryGroup[i].name.toLowerCase().includes(lowerCaseSearchTerm)) {
                    finalGroup.push(categoryGroup[i]);
                }
            }
            updateDisplay();
        }
    }
    
    function updateDisplay() {
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
    
        if(finalGroup.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'No results to display!';
            main.appendChild(para);
        } else {
            if (finalGroup.length > 4)
                length = 4;
            else
                length = finalGroup.length;
            for(let i = 0; i < length; i++) {
                fetchImg(finalGroup[i], i);
            }
        }
    }
    
    function fetchImg(product, i) {
        let url = './image/' + product.img;
        showProduct(url, product, i);
    }
    
    function showProduct(objURL, product, i) {
        const section = document.createElement('section');
        const img = document.createElement('img');
        const container = document.createElement('div');
        const prompt = document.createElement('p');
        const info = document.createElement('p');
        const brand = document.createElement('p');
        const spec = document.createElement('p');

        section.setAttribute('class', 'onClickTextOverImage');

        container.setAttribute('class', 'click');
        container.id = i;
        container.style.opacity = "0";
        container.onclick = function(){
            var x = document.getElementById(this.id);
            if(x.style.opacity === "0"){
                x.style.opacity = "1";
            } else if(x.style.opacity === "1"){
                x.style.opacity = "0";
            } else {
                x.style.opacity = "0";
            }
        }

        prompt.textContent = "Click to see more";

        info.setAttribute('id', 'product_name');
        info.textContent = product.name;
        brand.textContent = 'Brand: ' + product.brand;
        spec.textContent = 'Specification: ' + product.spec;
            
        img.src = objURL;
        img.alt = product.name;

        main.appendChild(section);
        section.appendChild(container);
        container.appendChild(info);
        container.appendChild(brand);
        container.appendChild(spec);
        section.appendChild(img);
        section.appendChild(prompt);
    }
}


window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight && category.value === 'All' && document.getElementById('search').value.trim() === "") {
        load();
    }
});



function load() {
    const main = document.querySelector('main');

    var start = counter;
    var end = start + 3;
    counter = end + 1;

    fetch('product.json').then(response => response.json()).then(function(json) {
        let products = json;
        for(start; start < end; start++) {
            const section = document.createElement('section');
            const img = document.createElement('img');
            const container = document.createElement('div');
            const prompt = document.createElement('p');
            const info = document.createElement('p');
            const brand = document.createElement('p');
            const spec = document.createElement('p');

            let url = './image/' + products[start].img;
    
            section.setAttribute('class', 'onClickTextOverImage');

            container.setAttribute('class', 'click');
            container.id = start;
            container.style.opacity = "0";
            container.onclick = function(){
                var x = document.getElementById(this.id);
                if(x.style.opacity === "0"){
                    x.style.opacity = "1";
                } else if(x.style.opacity === "1"){
                    x.style.opacity = "0";
                } else {
                    x.style.opacity = "0";
                }
            }

            prompt.textContent = "Click to see more";

            info.setAttribute('id', 'product_name');
            info.textContent = products[start].name;
            brand.textContent = 'Brand: ' + products[start].brand;
            spec.textContent = 'Specification: ' + products[start].spec;

            img.src = url;
            img.alt = products[start].name;
    
            main.appendChild(section);
            section.appendChild(container);
            container.appendChild(info);
            container.appendChild(brand);
            container.appendChild(spec);
            section.appendChild(img);
            section.appendChild(prompt);
        }
    })
        .catch(console.error);
};