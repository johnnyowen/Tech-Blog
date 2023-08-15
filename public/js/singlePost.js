const comment = async (event) => {
    event.preventDefault();
    const postId = document.querySelector('input[name="post-id"]').value;
    const text = document.querySelector('#commentText').value;
    if (text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text, postId
            }), 
        });
        if (response.ok) {
            document.location.reload();
        } else {
            console.log(response);
            alert(response.statusText);
        };
    };
};

document.querySelector('#comment').addEventListener('submit', comment);