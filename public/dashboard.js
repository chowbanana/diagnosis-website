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
    const id_num = document.getElementById('id_num').value;
    localStorage.setItem('id_num', id_num);
    window.location.href = 'dashboard.html';
}

// function name_retrieval_login(){
//     document.addEventListener('DOMContentLoaded', () => {
//         document.getElementById('first_name').textContent = localStorage.getItem('first_name');
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    const id_num = localStorage.getItem('id_num');
    fetch('/user_details',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id_num})
    })

    .then(response => {
        if (!response.ok) {
            throw new Error('Network response failed');
        }
        return response.json();
    })

    .then(data => {
        const user_details_element = document.getElementById('user_details');
        if (data.success) {
            const userDetails = data.user;
            user_details_element.textContent = `${userDetails.first_name}`;
        } else {
            user_details_element.textContent = 'Failed to load user details';
        }
    })

    .catch(error => {
        console.error('Error fetching user details:', error);
        document.getElementById('user_details').textContent = 'Error fetching user details';
    });
})

function password_match(input){
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

function compare_id_num_to_database() {
    const id_num = document.getElementById('id_num').value;
    localStorage.setItem('id_num', id_num);

    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id_num})
    })

    .then(response => response.json())
    .then(data => {
        const resultElement = document.getElementById('result');
        if (data.success){
            resultElement.textContent = 'Login Successful!';
            window.location.href = 'dashboard.html';
        } else {
            console.log('Login Failed');
            resultElement.textContent = 'Invalid IC/Passport Number';
            document.getElementById('id_num').value = '';
        }
    })

    .catch(error => {
        console.error('Error: ', error);
    });
}