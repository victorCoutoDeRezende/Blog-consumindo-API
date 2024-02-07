const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector('#comment-form')
const emailInput = document.querySelector('#email')
const bodyInput = document.querySelector('#body')


//_...--==>> Load post <<==--..._
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

//_...--==>> Get all posts <<==--..._

async function getAllPosts(){
    const response = await fetch(url)

    const data = await response.json()

    loadingElement.classList.add('hide')

    data.map((post)=>{
        const div = document.createElement('div')
        const title = document.createElement('h1')
        const body = document.createElement('p')
        const link = document.createElement('a')
        const id = document.createElement('p')
        const hr = document.createElement('hr')

        div.classList.add('post')
        body.classList.add('post-content')
        id.classList.add('id')

        id.innerText = "#" + post.id
        title.innerText = post.title
        body.innerText = post.body
        link.innerText = "Ler"
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.append(id, title, body, link)

        postsContainer.append(div, hr)
    })
}

//_...--==>> Get individual post <<==--..._
async function getPost(id) {
    const [responsePost, responseComments] = await Promise.all([
      fetch(`${url}/${id}`),
      fetch(`${url}/${id}/comments`),
    ]);
  
    const dataPost = await responsePost.json();
  
    const dataComments = await responseComments.json();
  
    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');

    const title = document.createElement('h1')
    const body = document.createElement('p')

    title.innerText = dataPost.title
    body.innerText = dataPost.body
    body.classList.add('post-content')

    postsContainer.append(title, body)

    dataComments.map((comment)=>{
        createComment(comment)
    })
}

function createComment(comment){
    const div = document.createElement('div')
    const email = document.createElement('h3')
    const body = document.createElement('p')
    const hr = document.createElement('hr')

    div.id= 'posts-container'
    body.classList.add('post-content')

    email.innerText = comment.email
    body.innerText = comment.body

    div.append(email, body, hr)

    commentsContainer.appendChild(div)
}

//_...--==>> Post a comment <<==--..._
async function postComment(comment){
    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            "Content-Type": "application/json",
        }
    })
    const data = await response.json()

    createComment(data)
}


if (!postId) {
    getAllPosts();
  } 
else{
    getPost(postId)
    //_...--==>> Add event to comment form <<==--..._
    commentForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        }
        comment = JSON.stringify(comment)

        postComment(comment)
    })
}