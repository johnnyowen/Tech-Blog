const newPost = async(event) => {
    event.preventDefault();
    const title = document.querySelector('#postTitle').value.trim();
    const text = document.querySelector('#postText').value.trim();
    const response = await fetch('api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title, 
            text
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    };
};

const deletePost = async(event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');
        const response = await fetch(`api/posts/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        };
    };
};

document.querySelector('#blogPosts').addEventListener('click', deletePost);
document.querySelector('.newPost').addEventListener('submit', newPost);