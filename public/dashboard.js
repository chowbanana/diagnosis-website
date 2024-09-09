var first_name_global;
var last_name_global;

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

function add_feedback_box(){
    const feedback = document.getElementById('feedback_box');
    feedback.style.display = "block";
    console.log(feedback);
}

function add_comment(){
    document.getElementById('question').style.display = 'none';
    document.getElementById('message').innerHTML = "<p>Thank you for letting us know! We will contact you shortly to address your concerns.</p>";
    const comment = document.getElementById('feedback').value;
    const first_name = first_name_global;
    const last_name = last_name_global;

    console.log(first_name, last_name, comment);

    fetch('/add_comment',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify({first_name, last_name, comment})
    })
}

function name_retrieval_form() {
    const id_num = document.getElementById('id_num').value;
    localStorage.setItem('id_num', id_num);
    window.location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/patient_comments')
        .then (response => {
            if (!response.ok) {
                throw new Error('Network response failed');
            }
            return response.json();
        })
        .then (data => {
            const table_headers = document.getElementById('table_headers');
            const table_body = document.getElementById('table_body');

            // Generate table headers
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    table_headers.appendChild(th);
                });
    
                // Generate table rows
                data.forEach( row => {
                    const tr = document.createElement('tr');
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.textContent = row[header];
                        tr.appendChild(td);
                    });
                    table_body.appendChild(tr);
                });
            } else{
                console.log('No data found');
            }
        })
        .catch(error => console.error(error));
});

document.addEventListener('DOMContentLoaded', () => {
    const id_num = localStorage.getItem('id_num');
    fetch('/api/user_details',{
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
            user_details_element.textContent = `${userDetails.first_name} ${userDetails.last_name}`;
            first_name_global = `${userDetails.first_name}`;
            last_name_global = `${userDetails.last_name}`;
        } else {
            user_details_element.textContent = 'Failed to load user details';
        }
    })

    .catch(error => {
        console.error('Error fetching user details:', error);
        document.getElementById('user_details').textContent = 'Error fetching user details';
    });
})

document.addEventListener('DOMContentLoaded', () => {
    const id_num = localStorage.getItem('id_num');
    fetch('/api/user_diagnosis',{
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
        const user_diagnosis_element = document.getElementById('user_diagnosis');
        if (data.success) {
            const userDiagnosis = data.diagnosis;
            user_diagnosis_element.textContent = `${userDiagnosis.diagnosis}`;
        } else {
            user_diagnosis_element.textContent = 'Failed to load user diagnosis';
        }
    })

    .catch(error => {
        console.error('Error fetching user details:', error);
        document.getElementById('user_details').textContent = 'Error fetching user details';
    });
})

document.addEventListener('DOMContentLoaded', () => {
    const id_num = localStorage.getItem('id_num');

    fetch('/api/maneuver_video',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id_num})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                const video_source = document.getElementById('video_source');
                video_source.src = "videos/" + data.maneuver + ".mp4";
                // console.log(video_source.src);
                document.getElementById('video_player').load();
            } else {
                alert('Video not Found!');
            }
        })

        .catch(error => console.error('Error:', error));
})

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
            // localStorage.setItem('token', data.token);
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