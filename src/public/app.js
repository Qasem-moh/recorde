const checkInForm = document.getElementById('checkInForm');
const checkOutForm = document.getElementById('checkOutForm');
const attendanceRecords = document.getElementById('attendanceRecords');

checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(checkInForm);
    try {
        const response = await fetch('https://recorde.onrender.com/checkin', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            console.error('Response status:', response.status);
            const text = await response.text();
            console.error('Response text:', text);
            alert('Error: ' + response.status + ' ' + text);
            return;
        }
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            // console.error('JSON parse error:', parseError);
            const text = await response.text();
            console.error('Response text:', text);
            alert('Error: invalid JSON response from server');
            return;
        }
        alert(result.message || 'Success');
        // checkInForm.reset();
        // fetchAttendanceRecords();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Network error: ' + error.message);
    }
});

checkOutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(checkOutForm);
    try {
        const response = await fetch('https://recorde.onrender.com/checkout', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            console.error('Response status:', response.status);
            const text = await response.text();
            console.error('Response text:', text);
            alert('Error: ' + response.status + ' ' + text);
            return;
        }
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            const text = await response.text();
            console.error('Response text:', text);
            alert('Error: invalid JSON response from server');
            return;
        }
        alert(result.message || 'Success');
        checkOutForm.reset();
        // fetchAttendanceRecords();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Network error: ' + error.message);
    }
});

// async function fetchAttendanceRecords() {
//     try {
//         const response = await fetch('https://recorde.onrender.com/api/attendance/records');
//         if (!response.ok) {
//             console.error('Response status:', response.status);
//             const text = await response.text();
//             console.error('Response text:', text);
//             return;
//         }
//         const records = await response.json();
//         attendanceRecords.innerHTML = '';
//         records.forEach(record => {
//             const recordElement = document.createElement('div');
//             recordElement.textContent = `Check-in: ${record.checkInTime}, Check-out: ${record.checkOutTime}, Date: ${record.date}`;
//             attendanceRecords.appendChild(recordElement);
//         });
//     } catch (error) {
//         console.error('Fetch error:', error);
//     }
// }

// fetchAttendanceRecords();