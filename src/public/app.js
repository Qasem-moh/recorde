const checkInForm = document.getElementById('checkInForm');
const checkOutForm = document.getElementById('checkOutForm');
const attendanceRecords = document.getElementById('attendanceRecords');

checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(checkInForm);
    const response = await fetch('http://localhost:3000/api/attendance/checkin', {
        method: 'POST',
        body: formData,
    });
    const result = await response.json();
    alert(result.message);
    // checkInForm.reset();
    fetchAttendanceRecords();
});

checkOutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(checkOutForm);
    const response = await fetch('http://localhost:3000/api/attendance/checkout', {
        method: 'POST',
        body: formData,
    });
    const result = await response.json();
    alert(result.message);
    checkOutForm.reset();
    fetchAttendanceRecords();
});

async function fetchAttendanceRecords() {
    const response = await fetch('http://localhost:3000/api/attendance/records');
    const records = await response.json();
    attendanceRecords.innerHTML = '';
    records.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.textContent = `Employee ID: ${record.employeeId}, Check-in: ${record.checkIn}, Check-out: ${record.checkOut}, Date: ${record.date}`;
        attendanceRecords.appendChild(recordElement);
    });
}

fetchAttendanceRecords();