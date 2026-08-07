import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [monthlySalary, setMonthlySalary] = useState(530)
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(28)

  // Fetch attendance records
  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/attendance')
      if (!response.ok) {
        const err = await response.text()
        console.error('API returned error:', response.status, err)
        throw new Error(`API /api/attendance failed ${response.status}: ${err}`)
      }
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error('Error fetching records:', error)
      alert('Problem fetching attendance records: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      const response = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInTime: new Date(),
          name: 'User',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCheckInTime(new Date().toLocaleTimeString());
        console.log('Check-in successful:', data);
        fetchRecords();
        alert('✅ Check-in recorded successfully!');
      } else {
        throw new Error(data.message || 'Check-in failed');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert('❌ Error checking in: ' + error.message);
    }
  }

  const handleCheckOut = async () => {
    try {
      const response = await fetch('/api/attendance/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkOutTime: new Date(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCheckOutTime(new Date().toLocaleTimeString());
        console.log('Check-out successful:', data);
        fetchRecords();
        alert('✅ Check-out recorded successfully!');
      } else {
        throw new Error(data.message || 'Check-out failed');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      alert('❌ Error checking out: ' + error.message);
    }
  }

  const calculateWorkingHours = (checkInTime, checkOutTime) => {
    if (!checkOutTime) {
      return '—';
    }
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diffMs = checkOut - checkIn;
    if (diffMs <= 0) return '—';
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  }

  const calculateOvertimeHours = (checkInTime, checkOutTime) => {
    if (!checkOutTime) {
      return '—';
    }
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diffMs = checkOut - checkIn;
    const totalHours = diffMs / (1000 * 60 * 60);
    const standardHours = 10;
    if (totalHours <= standardHours || totalHours <= 0) {
      return '0h 0m';
    }

    const overtimeHours = Math.floor(totalHours - standardHours);
    const overtimeMinutes = Math.round(((totalHours - standardHours) % 1) * 60);
    return `${overtimeHours}h ${overtimeMinutes}m`;
  }

  const calculateHourlyRate = () => {
    // راتب شهري / عدد أيام الدوام / 10 ساعات يومية
    return monthlySalary / workingDaysPerMonth / 10;
  }

  const calculateDailyWage = (checkInTime, checkOutTime) => {
    if (!checkOutTime) return 0;
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diffMs = checkOut - checkIn;
    const totalHours = diffMs / (1000 * 60 * 60);
    if (totalHours <= 0) return 0;
    const standardHours = 10;
    const standardWage = standardHours * calculateHourlyRate();

    if (totalHours <= standardHours) {
      return (totalHours * calculateHourlyRate()).toFixed(2);
    }

    return standardWage.toFixed(2);
  }

  const calculateOvertimeWage = (checkInTime, checkOutTime) => {
    if (!checkOutTime) return 0;
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diffMs = checkOut - checkIn;
    const totalHours = diffMs / (1000 * 60 * 60);
    const standardHours = 10;
    if (totalHours <= standardHours || totalHours <= 0) {
      return 0;
    }

    const overtimeHours = totalHours - standardHours;
    const hourlyRate = calculateHourlyRate();
    return (overtimeHours * hourlyRate).toFixed(2);
  }

  const calculateTotalWage = () => {
    let total = 0;
    attendanceRecords.forEach((record) => {
      const dailyWage = parseFloat(calculateDailyWage(record.checkInTime, record.checkOutTime)) || 0;
      const overtimeWage = parseFloat(calculateOvertimeWage(record.checkInTime, record.checkOutTime)) || 0;
      total += dailyWage + overtimeWage;
    });
    // Ensure final total is not negative due to any incorrect timestamps
    total = Math.max(0, total);
    return total.toFixed(2);
  }

  const getWorkedDaysCount = () => {
    return attendanceRecords.filter(record => record.checkOutTime).length;
  }

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      '⚠️ هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.\n\n⚠️ Are you sure you want to delete all data? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch('/api/attendance/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('All records deleted:', data);
        setCheckInTime(null);
        setCheckOutTime(null);
        fetchRecords();
        alert(`✅ تم حذف جميع البيانات بنجاح! (${data.deletedCount} records deleted)`);
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting records:', error);
      alert('❌ خطأ في حذف البيانات: ' + error.message);
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎯 Attendance Tracker</h1>
        <p>Track your daily check-in and check-out times</p>
      </div>

      <div className="salary-section">
        <div className="salary-input-group">
          <label htmlFor="salary">💰 Monthly Salary:</label>
          <input
            id="salary"
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || 0)}
            min="0"
            step="10"
          />
          <label htmlFor="workingDays">📅 Working Days/Month:</label>
          <input
            id="workingDays"
            type="number"
            value={workingDaysPerMonth}
            onChange={(e) => setWorkingDaysPerMonth(parseInt(e.target.value) || 28)}
            min="1"
            max="31"
            step="1"
          />
          <span className="salary-info">
            Hourly Rate: <strong>JD{calculateHourlyRate().toFixed(2)}</strong>
          </span>
        </div>
      </div>

      <div className="controls">
        <button className="btn btn-checkin" onClick={handleCheckIn}>
          ✓ Check In
        </button>
        <button className="btn btn-checkout" onClick={handleCheckOut}>
          ✗ Check Out
        </button>
        <button className="btn btn-refresh" onClick={fetchRecords}>
          🔄 Refresh
        </button>
        <button className="btn btn-delete" onClick={handleDeleteAll}>
          🗑️ Delete All Data
        </button>
      </div>

      <div className="status">
        {checkInTime && <p className="info">Last Check-in: {checkInTime}</p>}
        {checkOutTime && <p className="info">Last Check-out: {checkOutTime}</p>}
      </div>

      <div className="records">
        <h2>Attendance Records</h2>
        
        {attendanceRecords.length > 0 && (
          <div className="salary-summary">
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">📊 Total Worked Days:</span>
                <span className="summary-value">{getWorkedDaysCount()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">💵 Total Wage:</span>
                <span className="summary-value total">JD{calculateTotalWage()}</span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : attendanceRecords.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Working Hours</th>
                <th>Overtime</th>
                <th>Daily Wage</th>
                <th>Overtime Wage</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                  <td>
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString()
                      : 'Not checked out'}
                  </td>
                  <td className="working-hours">{calculateWorkingHours(record.checkInTime, record.checkOutTime)}</td>
                  <td className="overtime-hours">{calculateOvertimeHours(record.checkInTime, record.checkOutTime)}</td>
                  <td className="daily-wage">JD{calculateDailyWage(record.checkInTime, record.checkOutTime)}</td>
                  <td className="overtime-wage">JD{calculateOvertimeWage(record.checkInTime, record.checkOutTime)}</td>
                  <td className="total-wage">JD{(parseFloat(calculateDailyWage(record.checkInTime, record.checkOutTime)) + parseFloat(calculateOvertimeWage(record.checkInTime, record.checkOutTime))).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records yet.</p>
        )}
      </div>
    </div>
  )
}
