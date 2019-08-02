//Scrape Button
$('#scrapeButton').on('click', (e) => {
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

//When a user clicks a 'p' tag
$(document).on('click', 'p', function() {
    //Empty the notes from the note section
    $('#notes').empty();
    //Save the id from the p tag
    let thisId = $(this).attr('data-id');
    //Ajax call for the Article
    $.ajax({
        method: 'GET',
        url: '/articles/' + thisId
    })
    //Adding Note info to the page
    .then(function(data) {
        console.log(data);
        //The title of the article
        $('#notes').append('<h3>' + data.title + '</h3>');
        //Input to enter a new title
        $('#notes').append("<input id='titleinput' name='title' >");
        //A text area to add a new note body
        $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
        //A button to submit a new note with the id of the article saved to it
        $('#notes').append("<button data-id'" + data._id + "' id='savenote'>Save Note</button>");

        //If there's a note in the article
        if(data.note) {
            //Place the title of the note in the title input
            $('#titleinput').val(data.note.title);
            //Place the body of the note in the body text area
            $('#bodyinput').val(data.note.body);
        }
    });
});

//When the user clicks the save note button
$(document).on('click', '#savenote', function() {
    //Grab the id associated w/ the article from the submit button
    let thisId = $(this).attr('data-id');

    //Run a POST request to change the note using the entered inputs
    $.ajax({
        method: 'POST',
        url: '/articles/' + thisId,
        data: {
            title: $('#titleinput').val(),
            body: $('#bodyinput').val()
        }
    })
    //Logging response and emptying notes section 
    .then(function(data) {
        console.log(data);
        $('#notes').empty();
    });
    //Remove the values entered in the input & text area for note entry
    $('#titleinput').val('');
    $('#bodyinput').val('');
});