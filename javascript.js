"use strict";
// variables
let mainDiv = document.getElementById("postMainBlock");
let postOverLay = document.getElementById("overlay");
let contentDiv = document.getElementById("content");
let closeIcon = document.getElementById("close");
let add = document.getElementById('add');
let overlayAdd = document.getElementById('overlay-add');
let form = document.getElementById('formElement');


function ajax(url, callback) {
  fetch(url, {
    method: 'GET',
  })
  .then(function (responce) {
    if (!responce.ok) {
      throw new Error();
    }
    return responce.json();
  })
  .then (function(responceData) {
    callback(responceData)
  })
  .catch(function(error) {
    alert(error);
  });
  // let requist = new XMLHttpRequest();
  // requist.open("GET", url);
  // requist.addEventListener("load", function () {
  //   let dataJs = JSON.parse(this.responseText);
  //   callback(dataJs);
  // });
  // requist.send();
}
ajax("https://jsonplaceholder.typicode.com/posts", function (data) {
  data.forEach((element) => {
    createPost(element);
  });
});

function createPost(item) {
  let divWraper = document.createElement("div");
  divWraper.classList.add("post-wraper");
  divWraper.setAttribute("data-id", item.id);

  let h3Title = document.createElement("h3");
  h3Title.innerText = item.id;

  let h2Title = document.createElement("h2");
  h2Title.innerText = item.title;

  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "delete this post";
  deleteBtn.setAttribute("data-delete-id", item.id);

  divWraper.appendChild(h3Title);
  divWraper.appendChild(h2Title);
  divWraper.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    let deleteId = e.target.getAttribute("data-delete-id");
    let deleteUrl = `https://jsonplaceholder.typicode.com/posts/${deleteId}`;
    
    fetch(deleteUrl, {
      method: "DELETE",
    }).then(() => divWraper.remove());
  });

  divWraper.addEventListener("click", function () {
    contentDiv.innerHTML = " ";
    postOverLay.classList.add("active");
    let id = this.getAttribute("data-id");
    let newUrl = `https://jsonplaceholder.typicode.com/posts/${id}`;
    ajax(newUrl, function (newData) {
      let p = document.createElement("p");
      p.innerText = newData.body;
      contentDiv.appendChild(p);
    });
  });

  mainDiv.appendChild(divWraper);
}

closeIcon.addEventListener("click", function () {
  postOverLay.classList.remove("active");
});


// new post
add.addEventListener('click', function() {
  overlayAdd.classList.add('overlayActive');
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  let formData = {
    title: event.target[0].value
  };

  fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((newObj) => {
    console.log(newObj)
    overlayAdd.classList.remove('overlayActive');
    event.target[0].value = " ";
    createPost(newObj);
  });
});