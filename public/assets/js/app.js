//Scrape Button
$("#scrapeButton").on("click", (e) => {
    e.preventDefault();
    $.get("/articles").done((data) => {
        bb(data);
    }); 
});

let listContainer = $('#myArticles');

const bb = (data) => {
    let listItems = xx(data);
    listItems.forEach(item => {
        console.log(item);
        listContainer.append(item);
    });
};

let xx = (data) => {
    let arr = [];
    data.forEach((item) => {
        arr.push(`<li><span>${item.title}</span><span>${item.link}</span></li>`);
    });
    console.log(arr);
    return arr;
}

