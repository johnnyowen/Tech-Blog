const updatePost = async(event) => {
    event.preventDefault();
    const postId = document.querySelector('input[name="post-id"]').value;
    const title = document.querySelector('#title').value.trim();
    const text = document.querySelector('#text').value.trim();

    const response = await fetch(`../../api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, text }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        console.log(response)
        alert(response.statusText);
    };
};

document.querySelector('.updatePostForm').addEventListener('submit', updatePost);
