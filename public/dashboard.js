function completed_tasks (boolean){
    document.getElementById('question').style.display = 'none';
    let messageDiv = document.getElementById('message')
    if (boolean){
        messageDiv.innerHTML = "<p>Tasks completed for the day</p>"
    }

    else{
        messageDiv.innerHTML = "<p>Tasks not completed for the day</p>"
    }

    return msg;
}

function name_retrieval_form() {
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    window.location.href = 'dashboard.html';
}

function name_retrieval_login() {
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('username').textContent = localStorage.getItem('username');
});

function password_match(input){
    console.log('nice');
    const initial_password = document.getElementById('password').value;

    if (input.value != initial_password){
        input.setCustomValidity('Password does not match');
    } else {
        input.setCustomValidity('');
    }
}

function compare_username_password_to_database() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })

    .then(response => response.json())
    .then(data => {
        const resultElement = document.getElementById('result');
        if (data.success){
            resultElement.textContent = 'Login Successful!';
            window.location.href = 'dashboard.html';
        } else {
            console.log('Login Failed');
            resultElement.textContent = 'Invalid username or password';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        
        }
    })

    .catch(error => {
        console.error('Error: ', error);
    });
}